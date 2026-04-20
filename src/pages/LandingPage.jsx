import { Link } from 'react-router-dom';
import { Footer } from '../components/UIComponents';

export default function LandingPage() {
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4"><div className="mx-auto max-w-6xl text-white"><div className="glass p-8"><h1 className="text-4xl font-extrabold text-cyan-300">EYEVERSE AI</h1><p className="mt-2">Platform 41 Teknologi AI Mata + 20 Teknologi Mata</p><p className="mt-3 max-w-3xl opacity-90">Platform simulasi medical-tech premium, seluruh fitur berjalan penuh di frontend/client-side dengan data mock lokal.</p><div className="mt-6 flex flex-wrap gap-3"><Link className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold" to="/dashboard">Masuk Dashboard</Link></div></div><div className="mt-6 grid gap-3 md:grid-cols-3">{['41 Modul AI Interaktif', '20 Teknologi Mata Non-AI', 'Export PDF/CSV + LocalStorage'].map((x) => <div key={x} className="glass p-4">{x}</div>)}</div><Footer /></div></div>;
}
