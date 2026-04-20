import { Link } from 'react-router-dom';
import { Footer, SectionTitle } from '../components/CoreComponents';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="glass p-8">
          <h1 className="text-4xl font-extrabold">EYEVERSE AI</h1>
          <p className="mt-2 text-cyan-300">Platform 41 Teknologi AI Mata + 20 Teknologi Mata</p>
          <p className="mt-4 max-w-3xl text-sm opacity-90">Platform medical-tech premium untuk analitik mata, simulasi diagnosis, monitoring pasien, dan pelaporan pintar berbasis AI.</p>
          <div className="mt-6 flex gap-3">
            <Link className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold" to="/login">Masuk</Link>
            <Link className="rounded-xl border border-cyan-400 px-4 py-2" to="/dashboard">Lihat Dashboard</Link>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Diagnostik Citra', 'Monitoring Cerdas', 'Smart Reporting'].map((x) => <div key={x} className="glass p-4"><SectionTitle>{x}</SectionTitle><p className="text-sm">Workflow cepat, akurat, dan siap operasional klinik.</p></div>)}
        </div>
        <Footer />
      </div>
    </div>
  );
}
