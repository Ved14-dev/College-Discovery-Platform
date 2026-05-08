'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Category = 'General' | 'OBC' | 'SC' | 'ST';
type Branch = 'CS' | 'IT' | 'Core' | 'Other';

interface Result {
  name: string;
  rank: number;
  cutoff_score: number;
  effectiveCutoff: number;
  chance: number;
  tier: 'high' | 'medium' | 'low';
  breakdown: string;
}

function computeChance(score: number, rawCutoff: number, category: Category, branch: Branch): Omit<Result, 'name' | 'rank' | 'cutoff_score'> {
  // Step 1: Adjust effective cutoff by category reservation
  let effectiveCutoff = rawCutoff;
  if (category === 'SC' || category === 'ST') effectiveCutoff = rawCutoff * 0.85;
  else if (category === 'OBC') effectiveCutoff = rawCutoff * 0.95;

  // Step 2: Adjust for branch difficulty
  if (branch === 'CS' || branch === 'IT') effectiveCutoff = effectiveCutoff * 1.03;

  const ec = parseFloat(effectiveCutoff.toFixed(1));
  const ratio = score / ec;

  // Step 3: Map ratio to probability band
  let chance: number;
  if (ratio >= 1.06) chance = 96;
  else if (ratio >= 1.02) chance = 87;
  else if (ratio >= 0.98) chance = 60;
  else if (ratio >= 0.93) chance = 28;
  else if (ratio >= 0.88) chance = 12;
  else chance = 4;

  const tier: 'high' | 'medium' | 'low' = chance > 80 ? 'high' : chance > 45 ? 'medium' : 'low';

  // Step 4: Build plain-text breakdown (no emojis per spec)
  const reservationText =
    category !== 'General'
      ? ` ${category} reservation reduces effective cutoff to ${ec}% (from ${rawCutoff}%).`
      : '';
  const branchText =
    branch === 'CS' || branch === 'IT'
      ? ` ${branch} branch adds 3% difficulty to the adjusted cutoff.`
      : '';
  const breakdown = `Your score of ${score}% vs effective cutoff of ${ec}%.${reservationText}${branchText} Score-to-cutoff ratio: ${(ratio * 100).toFixed(1)}%.`;

  return { effectiveCutoff: ec, chance, tier, breakdown };
}

const tierConfig = {
  high:   { label: 'High Probability',   bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800', value: 'text-emerald-700' },
  medium: { label: 'Good Probability',   bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-800',     value: 'text-amber-700'   },
  low:    { label: 'Low Probability',    bar: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-800',       value: 'text-rose-700'    },
};

export default function AIPredictor() {
  const [score, setScore] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [branch, setBranch] = useState<Branch>('CS');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(score);
    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid score between 0 and 100.');
      return;
    }
    setError('');
    setLoading(true);
    setHasRun(true);

    const { data, error: dbError } = await supabase
      .from('colleges')
      .select('name, rank, cutoff_score')
      .order('rank', { ascending: true });

    if (dbError) {
      setError('Failed to load college data. Please check your connection.');
      setLoading(false);
      return;
    }

    setResults(
      (data || []).map((c) => ({
        name: c.name,
        rank: c.rank,
        cutoff_score: c.cutoff_score || 85,
        ...computeChance(s, c.cutoff_score || 85, category, branch),
      }))
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-24" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div
        className="pt-8 pb-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}
      >
        <span className="inline-block bg-white/10 border border-white/20 text-purple-300 text-xs font-bold px-5 py-2 rounded-full mb-6 tracking-widest uppercase">
          Multi-Factor AI Model
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Admission Predictor
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Category reservations and branch competition are factored into every probability score.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl sticky top-24"
          >
            <h2 className="text-lg font-black text-slate-800 mb-6">Your Profile</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Entrance Score (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  placeholder="e.g. 94.5"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-2xl font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 outline-none transition-all"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 outline-none transition-all"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Effective cutoff minus 5%)</option>
                  <option value="SC">SC (Effective cutoff minus 15%)</option>
                  <option value="ST">ST (Effective cutoff minus 15%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Branch
                </label>
                <select
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 outline-none transition-all"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as Branch)}
                >
                  <option value="CS">Computer Science (Higher competition)</option>
                  <option value="IT">Information Technology (Higher competition)</option>
                  <option value="Core">Core Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {error && (
                <p className="text-rose-600 text-sm font-bold bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-60 text-base"
              >
                {loading ? 'Analyzing...' : 'Run Prediction'}
              </button>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 space-y-1.5">
                <p>SC/ST reservation: Cutoff reduced by 15%</p>
                <p>OBC reservation: Cutoff reduced by 5%</p>
                <p>CS/IT branch: Competition adds 3% difficulty</p>
              </div>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!hasRun && (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-slate-100">
                AI
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Ready to Analyze</h3>
              <p className="text-slate-400 max-w-xs text-sm">
                Enter your score, category, and target branch to generate a personalized Admission Probability Report.
              </p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-3xl h-52 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <h2 className="text-2xl font-black text-slate-800">Probability Report</h2>
                <span className="text-sm text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-medium">
                  Score: {score}% — {category} — {branch}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {results.map((r, i) => {
                  const cfg = tierConfig[r.tier];
                  return (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 leading-tight text-sm line-clamp-2">{r.name}</p>
                          <p className="text-xs text-slate-400 mt-1">Rank {r.rank} — Raw Cutoff {r.cutoff_score}%</p>
                        </div>
                        <span className={`text-xs font-black px-3 py-1 rounded-full shrink-0 whitespace-nowrap ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Probability Gauge */}
                      <div className="mb-4">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs text-slate-400 font-medium">Admission Chance</span>
                          <span className={`text-2xl font-black ${cfg.value}`}>{r.chance}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                            style={{ width: `${r.chance}%` }}
                          />
                        </div>
                      </div>

                      {/* Logic Breakdown */}
                      <details className="group cursor-pointer">
                        <summary className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium list-none select-none flex items-center gap-1.5">
                          <span className="inline-block transition-transform group-open:rotate-90">&#9658;</span>
                          View Logic Breakdown
                        </summary>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">
                          {r.breakdown}
                        </p>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
