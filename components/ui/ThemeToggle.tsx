'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform z-50 flex items-center justify-center group"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-6 h-6 text-amber-500 opacity-100 dark:opacity-0 transition-opacity" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Moon className="w-6 h-6 text-indigo-400 opacity-0 dark:opacity-100 transition-opacity" />
      </motion.div>
    </button>
  );
}
