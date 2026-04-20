import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { PageHeader, SectionTitle, LoadingSkeleton } from '../components/CoreComponents';
import { AITechCard, AnalysisResult, ChartCard, EyeTechCard, FilterPanel, ModalDetail, ReportTable, StatCard, UploadPanel } from '../components/DataComponents';
import { aiTechnologies, eyeTechnologies } from '../data/techData';
import { diseaseStats, latestActivities, patients, reports, scans, summary, usageStats } from '../data/mockData';
import { exportToCsv, exportToPdf } from '../utils/exportUtils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

const categories = ['Semua', 'Diagnostik AI', 'Analisis Citra', 'Prediksi Risiko', 'Monitoring', 'Edukasi', 'Screening', 'Perangkat Pemeriksaan', 'Bedah Mata', 'Laporan'];

export function DashboardPage() {
  return <AppLayout>{() => <>
    <PageHeader title="Dashboard Utama" subtitle="Control center premium medical-tech EYEVERSE AI" actions={<div className="flex gap-2"><Link className="rounded-xl bg-cyan-500/20 px-3 py-2" to="/upload">Upload Citra</Link><Link className="rounded-xl bg-indigo-500/20 px-3 py-2" to="/diagnosis">Simulasi Diagnosis</Link></div>} />
    <div className="grid gap-3 md:grid-cols-5">
      <StatCard label="Total AI" value={summary.totalAI} /><StatCard label="Total Eye Tech" value={summary.totalEye} /><StatCard label="Total Pasien" value={summary.totalPatients} /><StatCard label="Total Scan" value={summary.totalScans} /><StatCard label="Total Laporan" value={summary.totalReports} />
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ChartCard title="Penggunaan Modul" data={usageStats} bars={[{ key: 'ai', color: '#22d3ee' }, { key: 'eye', color: '#818cf8' }]} />
      <div className="glass p-4"><h3 className="mb-2 font-semibold">Chart Hasil Diagnosis</h3><div className="h-56"><ResponsiveContainer><PieChart><Pie data={diseaseStats} dataKey="value" nameKey="name" outerRadius={90}>{diseaseStats.map((_, i) => <Cell key={i} fill={['#22d3ee','#a78bfa','#38bdf8','#60a5fa','#14b8a6'][i % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="glass p-4"><SectionTitle>Aktivitas Terbaru</SectionTitle><ul className="list-disc space-y-1 pl-5 text-sm">{latestActivities.map((a) => <li key={a}>{a}</li>)}</ul></div>
      <div className="glass p-4"><SectionTitle>Top AI Modules</SectionTitle>{aiTechnologies.slice(0, 5).map((t) => <p key={t.id} className="text-sm">• {t.name}</p>)}</div>
    </div>
    <div className="mt-4"><SectionTitle>Recent Reports</SectionTitle><ReportTable reports={reports.slice(0, 7)} /></div>
  </>}</AppLayout>;
}

function TechnologyList({ type }) {
  const source = type === 'ai' ? aiTechnologies : eyeTechnologies;
  const [category, setCategory] = useState('Semua');
  const [sort, setSort] = useState('az');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => source.filter((x) => (category === 'Semua' || x.category === category) && x.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : sort === 'za' ? b.name.localeCompare(a.name) : (b.confidence || 0) - (a.confidence || 0)), [source, category, sort, query]);

  return <AppLayout>{() => <>
    <PageHeader title={type === 'ai' ? 'Semua Teknologi AI Mata' : 'Semua Teknologi Mata'} subtitle="Modul interaktif aktif dengan filter, sort, dan detail." />
    <input className="glass mb-3 w-full p-2" placeholder="Cari modul..." value={query} onChange={(e) => setQuery(e.target.value)} />
    <FilterPanel categories={categories} selected={category} onSelect={setCategory} sort={sort} onSort={setSort} />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((item) => type === 'ai' ? <AITechCard key={item.id} item={item} /> : <EyeTechCard key={item.id} item={item} />)}
    </div>
  </>}</AppLayout>;
}

export const AITechnologiesPage = () => <TechnologyList type="ai" />;
export const EyeTechnologiesPage = () => <TechnologyList type="eye" />;

export function AIDetailPage() {
  const { id } = useParams();
  const item = aiTechnologies.find((x) => x.id === id);
  const [result, setResult] = useState(null);
  const [modal, setModal] = useState(false);
  const { pushToast } = useApp();
  if (!item) return <AppLayout><LoadingSkeleton /></AppLayout>;
  const simulate = () => { const res = { confidence: item.confidence, riskLevel: item.riskLevel, summary: `Simulasi ${item.name} menunjukkan kondisi ${item.riskLevel.toLowerCase()}.`, chart: item.usage }; setResult(res); pushToast('Analisis simulasi selesai'); };
  return <AppLayout>{() => <>
    <PageHeader title={item.name} subtitle={item.shortDescription} actions={<button className="rounded-xl bg-indigo-500/20 px-3 py-2" onClick={() => setModal(true)}>Lihat Benefit</button>} />
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass p-4"><p>Kategori: {item.category}</p><p>Status: Aktif</p><textarea className="mt-2 h-28 w-full rounded-xl bg-white/10 p-2" placeholder="Input gejala/simulasi..." /><button className="mt-2 rounded-xl bg-cyan-500 px-3 py-2" onClick={simulate}>Analisis</button><div className="mt-2 flex gap-2"><button className="rounded-xl bg-white/10 px-3 py-1" onClick={() => exportToPdf(item.name, item.history)}>Save Report (PDF)</button><button className="rounded-xl bg-white/10 px-3 py-1" onClick={() => exportToCsv(item.id, item.usage)}>Export CSV</button></div></div>
      <AnalysisResult result={result} />
    </div>
    <div className="glass mt-4 p-4"><SectionTitle>Dummy History</SectionTitle>{item.history.map((h) => <p key={h}>• {h}</p>)}</div>
    <ModalDetail open={modal} onClose={() => setModal(false)} title={`Manfaat ${item.name}`} content={item.benefits.join(', ')} />
  </>}</AppLayout>;
}

export function EyeDetailPage() {
  const { id } = useParams();
  const item = eyeTechnologies.find((x) => x.id === id);
  if (!item) return <AppLayout><LoadingSkeleton /></AppLayout>;
  return <AppLayout>{() => <>
    <PageHeader title={item.name} subtitle={item.description} />
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass p-4 space-y-2"><p><b>Fungsi:</b> {item.function}</p><p><b>Spesifikasi:</b> {item.spec}</p><p><b>Cara Kerja:</b> {item.workflow}</p><p><b>Integrasi AI:</b> {item.aiIntegration}</p><p><b>Status:</b> Tersedia</p></div>
      <div className="glass p-4"><SectionTitle>Simulasi Penggunaan</SectionTitle><p className="text-sm">Tekan tombol simulasi untuk menandai perangkat siap digunakan di klinik.</p><button className="mt-3 rounded-xl bg-cyan-500 px-3 py-2">Simulasi Penggunaan</button></div>
    </div>
  </>}</AppLayout>;
}

export function UploadPage() {
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const onUpload = (file) => { if (file) setPreview(URL.createObjectURL(file)); };
  return <AppLayout>{() => <>
    <PageHeader title="Upload Citra Mata" subtitle="Upload Fundus/OCT lalu lakukan analisis simulatif." />
    <div className="grid gap-4 lg:grid-cols-2"><UploadPanel onUpload={onUpload} preview={preview} /><div><button className="mb-2 rounded-xl bg-cyan-500 px-3 py-2" onClick={() => setResult({ confidence: 91, riskLevel: 'Sedang', summary: 'Terindikasi perubahan retina ringan, perlu monitoring.', chart: [{ name: 'Scan 1', value: 62 }, { name: 'Scan 2', value: 71 }, { name: 'Scan 3', value: 68 }] })}>Analisis Gambar</button><AnalysisResult result={result} /></div></div>
  </>}</AppLayout>;
}

export const DiagnosisPage = () => <AppLayout>{() => <SimplePage title="Simulasi Diagnosis" desc="Form gejala, chatbot AI, kalkulator skor kesehatan mata, dan perbandingan hasil pemeriksaan." showActions />}</AppLayout>;
export const AnalyticsPage = () => <AppLayout>{() => <><SimplePage title="Analitik Data" desc="Visualisasi data kesehatan mata dengan chart interaktif." /><ChartCard title="Trend Monitoring Pasien" data={usageStats} bars={[{ key: 'ai', color: '#22d3ee' }]} /></>}</AppLayout>;
export const ReportsPage = () => <AppLayout>{() => <><SimplePage title="Laporan" desc="Smart report generator + export PDF/CSV." /><ReportTable reports={reports} /></>}</AppLayout>;
export const HistoryPage = () => <AppLayout>{() => <><SimplePage title="Riwayat Pemeriksaan" desc="Riwayat penggunaan dan monitoring pasien dari waktu ke waktu." /><div className="glass p-4 text-sm">{scans.slice(0, 12).map((s) => <p key={s.id}>• {s.id} - {s.type} - {s.date} - {s.patientId}</p>)}</div></>}</AppLayout>;
export const EducationPage = () => <AppLayout>{() => <SimplePage title="Edukasi Penyakit Mata" desc="FAQ, knowledge base, dan materi edukasi visual." />}</AppLayout>;
export const ChatbotPage = () => <AppLayout>{() => <SimplePage title="Chatbot AI Mata" desc="Tanya gejala mata, dapatkan kemungkinan kondisi dan rekomendasi awal." showActions />}</AppLayout>;
export const AdminPage = () => <AppLayout>{() => <><SimplePage title="Admin Panel" desc="Manajemen modul, user role, dan status sistem." /><div className="glass p-4"><p className="text-sm">Role aktif: admin, dokter, peneliti, pasien.</p></div></>}</AppLayout>;

export const AboutPage = () => <AppLayout>{() => <div className="space-y-4"><SimplePage title="About EYEVERSE AI" desc="Platform integratif untuk 41 teknologi AI mata dan 20 teknologi mata non-AI." /><div className="glass p-4"><SectionTitle>Visi</SectionTitle><p className="text-sm">Menjadi platform oftalmologi digital premium yang mempercepat diagnosis dan meningkatkan outcome pasien.</p></div><div className="glass p-4"><SectionTitle>Kemampuan Sistem</SectionTitle><ul className="list-disc pl-5 text-sm"><li>Analisis citra fundus/OCT</li><li>Prediksi risiko & monitoring longitudinal</li><li>Smart reporting PDF/CSV</li></ul></div><div className="glass p-4"><SectionTitle>Founder Profile</SectionTitle><p className="font-semibold">Dr. Sobri</p><p className="text-sm opacity-80">Medical innovator dengan fokus AI oftalmologi.</p><p className="mt-3 text-cyan-500 font-semibold">Created by Dr. Sobri</p></div></div>}</AppLayout>;

export const ContactPage = () => <AppLayout>{() => <div className="space-y-4"><SimplePage title="Contact" desc="Hubungi tim EYEVERSE AI untuk kolaborasi klinis & riset." /><form className="glass grid gap-2 p-4 md:grid-cols-2"><input placeholder="Nama" className="rounded-xl bg-white/10 p-2" /><input placeholder="Email" className="rounded-xl bg-white/10 p-2" /><textarea placeholder="Pesan" className="md:col-span-2 rounded-xl bg-white/10 p-2" rows={5} /><button className="md:col-span-2 rounded-xl bg-cyan-500 p-2">Kirim</button></form></div>}</AppLayout>;

export const NotFoundPage = () => <AppLayout>{() => <div className="glass p-10 text-center"><h1 className="text-4xl font-bold">404</h1><p>Halaman tidak ditemukan.</p><Link className="text-cyan-400 underline" to="/">Kembali</Link></div>}</AppLayout>;

function SimplePage({ title, desc, showActions = false }) {
  return <div className="glass p-4"><PageHeader title={title} subtitle={desc} />{showActions && <div className="flex gap-2"><button className="rounded-xl bg-cyan-500/20 px-3 py-1">Run Simulation</button><button className="rounded-xl bg-indigo-500/20 px-3 py-1">Save Mock</button></div>}<p className="mt-3 text-sm opacity-80">Semua tombol, menu, dan UI disiapkan untuk simulasi interaktif client-side.</p></div>;
}
