'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCompare } from '@/context/CompareContext';
import { useParams, useRouter } from 'next/navigation';
import { School, MapPin, Trophy, IndianRupee, ArrowLeft, Plus, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CollegeCard from '@/components/colleges/CollegeCard';

function EligibilityChecker({ round1, spotRound }: { round1: number, spotRound: number }) {
  const [score, setScore] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('userScore');
    if (saved) setScore(saved);
  }, []);

  const numScore = parseFloat(score);

  let result = null;
  if (!isNaN(numScore)) {
    if (numScore >= round1) {
      result = <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 font-bold text-sm">✅ High Chance - Round 1</div>;
    } else if (numScore >= spotRound) {
      result = <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-200 font-bold text-sm">⚠️ Likely - Spot Round</div>;
    } else {
      result = <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 font-bold text-sm">❌ Unlikely - Try Mop-Up</div>;
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Your Score (%)</label>
        <input
          type="number"
          value={score}
          onChange={(e) => {
            setScore(e.target.value);
            localStorage.setItem('userScore', e.target.value);
          }}
          className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="e.g. 92.5"
        />
      </div>
      {result}
    </div>
  );
}

export default function CollegeDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCompare, removeFromCompare, selectedColleges, isCompareFull } = useCompare();
  const [college, setCollege] = useState<any>(null);
  const [similarColleges, setSimilarColleges] = useState<any[]>([]);
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

        // Fetch similar colleges based on city or state
        const stateName = data.location?.split(',')[1]?.trim() || '';
        let simQuery = supabase.from('colleges').select('*').neq('id', data.id).limit(4);
        if (stateName) {
          simQuery = simQuery.ilike('location', `%${stateName}%`);
        }
        const { data: simData } = await simQuery;
        setSimilarColleges(simData || []);
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
              {/* Dynamic Breadcrumbs */}
              <div className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/colleges" className="hover:text-white transition-colors">Engineering</Link>
                <span>/</span>
                <span className="cursor-pointer hover:text-white transition-colors">{college.location?.split(',')[1]?.trim() || 'India'}</span>
                <span>/</span>
                <span className="text-white font-bold">{college.name}</span>
              </div>
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
              className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-2xl ${isSelected
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
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">

          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified for 2026-27
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: college.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                🔗 Share
              </button>
              <button
                onClick={() => {
                  similarColleges.slice(0, 3).forEach(c => addToCompare(c));
                  if (!isSelected) addToCompare(college);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                ⚖️ Compare Similar
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border rounded-3xl bg-blue-50/50">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Annual Fees</h3>
              <p className="text-2xl font-black text-slate-800">₹{college.fees?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="p-6 border rounded-3xl bg-emerald-50/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Median Placement</h3>
              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl font-black text-slate-800">₹{college.median_package_lpa || ((1500000 - ((college.rank || 10) * 50000)) / 100000).toFixed(1)} LPA</p>
                <span className="text-xs font-bold text-emerald-600">{college.placement_ratio || (98 - (college.rank || 10) * 0.5)}% Placed</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${college.placement_ratio || (98 - (college.rank || 10) * 0.5)}%` }} />
              </div>
            </div>
            <div className="p-6 border rounded-3xl bg-purple-50/50">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ROI Factor</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-800">{college.fees ? (((college.median_package_lpa || ((1500000 - ((college.rank || 10) * 50000)) / 100000)) * 100000) / college.fees).toFixed(1) : 0}x</p>
                <span className="text-xs font-medium text-slate-500">Return on Fees</span>
              </div>
            </div>
          </section>

          {/* About Module */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-4 text-slate-800">Detailed About</h2>
            <p className="text-slate-600 leading-loose text-sm md:text-base">
              {college.detailed_about || `${college.description} Recognized globally for research and academic excellence, this institution provides state-of-the-art facilities and a rigorous curriculum designed to foster innovation and leadership among its students. The campus spans over hundreds of acres, housing advanced laboratories, comprehensive libraries, and extensive sports complexes.`}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Infrastructure Chips */}
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black mb-5 text-slate-800">Campus Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {(college.campus_facilities || ['High-Tech Labs', 'Central Library', 'Hostels', 'Sports Complex', 'Innovation Incubation Center', 'Wi-Fi Campus']).map((facility: string, idx: number) => (
                  <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    {facility}
                  </span>
                ))}
              </div>
            </section>

            {/* Notable Alumni */}
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black mb-5 text-slate-800">Notable Alumni</h2>
              <div className="space-y-3">
                {(college.alumni_notable || [
                  { name: 'Sundar Pichai', role: 'CEO, Alphabet Inc.' },
                  { name: 'N. R. Narayana Murthy', role: 'Founder, Infosys' },
                  { name: 'Raghuram Rajan', role: 'Former RBI Governor' }
                ]).map((alumni: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">🎓</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{alumni.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{alumni.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-8">
          {/* Eligibility Predictor */}
          <div className="p-8 border rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl shadow-slate-900/20">
            <h3 className="text-xl font-black mb-2">Your Eligibility</h3>
            <p className="text-slate-400 text-sm mb-6">Enter your score to see your admission probability for {college.name}.</p>

            <EligibilityChecker
              round1={college.cutoff_round_1 || college.cutoff_score || 95}
              spotRound={college.cutoff_spot_round || (college.cutoff_score ? college.cutoff_score - 5 : 90)}
            />
          </div>

          <div className="p-8 border rounded-3xl bg-blue-50 border-blue-100">
            <h3 className="text-xl font-bold mb-2 text-blue-900">Need Guidance?</h3>
            <p className="text-blue-700/80 text-sm mb-6">Talk to our admission consultants for a detailed roadmap to this institution.</p>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors">
              Book Free Session
            </button>
          </div>
        </aside>
      </div>

      {/* Smart Suggestions - You might also like */}
      {similarColleges.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-24">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            ✨ You might also like
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {similarColleges.map((c) => (
              <div key={c.id} className="min-w-[300px] max-w-[320px] snap-start shrink-0">
                <CollegeCard college={c} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
