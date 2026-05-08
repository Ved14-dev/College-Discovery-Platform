'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CollegeCard from '@/components/colleges/CollegeCard';

export default function CollegeDirectory() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchColleges = async () => {
      setLoading(true);
      const searchTerm = search.trim();
      try {
        let query = supabase.from('colleges').select('*').order('rank', { ascending: true });
        if (searchTerm) {
          let searchOr = `name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`;
          if (searchTerm.toLowerCase().includes('iit')) {
            searchOr += `,name.ilike.%Indian Institute of Technology%`;
          } else if (searchTerm.toLowerCase().includes('nit')) {
            searchOr += `,name.ilike.%National Institute of Technology%`;
          }
          query = query.or(searchOr);
        }
        const { data, error } = await query;
        if (error) { setColleges([]); } 
        else { setColleges(data || []); }
      } catch { setColleges([]); } 
      finally { setLoading(false); }
    };
    fetchColleges();
  }, [search, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Explore <span className="text-blue-400">500+</span> Colleges
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-xl">
            Find ranked institutions by name, city, or keyword. Data sourced from official NIRF rankings.
          </p>

          {/* Glassmorphism Search Bar */}
          <div className="relative max-w-2xl group">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative flex items-center bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl overflow-hidden focus-within:border-blue-400/60 focus-within:bg-white/15 transition-all duration-300">
              <svg className="w-5 h-5 text-slate-400 ml-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                autoComplete="off"
                placeholder="Search by college or city (e.g. Delhi, IIT)..."
                className="w-full px-4 py-5 bg-transparent text-white placeholder-slate-400 outline-none text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="mr-4 text-slate-400 hover:text-white transition-colors text-xl font-light">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12 pb-40">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl bg-white shadow-sm h-72 flex flex-col overflow-hidden">
                <div className="h-44 bg-slate-200 animate-pulse w-full" />
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                  <div className="mt-auto flex justify-between">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3" />
                    <div className="w-9 h-9 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : colleges.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Showing <span className="font-bold text-slate-700">{colleges.length}</span> institution{colleges.length !== 1 ? 's' : ''}
              {search && <> for "<span className="text-blue-600">{search}</span>"</>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm border border-blue-200">
              👩‍💼
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Consultant Message</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative mb-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 rotate-45"></div>
              <p className="text-slate-600 font-medium italic">
                "We couldn't find a match for those scores in Mumbai, but here are 3 colleges in Pune that fit your profile."
              </p>
            </div>
            <button
              onClick={() => setSearch('')}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
