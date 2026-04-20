import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { aiCategories, aiTechnologies } from '../data/aiTechnologies';
import { eyeCategories, eyeTechnologies } from '../data/eyeTechnologies';
import { patients } from '../data/patients';
import { monthlyActivity, diagnosisDistribution } from '../data/dashboardStats';
import { educationArticles, faq } from '../data/educationArticles';
import { chatbotQuickSuggestions } from '../data/chatbotRules';
import { applySearchFilterSort } from '../utils/filters';
import { simulateAnalysis } from '../utils/simulateAnalysis';
import { exportPdf } from '../utils/exportPdf';
import { exportCsv } from '../utils/exportCsv';
import { chatbotEngine } from '../utils/chatbotEngine';
import { useApp } from '../context/AppContext';
import {
  AITechCard,
  AnalysisResultCard,
  ArticleCard,
  ChartCard,
  ChatWindow,
  EyeTechCard,
  HistoryTable,
  Modal,
  PaginationLoadMore,
  ReportCard,
  Tabs,
  UploadPanel
} from '../components/DataComponents';
import { EmptyState, ErrorState, FilterBar, LoadingSkeleton, PageHeader, SearchBar, SortSelect, StatCard } from '../components/UIComponents';

export function DashboardPage() {
  const { reports, history } = useApp();
  const stats = { patients: patients.length, scans: history.length, reports: reports.length, ai: aiTechnologies.length, eye: eyeTechnologies.length };
  const topModules = aiTechnologies.slice(0, 5);

  return <AppLayout><PageHeader title="Dashboard" subtitle="Control center premium medical-tech" breadcrumbs={['Dashboard']} actions={<><Link className="rounded bg-cyan-500/20 px-3 py-2" to="/upload">Upload</Link><Link className="rounded bg-indigo-500/20 px-3 py-2" to="/diagnosis">Diagnosis</Link></>} /><p className="mb-3 text-xs text-cyan-300">Created by Dr. Sobri</p><div className="grid gap-3 md:grid-cols-5">{Object.entries(stats).map(([k, v]) => <StatCard key={k} label={`Total ${k}`} value={v} />)}</div><div className="mt-4 grid gap-4 lg:grid-cols-2"><ChartCard title="Aktivitas Bulanan" data={monthlyActivity} keys={[{ key: 'scans', color: '#22d3ee' }, { key: 'reports', color: '#818cf8' }]} /><ChartCard title="Distribusi Diagnosis" type="pie" data={diagnosisDistribution} /></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="glass p-4"><h3 className="font-semibold">Recent Reports</h3>{reports.slice(0, 4).map((r) => <p key={r.id} className="text-sm">• {r.id} - {r.module}</p>)}</div><div className="glass p-4"><h3 className="font-semibold">Top Modules</h3>{topModules.map((m) => <p key={m.id} className="text-sm">• {m.name}</p>)}</div></div></AppLayout>;
}

