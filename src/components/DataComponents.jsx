import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { iconMap, Modal } from './UIComponents';
import { formatPercent } from '../utils/formatters';

export function TechCard({ item, type = 'ai', children }) {
  const Icon = iconMap[item.icon] || iconMap.Eye;
  const status = item.active ?? item.available;
  return <div className="glass p-4"><div className="mb-2 flex items-center gap-2"><Icon size={18} className="text-cyan-400" /><h3 className="font-semibold">{item.name}</h3></div><p className="text-sm opacity-80">{item.shortDescription || item.description}</p><div className="mt-2 flex items-center justify-between"><span className={`rounded-full px-2 py-1 text-xs ${status ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{status ? 'Aktif' : 'Nonaktif'}</span><Link to={type === 'ai' ? `/ai-technologies/${item.id}` : `/eye-technologies/${item.id}`} className="text-sm text-cyan-300 underline">Detail</Link></div>{children}</div>;
}

export const AITechCard = ({ item, onQuickAnalyze }) => <TechCard item={item} type="ai"><button onClick={() => onQuickAnalyze(item)} className="mt-3 w-full rounded bg-indigo-500/20 px-3 py-1 text-sm">Quick Analyze</button></TechCard>;
export const EyeTechCard = ({ item }) => <TechCard item={item} type="eye" />;

export function ChartCard({ title, type = 'bar', data = [], keys = [] }) {
  return (
    <div className="glass p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <div className="h-56">
        <ResponsiveContainer>
          {type === 'pie' ? (
            <PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>{data.map((_, i) => <Cell key={i} fill={['#22d3ee', '#818cf8', '#c084fc', '#14b8a6', '#60a5fa'][i % 5]} />)}</Pie><Tooltip /></PieChart>
          ) : type === 'line' ? (
            <LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" /><YAxis /><Tooltip />{keys.map((k) => <Line key={k.key} dataKey={k.key} stroke={k.color} strokeWidth={2} />)}</LineChart>
          ) : (
            <BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="month" /><YAxis /><Tooltip />{keys.map((k) => <Bar key={k.key} dataKey={k.key} fill={k.color} radius={6} />)}</BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function UploadPanel({ onFile }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFile(file, url);
  };

  return <div className="glass p-4 space-y-2"><input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} /><button className="rounded bg-white/10 px-3 py-1 text-sm" onClick={() => { setPreview(''); onFile(null, ''); }}>Hapus file</button>{error && <p className="text-sm text-red-300">{error}</p>}{preview ? <img src={preview} alt="preview" className="h-56 w-full rounded-xl object-cover" /> : <p className="text-sm opacity-70">Belum ada file dipilih.</p>}</div>;
}

export function AnalysisResultCard({ result }) {
  if (!result) return <div className="glass p-4 text-sm">Belum ada hasil analisis.</div>;
  const explanation = result.explainability || {};
  return <div className="glass p-4 space-y-2">
    <p>Probable Condition: <b className="text-cyan-300">{result.probableCondition}</b></p>
    <p>Confidence: <b className="text-cyan-300">{result.confidence}%</b> | Risk: <b>{result.riskLevel}</b> | Severity: <b>{result.severityLevel}</b></p>
    <p>Urgency: {result.urgency} | Eye Health Score: <b>{result.eyeHealthScore}</b></p>
    <p className="text-sm">Alternative: {(result.alternativeConditions || []).map((a) => `${a.condition} (${a.probability}%)`).join(', ') || '-'}</p>
    <div className="rounded-xl bg-white/5 p-2 text-sm">
      <p className="font-semibold">Why this result?</p>
      <p>{explanation.whyThisResult}</p>
      <ul className="list-disc pl-5">{(explanation.topFactors || []).slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
    <p className="text-sm">Recommendations: {(result.recommendations || []).join(', ')}</p>
    <p className="text-sm">Related Eye Technologies: {(result.relatedTechnologies || []).join(', ') || '-'}</p>
    <div className="h-44"><ResponsiveContainer><BarChart data={result.chart}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#22d3ee" /></BarChart></ResponsiveContainer></div>
  </div>;
}

export function ReportCard({ report, onView, onDelete }) {
  return <div className="glass p-3"><p className="font-semibold">{report.id} - {report.module}</p><p className="text-sm opacity-80">{report.patient} • {report.date} • {report.risk}</p><div className="mt-2 flex gap-2"><button onClick={() => onView(report)} className="rounded bg-cyan-500/20 px-3 py-1 text-sm">Detail</button><button onClick={() => onDelete(report.id)} className="rounded bg-red-500/20 px-3 py-1 text-sm">Hapus</button></div></div>;
}

export function HistoryTable({ rows, onDelete }) {
  return <div className="glass overflow-auto p-3"><table className="w-full text-sm"><thead><tr className="text-left"><th>ID</th><th>Tipe</th><th>Pasien</th><th>Risk</th><th>Tanggal</th><th></th></tr></thead><tbody>{rows.map((r) => <tr key={r.id} className="border-t border-white/10"><td>{r.id}</td><td>{r.type}</td><td>{r.patient}</td><td>{r.risk}</td><td>{r.date}</td><td><button className="text-red-300" onClick={() => onDelete(r.id)}>Hapus</button></td></tr>)}</tbody></table></div>;
}

export function ArticleCard({ article, onOpen }) { return <button onClick={() => onOpen(article)} className="glass p-4 text-left"><p className="font-semibold">{article.title}</p><p className="text-xs text-cyan-300">{article.category}</p><p className="text-sm opacity-80 mt-1">{article.content.slice(0, 95)}...</p></button>; }

export function ChatWindow({ messages }) {
  return <div className="glass h-80 overflow-y-auto p-3 space-y-2">{messages.map((m, i) => <div key={i} className={`rounded-xl px-3 py-2 text-sm ${m.sender === 'user' ? 'bg-cyan-500/20 ml-8' : 'bg-white/10 mr-8'}`}><div>{m.text}</div>{m.suggestions?.length ? <div className="mt-2 flex flex-wrap gap-1">{m.suggestions.slice(0,3).map((s)=> <span key={s} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{s}</span>)}</div> : null}</div>)}</div>;
}

export function PaginationLoadMore({ hasMore, onClick }) { return hasMore ? <button onClick={onClick} className="glass px-4 py-2">Load More</button> : null; }

export function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);
  return <div className="glass p-4"><div className="mb-3 flex gap-2">{tabs.map((t) => <button key={t.id} onClick={() => setActive(t.id)} className={`rounded px-3 py-1 text-sm ${active === t.id ? 'bg-cyan-500/20' : 'bg-white/10'}`}>{t.label}</button>)}</div><div>{current?.content}</div></div>;
}

export { Modal };
