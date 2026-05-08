'use client';
import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';

export default function ComparePage() {
  const { selectedColleges, removeFromCompare } = useCompare();

  if (selectedColleges.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="text-6xl mb-6">⚖️</div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">No Colleges Selected</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Start comparing by adding colleges from the directory. You can select up to 3.</p>
        <Link
          href="/colleges"
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
        >
          Browse Directory →
        </Link>
      </div>
    );
  }

  const formatFees = (fees: number | null) =>
    fees ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fees) : 'N/A';

  const rows = [
    { label: ' NIRF Rank', key: 'rank', render: (c: any) => c.rank ? `#${c.rank}` : 'N/A' },
    { label: ' Annual Fees', key: 'fees', render: (c: any) => formatFees(c.fees) },
    { label: ' Location', key: 'location', render: (c: any) => c.location || 'N/A' },
    { label: ' Admission Cutoff', key: 'cutoff_score', render: (c: any) => c.cutoff_score ? `${c.cutoff_score}%` : 'N/A' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <Link href="/colleges" className="text-sm text-slate-400 hover:text-blue-600 transition-colors mb-2 inline-block">
              ← Back to Directory
            </Link>
            <h1 className="text-4xl font-black text-slate-900">Side-by-Side Comparison</h1>
          </div>
          <span className="self-start sm:self-auto bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold px-5 py-3 rounded-2xl">
            {selectedColleges.length} / 3 Selected
          </span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50">
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={{ padding: '1.5rem 2rem', textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9', width: '200px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Feature
                </th>
                {selectedColleges.map((c) => (
                  <th key={c.id} style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #f1f5f9', minWidth: '220px', position: 'relative' }}>
                    <button
                      onClick={() => removeFromCompare(c.id)}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1 }}
                    >
                      ×
                    </button>
                    <img
                      src={c.image_url}
                      alt={c.name}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }}
                    />
                    <div style={{ fontWeight: '800', color: '#0f172a', lineHeight: 1.3, fontSize: '0.95rem' }}>{c.name}</div>
                  </th>
                ))}
                {[...Array(3 - selectedColleges.length)].map((_, i) => (
                  <th key={i} style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #f1f5f9' }}>
                    <Link
                      href="/colleges"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8', textDecoration: 'none', gap: '8px', fontSize: '0.85rem', fontWeight: '600', transition: 'border-color 0.2s' }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>+</span>
                      Add College
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.key} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#475569', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                    {row.label}
                  </td>
                  {selectedColleges.map((c) => (
                    <td key={c.id} style={{ padding: '1.25rem', textAlign: 'center', borderBottom: '1px solid #f1f5f9', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>
                      {row.render(c)}
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => (
                    <td key={i} style={{ padding: '1.25rem', textAlign: 'center', borderBottom: '1px solid #f1f5f9', color: '#cbd5e1' }}>—</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
