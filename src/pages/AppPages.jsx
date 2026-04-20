import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useApp } from '../context/AppContext';
import { aiCategories, aiTechnologies } from '../data/aiTechnologies';
import { eyeCategories, eyeTechnologies } from '../data/eyeTechnologies';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';
import { chatbotEngine } from '../utils/chatbotEngine';
import { simulateAnalysis } from '../utils/simulateAnalysis';
import { categoryFilter, globalSearchFilter } from '../utils/filters';
import { sortRecords } from '../utils/sorters';
import { paginate } from '../utils/pagination';
import {
  ageGroups,
  confidenceRange,
  diagnosisDistribution,
  eyeDeviceUsage,
  moduleUsage,
  monthlyScanVolume,
  riskDistribution,
  scanTypeDistribution,
} from '../utils/analyticsHelpers';
import { AITechCard, AnalysisResultCard, ArticleCard, ChartCard, ChatWindow, EyeTechCard, HistoryTable, Modal, PaginationLoadMore, Tabs, UploadPanel } from '../components/DataComponents';
import { EmptyState, ErrorState, FilterBar, PageHeader, SearchBar, SortSelect, StatCard } from '../components/UIComponents';

const riskFilters = ['Semua', 'Rendah', 'Sedang', 'Tinggi'];

export function DashboardPage() {
  const { seed, reports, histories } = useApp();
  const topModule = moduleUsage(seed.scans)[0]?.name || '-';
  const topCondition = diagnosisDistribution(reports)[0]?.name || '-';
  const stats = [
    ['Total Patients', seed.patients.length], ['Total Scans', seed.scans.length], ['Total Reports', reports.length], ['Monitoring History', histories.length],
    ['Total AI Modules', aiTechnologies.length], ['Total Eye Devices', eyeTechnologies.length],
  ];

  return <AppLayout><PageHeader title="Dashboard" subtitle="Data driven dashboard dari 5000 dataset" breadcrumbs={['Dashboard']} />
    <div className="mb-2 text-xs text-cyan-300">Created by Dr. Sobri</div>
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{stats.map(([k, v]) => <StatCard key={k} label={k} value={v} />)}</div>
    <div className="mt-3 grid gap-3 md:grid-cols-2"><StatCard label="Most Used AI Module" value={topModule} /><StatCard label="Most Common Eye Condition" value={topCondition} /></div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ChartCard title="Risk Distribution" type="pie" data={riskDistribution(reports)} />
      <ChartCard title="Diagnosis Distribution" type="pie" data={diagnosisDistribution(reports).slice(0, 8)} />
      <ChartCard title="Monthly Scan Volume" data={monthlyScanVolume(seed.scans).slice(-12)} keys={[{ key: 'scans', color: '#22d3ee' }]} />
      <ChartCard title="Report Status" type="pie" data={['Draft','Final','Reviewed'].map((s)=>({name:s,value:reports.filter((r)=>r.status===s).length}))} />
    </div>
    <div className="mt-4 glass p-4"><h3 className="font-semibold">Latest Activities</h3>{seed.activities.slice(0, 8).map((a) => <p key={a.id} className="text-sm">• {a.createdAt} — {a.actor} {a.action}</p>)}</div>
  </AppLayout>;
}

function TechnologiesPage({ type }) {
  const { seed } = useApp();
  const source = type === 'ai' ? aiTechnologies : eyeTechnologies;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [count, setCount] = useState(12);
  const categories = type === 'ai' ? aiCategories : eyeCategories;
  const usage = useMemo(() => (type === 'ai' ? moduleUsage(seed.scans) : eyeDeviceUsage(seed.scans)), [seed.scans, type]);
  const usageMap = Object.fromEntries(usage.map((u) => [u.name, u.value]));
  const filtered = useMemo(() => {
    const withUsage = source.map((s) => ({ ...s, usageCount: usageMap[s.name] || 0 }));
    const bySearch = globalSearchFilter(withUsage, query, ['name', 'category']);
    const byCategory = categoryFilter(bySearch, 'category', category);
    return sortRecords(byCategory, 'name-asc');
  }, [source, query, category, usageMap]);
  return <AppLayout><PageHeader title={type === 'ai' ? 'AI Technologies' : 'Eye Technologies'} subtitle={type === 'ai' ? '41 teknologi AI' : '20 teknologi non-AI'} breadcrumbs={[type === 'ai' ? 'AI' : 'Eye']} />
    <div className="mb-3 grid gap-2 md:grid-cols-2"><SearchBar value={query} onChange={setQuery} placeholder="Cari teknologi" /><FilterBar categories={categories} selected={category} onSelect={setCategory} /></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, count).map((item) => type === 'ai' ? <AITechCard key={item.id} item={item} onQuickAnalyze={()=>{}} /> : <EyeTechCard key={item.id} item={item} />)}</div>
    <div className="mt-3 flex justify-center"><PaginationLoadMore hasMore={count < filtered.length} onClick={() => setCount((c) => c + 12)} /></div>
  </AppLayout>;
}

