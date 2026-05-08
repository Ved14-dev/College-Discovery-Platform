'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCompare } from '@/context/CompareContext';
import { useParams, useRouter } from 'next/navigation';
import { School, MapPin, Trophy, IndianRupee, ArrowLeft, Plus, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CollegeDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCompare, removeFromCompare, selectedColleges, isCompareFull } = useCompare();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollege() {
      setLoading(true);
      // Try to fetch by ID first, then by name
      let query = supabase.from('colleges').select('*');
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug as string);
      
      if (isUuid) {
        query = query.eq('id', slug);
      } else {
        query = query.ilike('name', slug as string);
      }

      const { data, error } = await query.single();
      
      if (error || !data) {
        console.error('Error fetching college details:', error);
      } else {
        setCollege(data);
      }
      setLoading(false);
    }

    if (slug) fetchCollege();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">College not found</h1>
        <Link href="/colleges" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  const isSelected = selectedColleges.some((c) => c.id === college.id);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={college.image_url} 
          alt={college.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="mb-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{college.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="w-4 h-4" /> {college.location}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Trophy className="w-4 h-4" /> NIRF Rank #{college.rank}
                </span>
              </div>
            </div>
            <button
              onClick={() => isSelected ? removeFromCompare(college.id) : addToCompare(college)}
              disabled={!isSelected && isCompareFull}
              className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-2xl ${
                isSelected 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50'
              }`}
            >
              {isSelected ? (
                <><Check className="w-5 h-5" /> Added to Compare</>
              ) : (
                <><Plus className="w-5 h-5" /> Add to Compare</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">About the Institution</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {college.description}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 border rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Fees</h3>
              <p className="text-3xl font-bold">₹{college.fees.toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-2">Verified for Academic Session 2026-27</p>
            </div>
            <div className="p-8 border rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Cutoff</h3>
              <p className="text-3xl font-bold">{college.cutoff_score}%</p>
              <p className="text-sm text-slate-500 mt-2">Expected percentile for top branch</p>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="p-8 border rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
            <h3 className="text-xl font-bold mb-4">Admissions Open</h3>
            <p className="text-blue-100 mb-8">Get personalized insights and check your admission probability with our AI tool.</p>
            <Link 
              href="/predictor"
              className="block w-full text-center bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
            >
              Check Probability
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
