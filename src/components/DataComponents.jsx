import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts';

export const StatCard = ({ label, value }) => (
  <div className="glass p-4">
    <p className="text-xs uppercase opacity-70">{label}</p>
    <p className="text-2xl font-bold text-cyan-400">{value}</p>
  </div>
);

export const ChartCard = ({ title, data, bars }) => (
  <div className="glass p-4">
    <h3 className="mb-2 font-semibold">{title}</h3>
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          {bars.map((bar) => <Bar key={bar.key} dataKey={bar.key} fill={bar.color} radius={6} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const FilterPanel = ({ categories, selected, onSelect, sort, onSort }) => (
  <div className="glass mb-4 flex flex-wrap gap-2 p-3">
    {categories.map((cat) => <button key={cat} onClick={() => onSelect(cat)} className={`rounded-xl px-3 py-1 text-sm ${selected === cat ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5'}`}>{cat}</button>)}
    <select className="ml-auto rounded-xl bg-transparent px-3 py-1 text-sm" value={sort} onChange={(e) => onSort(e.target.value)}>
      <option value="az">Sort A-Z</option>
      <option value="za">Sort Z-A</option>
      <option value="risk">Risk Level</option>
    </select>
  </div>
);

export const TechCard = ({ item, type = 'ai' }) => {
  const Icon = item.icon;
  return (
    <div className="glass p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={20} className="text-cyan-400" />
        <span className="font-semibold">{item.name}</span>
      </div>
      <p className="mb-2 text-sm opacity-80">{item.shortDescription || item.description}</p>
      <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">Aktif</span>
      <div className="mt-3">
        <Link className="text-sm text-cyan-400 underline" to={type === 'ai' ? `/ai-technologies/${item.id}` : `/eye-technologies/${item.id}`}>Buka Detail</Link>
      </div>
    </div>
  );
};

export const AITechCard = (props) => <TechCard {...props} type="ai" />;
export const EyeTechCard = (props) => <TechCard {...props} type="eye" />;

export const UploadPanel = ({ onUpload, preview }) => (
  <div className="glass p-4">
    <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} />
    {preview && <img src={preview} alt="preview" className="mt-3 h-44 w-full rounded-xl object-cover" />}
  </div>
);

export const AnalysisResult = ({ result }) => {
  if (!result) return <div className="glass p-4 text-sm">Belum ada hasil analisis.</div>;
  return (
    <div className="glass p-4">
      <p>Confidence: <strong className="text-cyan-400">{result.confidence}%</strong></p>
      <p>Risk Level: <strong>{result.riskLevel}</strong></p>
      <p className="text-sm opacity-80">{result.summary}</p>
      <div className="mt-3 h-40">
        <ResponsiveContainer>
          <LineChart data={result.chart}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ReportTable = ({ reports }) => (
  <div className="glass overflow-auto p-4">
    <table className="w-full text-sm">
      <thead><tr className="text-left"><th>ID</th><th>Pasien</th><th>Modul</th><th>Status</th><th>Tanggal</th></tr></thead>
      <tbody>
        {reports.map((r) => <tr key={r.id} className="border-t border-white/10"><td>{r.id}</td><td>{r.patient}</td><td>{r.module}</td><td>{r.status}</td><td>{r.date}</td></tr>)}
      </tbody>
    </table>
  </div>
);

export const ModalDetail = ({ open, onClose, title, content }) => open ? (
  <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4" onClick={onClose}>
    <div className="glass max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm opacity-80">{content}</p>
      <button className="mt-4 rounded-xl bg-cyan-500/20 px-3 py-1" onClick={onClose}>Close</button>
    </div>
  </div>
) : null;