export const AITechnologiesPage = () => <TechnologiesPage type="ai" />;
export const EyeTechnologiesPage = () => <TechnologiesPage type="eye" />;

export function AIDetailPage() {
  const { id } = useParams();
  const { seed, addReport, addHistory, pushToast } = useApp();
  const ai = aiTechnologies.find((x) => x.id === id);
  const patient = seed.patients[10];
  const scan = seed.scans[5];
  const [result, setResult] = useState(null);
  if (!ai) return <AppLayout><ErrorState message="AI module tidak ditemukan" /></AppLayout>;
  const run = () => setResult(simulateAnalysis({ patient, scanType: scan.scanType, symptoms: ['buram', 'silau'], aiModule: ai.name }));
  const save = () => {
    if (!result) return;
    const idNum = Date.now();
    addReport({ id: `R-L-${idNum}`, patientId: patient.id, patientName: patient.name, eyeCondition: patient.eyeCondition, scanType: scan.scanType, analysisDate: new Date().toISOString().slice(0,10), doctor: 'Dr. Sobri', confidenceScore: result.confidenceScore, riskLevel: result.riskLevel, diagnosisResult: result.diagnosisResult, recommendations: result.recommendations, moduleUsed: ai.name, status: 'Draft', createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) });
    addHistory({ id: `H-L-${idNum}`, patientId: patient.id, patientName: patient.name, action: 'Diagnosis', riskLevel: result.riskLevel, linkedReportId: `R-L-${idNum}`, note: result.diagnosisResult, createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) });
    pushToast('Hasil analisis disimpan');
  };
  return <AppLayout><PageHeader title={ai.name} subtitle={ai.fullDescription} breadcrumbs={['AI Technologies', ai.name]} /><div className="grid gap-4 lg:grid-cols-2"><div className="glass p-4"><p>Usage count: {seed.scans.filter((s)=>s.moduleId===ai.id).length}</p><div className="mt-2 flex gap-2"><button className="rounded bg-cyan-500 px-3 py-1" onClick={run}>Simulate</button><button className="rounded bg-white/10 px-3 py-1" onClick={save}>Save</button><button className="rounded bg-white/10 px-3 py-1" onClick={()=>result&&exportPdf(ai.name,result)}>PDF</button></div></div><AnalysisResultCard result={result} /></div></AppLayout>;
}

export function EyeDetailPage() {
  const { id } = useParams();
  const { seed } = useApp();
  const eye = eyeTechnologies.find((x) => x.id === id);
  if (!eye) return <AppLayout><ErrorState message="Eye device tidak ditemukan" /></AppLayout>;
  const linkedScans = seed.scans.filter((s) => s.eyeDeviceId === eye.id).slice(0, 10);
  return <AppLayout><PageHeader title={eye.name} subtitle={eye.description} breadcrumbs={['Eye Technologies', eye.name]} /><div className="glass p-4"><p>Total pemeriksaan terkait: {seed.scans.filter((s)=>s.eyeDeviceId===eye.id).length}</p>{linkedScans.map((s)=><p key={s.id} className="text-sm">{s.id} • {s.patientName} • {s.analysisDate}</p>)}</div></AppLayout>;
}

export function UploadPage() {
  const [meta, setMeta] = useState({});
  const [result, setResult] = useState(null);
  const { seed } = useApp();
  return <AppLayout><PageHeader title="Upload Eye Image" subtitle="Frontend upload simulation" breadcrumbs={['Upload']} />
    <div className="grid gap-4 lg:grid-cols-2"><UploadPanel onFile={(file, preview) => setMeta({ file, preview })} />
    <div><AnalysisResultCard result={result} /><button className="mt-2 rounded bg-cyan-500 px-3 py-1" onClick={()=>setResult(simulateAnalysis({ patient: seed.patients[1], scanType: 'Fundus', symptoms: ['merah'], aiModule: 'AI Klasifikasi Citra Mata' }))}>Analyze Upload</button></div></div>
  </AppLayout>;
}

