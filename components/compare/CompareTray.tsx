'use client';
import { useCompare } from '@/context/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CompareTray() {
  const { selectedColleges, removeFromCompare } = useCompare();

  const validFees = selectedColleges.map((c) => c.fees).filter((f) => f != null);
  const minFees = validFees.length > 0 ? Math.min(...validFees) : null;

  return (
    <AnimatePresence>
      {selectedColleges.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
        >
          <div className="bg-slate-900/90 text-white p-4 rounded-3xl shadow-2xl border border-slate-700 backdrop-blur-xl flex items-center justify-between">
            <div className="flex gap-3">
              {selectedColleges.map((college) => {
                const isWinner = selectedColleges.length > 1 && college.fees === minFees;
                return (
                  <div key={college.id} className="relative group">
                    <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${isWinner ? 'border-green-500' : 'border-blue-500'}`}>
                      <img src={college.image_url} alt={college.name} className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(college.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {[...Array(3 - selectedColleges.length)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-700">
                  <Plus className="w-4 h-4" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{selectedColleges.length} selected</p>
                <p className="text-xs text-slate-400">Max 3 colleges</p>
              </div>
              <Link
                href="/compare"
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                  selectedColleges.length >= 2 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                onClick={(e) => selectedColleges.length < 2 && e.preventDefault()}
              >
                Compare <ArrowRightLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
