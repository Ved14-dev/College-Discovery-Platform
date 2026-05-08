'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxSection({ 
  children, 
  title 
}: { 
  children?: React.ReactNode; 
  title: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Background moves slower than the foreground to create depth
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
      {/* Background Layer */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0 opacity-50"
      >
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000" 
          alt="Campus Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content Layer */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-10 text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {title}
        </h1>
        {children}
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-20" />
    </div>
  );
}
