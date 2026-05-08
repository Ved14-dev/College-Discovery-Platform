'use client';
import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';

import { motion } from 'framer-motion';

// Stable Unsplash fallback in case a specific college image fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80';

export default function CollegeCard({ college, index = 0 }: { college: any, index?: number }) {
  const { addToCompare, removeFromCompare, selectedColleges, isCompareFull } = useCompare();
  const isSelected = selectedColleges.some((c) => c.id === college.id);

  // Dynamic Badge: Gold (Top 10), Silver (Top 50), Bronze (Top 100)
  const rank = college.rank || 999;
  let rankBadgeClass = 'bg-slate-700 text-white';
  if (rank <= 10) rankBadgeClass = 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900';
  else if (rank <= 50) rankBadgeClass = 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800';
  else if (rank <= 100) rankBadgeClass = 'bg-gradient-to-r from-amber-700 to-amber-900 text-white';

  // Value Score (Vs) Calculation
  const assumedSalary = college.median_salary || (1500000 - ((college.rank || 10) * 50000));
  const placementRate = 0.98 - ((college.rank || 10) * 0.005);
  const nirfInverse = (100 - (college.rank || 10)) / 100;
  const roiFactor = college.fees ? (assumedSalary / college.fees) : 0;
  
  const valueScore = (placementRate * 0.4) + (roiFactor * 0.4) + (nirfInverse * 0.2);

  let valueBadge = '';
  let valueColor = '';
  if (valueScore > 2.5) { valueBadge = 'Budget Friendly'; valueColor = 'bg-emerald-100 text-emerald-800'; }
  else if (valueScore > 1.5) { valueBadge = 'Balanced Value'; valueColor = 'bg-blue-100 text-blue-800'; }
  else { valueBadge = 'High Investment'; valueColor = 'bg-amber-100 text-amber-800'; }

  // Indian Rupee formatting
  const formattedFees = college.fees
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(college.fees)
    : 'Contact for Fees';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group relative border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      {/* College Image with fallback */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={college.image_url || FALLBACK_IMAGE}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            // Prevent infinite loop if fallback itself fails
            if (target.src !== FALLBACK_IMAGE) {
              target.src = FALLBACK_IMAGE;
            }
          }}
        />
        {/* Rank Badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full shadow-lg ${rankBadgeClass}`}
        >
          #{college.rank || 'N/A'}
        </span>
        
        {/* Value Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md ${valueColor}`}
        >
          {valueBadge}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/colleges/${college.id}`}>
          <h3
            className="font-bold text-slate-900 dark:text-slate-100 mb-1 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
            title={college.name}
          >
            {college.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{college.location || 'India'}</p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Annual Fees</p>
            <p className="font-black text-blue-600 text-sm">{formattedFees}</p>
          </div>

          <button
            onClick={() => (isSelected ? removeFromCompare(college.id) : addToCompare(college))}
            disabled={!isSelected && isCompareFull}
            title={
              isSelected
                ? 'Remove from compare'
                : isCompareFull
                ? 'Maximum 3 colleges selected'
                : 'Add to compare'
            }
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
              isSelected
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 hover:bg-emerald-200'
                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
          >
            {isSelected ? '✓' : '+'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