function TechnologiesPage({ type }) {
  const source = type === 'ai' ? aiTechnologies : eyeTechnologies;
  const categories = type === 'ai' ? aiCategories : eyeCategories;
  const { pushToast, globalSearch } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [sort, setSort] = useState('name-asc');
  const [count, setCount] = useState(9);
  const [error, setError] = useState('');

  const filtered = useMemo(() => applySearchFilterSort(source, { query: query || globalSearch, category, sort }), [source, query, globalSearch, category, sort]);
  const visible = filtered.slice(0, count);

  const onQuickAnalyze = (item) => {
    try {
      const res = simulateAnalysis({ moduleName: item.name, age: 45, severity: 2, symptoms: ['buram', 'silau'], duration: 4, hasComorbidity: true });
      pushToast(`${item.name}: ${res.riskLevel} (${res.confidence}%)`);
    } catch {
      setError('Gagal menjalankan simulasi quick analyze.');
    }
  };

  return <AppLayout><PageHeader title={type === 'ai' ? 'AI Technologies' : 'Eye Technologies'} subtitle={type === 'ai' ? '41 Modul AI Mata' : '20 Teknologi Mata Non-AI'} breadcrumbs={['Dashboard', type === 'ai' ? 'AI Technologies' : 'Eye Technologies']} /><div className="mb-3 grid gap-2 md:grid-cols-3"><SearchBar value={query} onChange={setQuery} placeholder="Cari berdasarkan nama..." /><FilterBar categories={categories} selected={category} onSelect={setCategory} /><SortSelect value={sort} onChange={setSort} options={[{ value: 'name-asc', label: 'Name A-Z' }, { value: 'name-desc', label: 'Name Z-A' }, { value: 'status', label: 'Status' }, { value: 'category', label: 'Category' }]} /></div>{error && <ErrorState message={error} />}{!visible.length ? <EmptyState title="Tidak ada data" message="Coba ubah pencarian/filter." /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((item) => type === 'ai' ? <AITechCard key={item.id} item={item} onQuickAnalyze={onQuickAnalyze} /> : <EyeTechCard key={item.id} item={item} />)}</div>}<div className="mt-4 flex justify-center"><PaginationLoadMore hasMore={count < filtered.length} onClick={() => setCount((c) => c + 9)} /></div></AppLayout>;
}

export const AITechnologiesPage = () => <TechnologiesPage type="ai" />;
export const EyeTechnologiesPage = () => <TechnologiesPage type="eye" />;

export function AIDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setReports, reports, setHistory, pushToast } = useApp();
  const item = aiTechnologies.find((x) => x.id === id);
  const [form, setForm] = useState({ age: 35, severity: 2, duration: 3, symptoms: '', comorbidity: false });
  const [result, setResult] = useState(null);

  if (!item) return <AppLayout><ErrorState message="Modul tidak ditemukan." /></AppLayout>;

  const run = () => {
    const res = simulateAnalysis({ moduleName: item.name, age: form.age, severity: form.severity, duration: form.duration, symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean), hasComorbidity: form.comorbidity });
    setResult(res);
    pushToast('Analisis selesai');
  };

  const saveReport = () => {
    if (!result) return pushToast('Jalankan analisis dulu');
    const report = { id: `R-${Date.now()}`, patient: 'Simulasi Pasien', module: item.name, type: 'AI Module', risk: result.riskLevel, status: 'Draft', date: new Date().toISOString().slice(0, 10), summary: result.likelyCondition };
    setReports([report, ...reports]);
    setHistory((prev) => [{ id: `H-${Date.now()}`, type: 'AI Module', patient: report.patient, risk: report.risk, date: report.date, details: report.summary }, ...prev]);
    pushToast('Report tersimpan');
  };

  return <AppLayout><PageHeader title={item.name} subtitle={item.fullDescription} breadcrumbs={['AI Technologies', item.name]} actions={<button className="rounded bg-white/10 px-3 py-2" onClick={() => navigate(-1)}>Kembali</button>} /><div className="grid gap-4 lg:grid-cols-2"><div className="glass p-4 space-y-2"><p>Kategori: {item.category}</p><p>Confidence Mock: {item.confidenceScore}%</p><input className="w-full rounded bg-white/10 p-2" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Usia" /><select className="w-full rounded bg-slate-900 p-2" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}><option value={1}>Ringan</option><option value={2}>Sedang</option><option value={3}>Berat</option></select><input className="w-full rounded bg-white/10 p-2" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Durasi (hari)" /><input className="w-full rounded bg-white/10 p-2" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="Gejala, pisahkan koma" /><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.comorbidity} onChange={(e) => setForm({ ...form, comorbidity: e.target.checked })} />Riwayat penyakit</label><div className="flex flex-wrap gap-2"><button className="rounded bg-cyan-500 px-3 py-1" onClick={run}>Analisis</button><button className="rounded bg-indigo-500/20 px-3 py-1" onClick={saveReport}>Save Report</button><button className="rounded bg-white/10 px-3 py-1" onClick={() => exportPdf(item.name, result || item)}>Export PDF</button><button className="rounded bg-white/10 px-3 py-1" onClick={() => exportCsv(item.id, result ? result.chart : item.miniChart)}>Export CSV</button><Link to="/history" className="rounded bg-white/10 px-3 py-1">Lihat Riwayat</Link></div></div><AnalysisResultCard result={result} /></div></AppLayout>;
}

