import Link from "next/link";

const stats = [
  { label: 'Colleges Listed', value: '500+' },
  { label: 'Live Cutoffs', value: '2026' },
  { label: 'Ranked Institutions', value: '100%' },
  { label: 'AI Powered', value: '✦' },
];

export default function Home() {
  return (
    <div className="flex flex-col" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        {/* Background Glow Orbs (CSS only, no JS) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block bg-white/10 border border-white/20 text-blue-300 text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm">
            Track B · College Discovery Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Discover Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dream College
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore 500+ top-tier institutions with NIRF-verified rankings, real fee data, and AI-powered admission probability predictions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/colleges"
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-blue-500/30 text-lg"
            >
              Explore Colleges →
            </Link>
            <Link
              href="/predictor"
              className="px-10 py-5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/15 transition-all backdrop-blur-sm text-lg"
            >
              ✦ AI Predictor
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">One platform to discover, compare, and predict your admission chances.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/colleges" className="group block p-8 border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🏛️</div>
              <h3 className="text-xl font-bold mb-3">Smart Directory</h3>
              <p className="text-slate-500 leading-relaxed">Real-time search across 500+ colleges by name, city, or keyword. NIRF ranks included.</p>
            </Link>

            <Link href="/compare" className="group block p-8 border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">⚖️</div>
              <h3 className="text-xl font-bold mb-3">College Compare</h3>
              <p className="text-slate-500 leading-relaxed">Add up to 3 colleges and compare rank, fees, location, and cutoff scores side by side.</p>
            </Link>

            <Link href="/predictor" className="group block p-8 border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Predictor</h3>
              <p className="text-slate-500 leading-relaxed">Multi-factor probability model with reservation logic, branch difficulty weighting, and logic breakdown.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