export function DiagnosisPage() {
  const { seed, addReport, addHistory } = useApp();
  const [patientId, setPatientId] = useState(seed.patients[0].id);
  const [scanType, setScanType] = useState('Fundus');
  const [symptoms, setSymptoms] = useState('buram, silau');
  const [result, setResult] = useState(null);
  const patient = seed.patients.find((p) => p.id === patientId) || seed.patients[0];

  const run = () => setResult(simulateAnalysis({ patient, scanType, symptoms: symptoms.split(',').map((s) => s.trim()), aiModule: 'AI Pencocokan Gejala Mata' }));
  const save = () => {
    if (!result) return;
    const idNum = Date.now();
    addReport({ id: `R-L-${idNum}`, patientId: patient.id, patientName: patient.name, age: patient.age, gender: patient.gender, eyeCondition: patient.eyeCondition, scanType, analysisDate: new Date().toISOString().slice(0,10), doctor: 'Dr. Sobri', confidenceScore: result.confidenceScore, riskLevel: result.riskLevel, diagnosisResult: result.diagnosisResult, recommendations: result.recommendations, moduleUsed: 'AI Pencocokan Gejala Mata', status: 'Final', createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) });
    addHistory({ id: `H-L-${idNum}`, patientId: patient.id, patientName: patient.name, action: 'Diagnosis Simulation', riskLevel: result.riskLevel, linkedReportId: `R-L-${idNum}`, note: result.diagnosisResult, createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) });
  };
  return <AppLayout><PageHeader title="Diagnosis Simulation" subtitle="Rule engine berbasis gejala, usia, scan, riwayat" breadcrumbs={['Diagnosis']} /><div className="grid gap-4 lg:grid-cols-2"><div className="glass p-4 space-y-2"><select className="w-full rounded bg-slate-900 p-2" value={patientId} onChange={(e)=>setPatientId(e.target.value)}>{seed.patients.slice(0,200).map((p)=><option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}</select><select className="w-full rounded bg-slate-900 p-2" value={scanType} onChange={(e)=>setScanType(e.target.value)}>{['Fundus','OCT','Slit Lamp','Visual Field','Topography'].map((s)=><option key={s}>{s}</option>)}</select><input className="w-full rounded bg-white/10 p-2" value={symptoms} onChange={(e)=>setSymptoms(e.target.value)} /><div className="flex gap-2"><button className="rounded bg-cyan-500 px-3 py-1" onClick={run}>Proses</button><button className="rounded bg-white/10 px-3 py-1" onClick={save}>Simpan</button></div></div><AnalysisResultCard result={result} /></div></AppLayout>;
}

export function AnalyticsPage() {
  const { seed, reports } = useApp();
  return <AppLayout><PageHeader title="Analytics" subtitle="Semua chart dihitung dari dataset" breadcrumbs={['Analytics']} />
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Distribusi Penyakit Mata" type="pie" data={diagnosisDistribution(reports).slice(0, 8)} />
      <ChartCard title="Distribusi Risk Level" type="pie" data={riskDistribution(reports)} />
      <ChartCard title="Penggunaan Modul AI" type="pie" data={moduleUsage(seed.scans).slice(0, 8)} />
      <ChartCard title="Penggunaan Alat Mata" type="pie" data={eyeDeviceUsage(seed.scans).slice(0, 8)} />
      <ChartCard title="Tren Bulanan" data={monthlyScanVolume(seed.scans).slice(-12)} keys={[{ key: 'scans', color: '#22d3ee' }]} />
      <ChartCard title="Confidence Score Range" type="pie" data={confidenceRange(reports)} />
      <ChartCard title="Kelompok Usia" type="pie" data={ageGroups(seed.patients)} />
      <ChartCard title="Jenis Scan" type="pie" data={scanTypeDistribution(seed.scans)} />
    </div>
  </AppLayout>;
}

