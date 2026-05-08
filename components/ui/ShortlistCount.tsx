'use client';
import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';

export default function ShortlistCount() {
  const { selectedColleges } = useCompare();

  return (
    <Link
      href="/compare"
      className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
    >
      Shortlist
      {selectedColleges.length > 0 && (
        <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
          {selectedColleges.length}
        </span>
      )}
    </Link>
  );
}