export function EyeDetailPage() {
  const { id } = useParams();
  const item = eyeTechnologies.find((x) => x.id === id);
  const [sim, setSim] = useState('');
  if (!item) return <AppLayout><LoadingSkeleton /></AppLayout>;
  return <AppLayout><PageHeader title={item.name} subtitle={item.description} breadcrumbs={['Eye Technologies', item.name]} /><div className="grid gap-4 lg:grid-cols-2"><div className="glass p-4 space-y-2"><p><b>Fungsi:</b> {item.fungsi}</p><p><b>Spesifikasi:</b> {item.spesifikasi}</p><p><b>Cara kerja:</b> {item.caraKerja}</p><p><b>Integrasi AI:</b> {item.integrasiAI.join(', ')}</p></div><div className="glass p-4"><button className="rounded bg-cyan-500 px-3 py-1" onClick={() => setSim(item.simulasiPenggunaan)}>Simulasi Penggunaan</button>{sim ? <p className="mt-2 text-sm">{sim}</p> : <p className="mt-2 text-sm opacity-70">Belum menjalankan simulasi.</p>}</div></div></AppLayout>;
}

export function UploadPage() {
  const { pushToast, setHistory } = useApp();
  const [fileMeta, setFileMeta] = useState({ file: null, preview: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = () => {
    if (!fileMeta.file) return pushToast('Upload gambar terlebih dahulu');
    setLoading(true);
    setTimeout(() => {
      const res = simulateAnalysis({ moduleName: 'AI Klasifikasi Citra Mata', age: 46, severity: 2, duration: 5, symptoms: ['blur'], hasImage: true, hasComorbidity: false });
      setResult(res);
      setLoading(false);
      setHistory((prev) => [{ id: `H-${Date.now()}`, type: 'Upload', patient: 'Unknown', risk: res.riskLevel, date: new Date().toISOString().slice(0, 10), details: res.likelyCondition }, ...prev]);
      pushToast('Analisis image selesai');
    }, 900);
  };

  return <AppLayout><PageHeader title="Upload Eye Image" subtitle="Upload image + preview + simulasi analisis" breadcrumbs={['Upload']} /><div className="grid gap-4 lg:grid-cols-2"><UploadPanel onFile={(file, preview) => setFileMeta({ file, preview })} /><div>{loading ? <LoadingSkeleton /> : <AnalysisResultCard result={result} />}<button className="mt-2 rounded bg-cyan-500 px-3 py-1" onClick={analyze}>Analisis</button></div></div></AppLayout>;
}

export function DiagnosisPage() {
  const { setHistory, pushToast, setReports, reports } = useApp();
  const [form, setForm] = useState({ age: 30, complaint: 'Buram', severity: 2, duration: 3, history: false, symptoms: ['buram'] });
  const [result, setResult] = useState(null);

  const processDiagnosis = () => {
    const out = simulateAnalysis({ moduleName: 'AI Pencocokan Gejala Mata', age: form.age, severity: form.severity, duration: form.duration, hasComorbidity: form.history, symptoms: form.symptoms });
    setResult(out);
  };

  const saveHistory = () => {
    if (!result) return pushToast('Proses diagnosis dulu');
    setHistory((prev) => [{ id: `H-${Date.now()}`, type: 'Diagnosis', patient: 'Simulasi', risk: result.riskLevel, date: new Date().toISOString().slice(0, 10), details: result.likelyCondition }, ...prev]);
    pushToast('Diagnosis disimpan ke history');
  };

  const generateReport = () => {
    if (!result) return;
    setReports([{ id: `R-${Date.now()}`, patient: 'Simulasi', module: 'Diagnosis Engine', type: 'Diagnosis', risk: result.riskLevel, status: 'Final', date: new Date().toISOString().slice(0, 10), summary: result.likelyCondition }, ...reports]);
    pushToast('Report diagnosis dibuat');
  };

  return <AppLayout><PageHeader title="Diagnosis Simulation" subtitle="Form gejala + risk score + rekomendasi" breadcrumbs={['Diagnosis']} /><div className="grid gap-4 lg:grid-cols-2"><div className="glass p-4 space-y-2"><input type="number" className="w-full rounded bg-white/10 p-2" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} placeholder="Usia" /><select className="w-full rounded bg-slate-900 p-2" value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })}><option>Buram</option><option>Nyeri</option><option>Merah</option></select><select className="w-full rounded bg-slate-900 p-2" value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}><option value={1}>Ringan</option><option value={2}>Sedang</option><option value={3}>Berat</option></select><input type="number" className="w-full rounded bg-white/10 p-2" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} placeholder="Durasi gejala" /><label className="flex gap-2"><input type="checkbox" checked={form.history} onChange={(e) => setForm({ ...form, history: e.target.checked })} />Riwayat penyakit</label><button className="rounded bg-cyan-500 px-3 py-1" onClick={processDiagnosis}>Proses</button><div className="flex gap-2"><button className="rounded bg-white/10 px-3 py-1" onClick={saveHistory}>Simpan History</button><button className="rounded bg-white/10 px-3 py-1" onClick={generateReport}>Generate Report</button></div></div><AnalysisResultCard result={result} /></div></AppLayout>;
}