export function ReportsPage() {
  const { reports, removeLocalReport, localReports } = useApp();
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('Semua');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => sortRecords(categoryFilter(globalSearchFilter(reports, query, ['id', 'patientName', 'moduleUsed', 'diagnosisResult']), 'riskLevel', risk), sort), [reports, query, risk, sort]);
  const pageData = paginate(filtered, page, 25);

  return <AppLayout><PageHeader title="Reports" subtitle="Ratusan report + search/filter/sort/pagination + export" breadcrumbs={['Reports']} actions={<><button className="rounded bg-white/10 px-3 py-2" onClick={()=>exportCsv('reports', filtered)}>Export CSV</button><button className="rounded bg-white/10 px-3 py-2" onClick={()=>exportPdf('reports-summary', filtered.slice(0, 50))}>Export PDF</button></>} />
    <div className="mb-3 grid gap-2 md:grid-cols-4"><SearchBar value={query} onChange={setQuery} placeholder="Cari report" /><FilterBar categories={riskFilters} selected={risk} onSelect={setRisk} /><SortSelect value={sort} onChange={setSort} options={[{value:'newest',label:'Newest'},{value:'oldest',label:'Oldest'},{value:'confidence-desc',label:'Confidence desc'}]} /><div className="glass px-3 py-2 text-sm">Local items: {localReports.length}</div></div>
    <div className="glass overflow-auto"><table className="w-full text-sm"><thead><tr><th>ID</th><th>Patient</th><th>Condition</th><th>Risk</th><th>Confidence</th><th>Date</th><th></th></tr></thead><tbody>{pageData.rows.map((r)=><tr key={r.id} className="border-t border-white/10"><td>{r.id}</td><td>{r.patientName}</td><td>{r.eyeCondition}</td><td>{r.riskLevel}</td><td>{r.confidenceScore}</td><td>{r.analysisDate}</td><td className="space-x-2"><button onClick={()=>setDetail(r)} className="text-cyan-300">Detail</button>{r.id.startsWith('R-L-') && <button onClick={()=>removeLocalReport(r.id)} className="text-red-300">Delete</button>}</td></tr>)}</tbody></table></div>
    <div className="mt-2 flex gap-2"><button className="glass px-3 py-1" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>Prev</button><span className="glass px-3 py-1">{page}/{pageData.totalPages}</span><button className="glass px-3 py-1" disabled={page>=pageData.totalPages} onClick={()=>setPage((p)=>p+1)}>Next</button></div>
    <Modal open={Boolean(detail)} onClose={()=>setDetail(null)} title={`Detail Report ${detail?.id}`}>{detail && <div className="text-sm space-y-1"><p>{detail.diagnosisResult}</p><p>{detail.recommendations}</p></div>}</Modal>
  </AppLayout>;
}

export function HistoryPage() {
  const { histories, removeLocalHistory, localHistories } = useApp();
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('Semua');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => sortRecords(categoryFilter(globalSearchFilter(histories, query, ['id', 'patientName', 'action', 'note']), 'riskLevel', risk), sort), [histories, query, risk, sort]);
  const pageData = paginate(filtered, page, 25);
  return <AppLayout><PageHeader title="History" subtitle="Ratusan riwayat + detail + delete local" breadcrumbs={['History']} actions={<button className="rounded bg-white/10 px-3 py-2" onClick={()=>exportCsv('history', filtered)}>Export CSV</button>} />
    <div className="mb-3 grid gap-2 md:grid-cols-4"><SearchBar value={query} onChange={setQuery} placeholder="Cari history" /><FilterBar categories={riskFilters} selected={risk} onSelect={setRisk} /><SortSelect value={sort} onChange={setSort} options={[{value:'newest',label:'Newest'},{value:'oldest',label:'Oldest'}]} /><div className="glass px-3 py-2 text-sm">Local items: {localHistories.length}</div></div>
    <HistoryTable rows={pageData.rows.map((h)=>({id:h.id,type:h.action,patient:h.patientName,risk:h.riskLevel,date:h.createdAt}))} onDelete={(id)=>removeLocalHistory(id)} />
    <div className="mt-2 flex gap-2"><button className="glass px-3 py-1" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>Prev</button><span className="glass px-3 py-1">{page}/{pageData.totalPages}</span><button className="glass px-3 py-1" disabled={page>=pageData.totalPages} onClick={()=>setPage((p)=>p+1)}>Next</button></div>
  </AppLayout>;
}