export function AnalyticsPage() {
  const { reports, history } = useApp();
  const riskLevels = ['Rendah', 'Sedang', 'Tinggi'].map((r) => ({ name: r, value: history.filter((h) => h.risk === r).length }));
  const moduleUsage = aiTechnologies.slice(0, 6).map((m, i) => ({ month: `M${i + 1}`, usage: 20 + i * 8 }));
  return <AppLayout><PageHeader title="Analytics" subtitle="Data dinamis dari mock dataset + state aktif" breadcrumbs={['Analytics']} /><div className="grid gap-3 md:grid-cols-5"><StatCard label="Total pasien" value={patients.length} /><StatCard label="Total scan" value={history.length} /><StatCard label="Total laporan" value={reports.length} /><StatCard label="Total AI modules" value={aiTechnologies.length} /><StatCard label="Total eye devices" value={eyeTechnologies.length} /></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><ChartCard title="Diagnosis Distribution" type="pie" data={diagnosisDistribution} /><ChartCard title="Risk Levels" type="pie" data={riskLevels} /><ChartCard title="Monthly Activity" data={monthlyActivity} keys={[{ key: 'diagnosis', color: '#22d3ee' }, { key: 'reports', color: '#818cf8' }]} /><ChartCard title="Module Usage" data={moduleUsage} keys={[{ key: 'usage', color: '#14b8a6' }]} /></div></AppLayout>;
}

export function ReportsPage() {
  const { reports, setReports } = useApp();
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('Semua');
  const [modal, setModal] = useState(null);
  const filtered = reports.filter((r) => (risk === 'Semua' || r.risk === risk) && `${r.id}${r.module}${r.patient}`.toLowerCase().includes(query.toLowerCase()));

  return <AppLayout><PageHeader title="Reports" subtitle="Create, save, view, export, delete" breadcrumbs={['Reports']} actions={<button className="rounded bg-cyan-500/20 px-3 py-2" onClick={() => setReports([{ id: `R-${Date.now()}`, patient: 'Manual', module: 'AI Smart Report Generator Oftalmologi', type: 'Manual', risk: 'Sedang', status: 'Draft', date: new Date().toISOString().slice(0, 10), summary: 'Laporan manual dibuat.' }, ...reports])}>Create Report</button>} /><div className="mb-3 grid gap-2 md:grid-cols-3"><SearchBar value={query} onChange={setQuery} placeholder="Search laporan" /><FilterBar categories={['Semua', 'Rendah', 'Sedang', 'Tinggi']} selected={risk} onSelect={setRisk} /></div>{!filtered.length ? <EmptyState /> : <div className="grid gap-2">{filtered.map((r) => <ReportCard key={r.id} report={r} onView={setModal} onDelete={(id) => setReports(reports.filter((x) => x.id !== id))} />)}</div>}<Modal open={Boolean(modal)} onClose={() => setModal(null)} title="Detail Laporan">{modal && <div className="space-y-1 text-sm"><p>{modal.summary}</p><div className="flex gap-2"><button className="rounded bg-white/10 px-3 py-1" onClick={() => exportPdf(modal.id, modal)}>Export PDF</button><button className="rounded bg-white/10 px-3 py-1" onClick={() => exportCsv(modal.id, [modal])}>Export CSV</button></div></div>}</Modal></AppLayout>;
}

export function HistoryPage() {
  const { history, setHistory } = useApp();
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('Semua');
  const filtered = history.filter((h) => (risk === 'Semua' || h.risk === risk) && `${h.id}${h.type}${h.patient}`.toLowerCase().includes(query.toLowerCase()));
  return <AppLayout><PageHeader title="History" subtitle="Riwayat pemeriksaan tersimpan localStorage" breadcrumbs={['History']} /><div className="mb-3 grid gap-2 md:grid-cols-3"><SearchBar value={query} onChange={setQuery} placeholder="Search history" /><FilterBar categories={['Semua', 'Rendah', 'Sedang', 'Tinggi']} selected={risk} onSelect={setRisk} /></div>{filtered.length ? <HistoryTable rows={filtered} onDelete={(id) => setHistory(history.filter((x) => x.id !== id))} /> : <EmptyState />}</AppLayout>;
}

export function EducationPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [detail, setDetail] = useState(null);
  const categories = ['Semua', ...new Set(educationArticles.map((x) => x.category))];
  const filtered = educationArticles.filter((a) => (category === 'Semua' || a.category === category) && a.title.toLowerCase().includes(query.toLowerCase()));
  return <AppLayout><PageHeader title="Education" subtitle="Artikel, tips kesehatan mata, FAQ" breadcrumbs={['Education']} /><div className="mb-3 grid gap-2 md:grid-cols-3"><SearchBar value={query} onChange={setQuery} placeholder="Search artikel" /><FilterBar categories={categories} selected={category} onSelect={setCategory} /></div><div className="grid gap-3 md:grid-cols-2">{filtered.map((a) => <ArticleCard key={a.id} article={a} onOpen={setDetail} />)}</div><div className="mt-4"><Tabs tabs={[{ id: 'tips', label: 'Tips', content: <ul className='list-disc pl-5 text-sm'><li>Aturan 20-20-20 saat menatap layar.</li><li>Gunakan pencahayaan cukup.</li></ul> }, { id: 'faq', label: 'FAQ', content: <ul className='space-y-2 text-sm'>{faq.map((x) => <li key={x.q}><b>{x.q}</b><p>{x.a}</p></li>)}</ul> }]} /></div><Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.title}>{detail?.content}</Modal></AppLayout>;
}