export function EducationPage() {
  const { seed } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [count, setCount] = useState(20);
  const [detail, setDetail] = useState(null);
  const categories = ['Semua', ...new Set(seed.educationArticles.map((x) => x.category))];
  const filtered = categoryFilter(globalSearchFilter(seed.educationArticles, query, ['title', 'content']), 'category', category);
  return <AppLayout><PageHeader title="Education" subtitle="100 artikel edukasi/FAQ" breadcrumbs={['Education']} />
    <div className="mb-3 grid gap-2 md:grid-cols-2"><SearchBar value={query} onChange={setQuery} placeholder="Cari artikel" /><FilterBar categories={categories} selected={category} onSelect={setCategory} /></div>
    <div className="grid gap-3 md:grid-cols-2">{filtered.slice(0, count).map((a) => <ArticleCard key={a.id} article={a} onOpen={setDetail} />)}</div>
    <div className="mt-3 flex justify-center"><PaginationLoadMore hasMore={count < filtered.length} onClick={() => setCount((c) => c + 20)} /></div>
    <Modal open={Boolean(detail)} onClose={()=>setDetail(null)} title={detail?.title}>{detail?.content}</Modal>
  </AppLayout>;
}

export function ChatbotPage() {
  const { seed, chatHistory, setChatHistory } = useApp();
  const [text, setText] = useState('');
  const send = (msg) => {
    if (!msg.trim()) return;
    const reply = chatbotEngine(msg, seed.chatbotKnowledge);
    setChatHistory((prev) => [...prev, { sender: 'user', text: msg }, { sender: 'bot', text: reply }]);
    setText('');
  };
  return <AppLayout><PageHeader title="AI Chatbot" subtitle="Knowledge base 100 entries" breadcrumbs={['Chatbot']} />
    <ChatWindow messages={chatHistory} /><div className="mt-2 flex gap-2"><input className="glass w-full px-3 py-2" value={text} onChange={(e)=>setText(e.target.value)} /><button className="rounded bg-cyan-500 px-3" onClick={()=>send(text)}>Send</button></div>
    <div className="mt-2 flex flex-wrap gap-2">{seed.chatbotKnowledge.slice(0,8).map((k)=><button key={k.id} className="glass px-2 py-1 text-xs" onClick={()=>send(k.keyword)}>{k.keyword}</button>)}</div>
  </AppLayout>;
}

export function AdminPage() {
  const { seed, reports, histories } = useApp();
  const datasetSummary = [
    ['patients', seed.patients.length], ['scans', seed.scans.length], ['reports', reports.length], ['histories', histories.length],
    ['activities', seed.activities.length], ['education', seed.educationArticles.length], ['chatbotKnowledge', seed.chatbotKnowledge.length],
  ];
  const total = datasetSummary.reduce((a, [, n]) => a + n, 0);
  return <AppLayout><PageHeader title="Admin" subtitle="Data source insight dan status modul" breadcrumbs={['Admin']} />
    <div className="grid gap-3 md:grid-cols-4"><StatCard label="Total Records" value={total} /><StatCard label="AI Modules" value={aiTechnologies.length} /><StatCard label="Eye Devices" value={eyeTechnologies.length} /><StatCard label="Activities" value={seed.activities.length} /></div>
    <div className="mt-3 grid gap-3 lg:grid-cols-2"><div className="glass p-4"><h3 className="font-semibold">Dataset Summary</h3>{datasetSummary.map(([k,v])=><p key={k} className="text-sm">{k}: {v}</p>)}</div><div className="glass p-4"><h3 className="font-semibold">Module Status</h3>{aiTechnologies.slice(0,10).map((a)=><p key={a.id} className="text-sm">{a.name} - Active</p>)}</div></div>
  </AppLayout>;
}

export function AboutPage() { return <AppLayout><PageHeader title="About" subtitle="EYEVERSE AI" breadcrumbs={['About']} /><div className="glass p-4">Platform 41 teknologi AI mata + 20 teknologi mata non-AI. Created by Dr. Sobri.</div></AppLayout>; }
export function ContactPage() { const nav = useNavigate(); return <AppLayout><PageHeader title="Contact" subtitle="Hubungi tim" breadcrumbs={['Contact']} /><div className="glass p-4"><button className="rounded bg-cyan-500 px-3 py-2" onClick={()=>nav('/dashboard')}>Kembali Dashboard</button></div></AppLayout>; }
export function NotFoundPage() { return <AppLayout><EmptyState title="404" message="Halaman tidak ditemukan" /><Link to="/">Kembali ke Home</Link></AppLayout>; }