export function ChatbotPage() {
  const { chatHistory, setChatHistory } = useApp();
  const [text, setText] = useState('');
  const send = (message) => {
    if (!message.trim()) return;
    const reply = chatbotEngine(message);
    setChatHistory((prev) => [...prev, { sender: 'user', text: message }, { sender: 'bot', text: reply }]);
    setText('');
  };
  return <AppLayout><PageHeader title="AI Chatbot" subtitle="Chat interaktif berbasis rules/data mock" breadcrumbs={['Chatbot']} /><ChatWindow messages={chatHistory} /><div className="mt-2 flex flex-wrap gap-2">{chatbotQuickSuggestions.map((s) => <button key={s} className="rounded bg-white/10 px-2 py-1 text-xs" onClick={() => send(s)}>{s}</button>)}</div><div className="mt-2 flex gap-2"><input className="glass w-full px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik pertanyaan..." /><button className="rounded bg-cyan-500 px-3 py-2" onClick={() => send(text)}>Kirim</button></div></AppLayout>;
}

export function AdminPage() {
  const { modulePreferences, setModulePreferences } = useApp();
  const [query, setQuery] = useState('');
  const aiRows = aiTechnologies.filter((x) => x.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  const eyeRows = eyeTechnologies.filter((x) => x.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  const toggleStatus = (type, id) => {
    setModulePreferences((prev) => ({ ...prev, [type]: { ...prev[type], [id]: !prev[type][id] } }));
  };

  return <AppLayout><PageHeader title="Admin" subtitle="Mock management panel berbasis state" breadcrumbs={['Admin']} /><SearchBar value={query} onChange={setQuery} /><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="glass p-4"><h3 className="font-semibold">Tabel Modul AI</h3>{aiRows.map((r) => <div key={r.id} className="mt-2 flex justify-between text-sm"><span>{r.name}</span><button className="rounded bg-white/10 px-2 py-1" onClick={() => toggleStatus('aiStatus', r.id)}>{modulePreferences.aiStatus[r.id] ? 'Nonaktifkan' : 'Aktifkan'}</button></div>)}</div><div className="glass p-4"><h3 className="font-semibold">Tabel Teknologi Mata</h3>{eyeRows.map((r) => <div key={r.id} className="mt-2 flex justify-between text-sm"><span>{r.name}</span><button className="rounded bg-white/10 px-2 py-1" onClick={() => toggleStatus('eyeStatus', r.id)}>{modulePreferences.eyeStatus[r.id] ? 'Nonaktifkan' : 'Aktifkan'}</button></div>)}</div></div></AppLayout>;
}

export function AboutPage() {
  return <AppLayout><PageHeader title="About" subtitle="Tentang platform EYEVERSE AI" breadcrumbs={['About']} /><div className="glass p-4 space-y-2"><p>EYEVERSE AI adalah platform simulasi 41 teknologi AI mata + 20 teknologi mata non-AI.</p><p>Fokus: analisis, diagnosis, edukasi, dan pelaporan frontend-only.</p><p className="text-cyan-400 font-semibold">Created by Dr. Sobri</p></div></AppLayout>;
}

export function ContactPage() {
  const { pushToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email.includes('@') || form.message.length < 8) {
      setError('Form belum valid.');
      return;
    }
    setError('');
    pushToast('Pesan berhasil dikirim (mock).');
    setForm({ name: '', email: '', message: '' });
  };
  return <AppLayout><PageHeader title="Contact" subtitle="Hubungi tim EYEVERSE AI" breadcrumbs={['Contact']} /><form onSubmit={submit} className="glass grid gap-2 p-4"><input className="rounded bg-white/10 p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" /><input className="rounded bg-white/10 p-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" /><textarea className="rounded bg-white/10 p-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Pesan" rows={5} />{error && <ErrorState message={error} />}<button className="rounded bg-cyan-500 px-3 py-2">Kirim</button></form></AppLayout>;
}

export function NotFoundPage() {
  return <AppLayout><div className="glass p-8 text-center"><h1 className="text-4xl font-bold">404</h1><p>Halaman tidak ditemukan.</p><Link className="text-cyan-300 underline" to="/">Kembali ke Landing</Link></div></AppLayout>;
}
