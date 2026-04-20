import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity, Bell, Bot, Brain, Camera, ChevronDown, Eye, FileText, Home, LayoutDashboard, Menu, Microscope, Moon, Radar,
  ScanEye, Search, ShieldCheck, Stethoscope, Sun, UserCircle2, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const iconMap = { Brain, Eye, ScanEye, Radar, ShieldCheck, Activity, Bot, Camera, Microscope, Stethoscope };

const navItems = [
  ['/', 'Landing', Home], ['/dashboard', 'Dashboard', LayoutDashboard], ['/ai-technologies', 'AI Technologies', Brain], ['/eye-technologies', 'Eye Technologies', Microscope],
  ['/upload', 'Upload', Camera], ['/diagnosis', 'Diagnosis', Activity], ['/analytics', 'Analytics', Radar], ['/reports', 'Reports', FileText], ['/history', 'History', Activity],
  ['/education', 'Education', Eye], ['/chatbot', 'Chatbot', Bot], ['/admin', 'Admin', ShieldCheck], ['/about', 'About', UserCircle2], ['/contact', 'Contact', FileText]
];

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme} className="glass px-3 py-2">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>;
}

export function SearchBar({ value, onChange, placeholder = 'Cari data...' }) {
  return <div className="glass flex items-center gap-2 px-3 py-2 w-full"><Search size={16} /><input className="w-full bg-transparent outline-none" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}

export function FilterBar({ categories, selected, onSelect }) {
  return <div className="flex flex-wrap gap-2">{categories.map((c) => <button key={c} onClick={() => onSelect(c)} className={`rounded-xl px-3 py-1 text-sm ${selected === c ? 'bg-cyan-500/20 text-cyan-400' : 'glass'}`}>{c}</button>)}</div>;
}

export function SortSelect({ value, onChange, options }) {
  return <select className="glass px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option className="bg-slate-900" key={o.value} value={o.value}>{o.label}</option>)}</select>;
}

export function StatCard({ label, value }) { return <div className="glass p-4"><p className="text-xs opacity-70">{label}</p><p className="text-2xl font-bold text-cyan-400">{value}</p></div>; }

export function PageHeader({ title, subtitle, actions, breadcrumbs = [] }) {
  return <div className="mb-4 flex flex-wrap justify-between gap-3"><div><Breadcrumb items={breadcrumbs} /><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm opacity-75">{subtitle}</p></div><div className="flex gap-2">{actions}</div></div>;
}

export function Breadcrumb({ items }) {
  if (!items?.length) return null;
  return <div className="mb-1 text-xs opacity-70">{items.join(' / ')}</div>;
}

export function Sidebar({ open, setOpen }) {
  return (
    <>
      <aside className="glass hidden lg:flex lg:w-64 lg:flex-col lg:p-4 lg:h-[calc(100vh-2rem)]">
        <Brand />
        <nav className="mt-4 flex flex-col gap-1">{navItems.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-xl px-3 py-2 text-sm flex items-center gap-2 ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-white/10'}`}><Icon size={15} />{label}</NavLink>)}</nav>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-slate-950/95 p-4 transition lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-2 flex justify-between"><Brand /><button onClick={() => setOpen(false)}><X /></button></div>
        <nav className="mt-4 flex flex-col gap-1">{navItems.map(([to, label, Icon]) => <NavLink onClick={() => setOpen(false)} key={to} to={to} className={({ isActive }) => `rounded-xl px-3 py-2 text-sm flex items-center gap-2 ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-white/10'}`}><Icon size={15} />{label}</NavLink>)}</nav>
      </aside>
    </>
  );
}

export function Navbar() {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSide, setOpenSide] = useState(false);
  const { notifications, globalSearch, setGlobalSearch, auth } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <Sidebar open={openSide} setOpen={setOpenSide} />
      <div className="mb-4 flex items-center gap-2">
        <button className="glass p-2 lg:hidden" onClick={() => setOpenSide(true)}><Menu size={16} /></button>
        <SearchBar value={globalSearch} onChange={setGlobalSearch} placeholder="Global search..." />
        <div className="relative">
          <button className="glass flex items-center gap-1 px-3 py-2" onClick={() => setOpenNotif((p) => !p)}><Bell size={16} /><ChevronDown size={14} /></button>
          {openNotif && <div className="glass absolute right-0 mt-2 w-64 p-2 text-sm">{notifications.map((n) => <p key={n} className="border-b border-white/10 py-1 last:border-none">{n}</p>)}</div>}
        </div>
        <ThemeToggle />
        <div className="relative">
          <button className="glass flex items-center gap-1 px-3 py-2" onClick={() => setOpenProfile((p) => !p)}><UserCircle2 size={16} /><ChevronDown size={14} /></button>
          {openProfile && <div className="glass absolute right-0 mt-2 w-44 p-2 text-sm"><p className="px-2 py-1">{auth?.name || 'User'}</p><button onClick={() => navigate('/dashboard')} className="w-full rounded px-2 py-1 text-left hover:bg-white/10">Dashboard</button></div>}
        </div>
      </div>
    </>
  );
}

function Brand() {
  return <div><h2 className="text-xl font-bold text-cyan-400">EYEVERSE AI</h2><p className="text-xs opacity-75">Platform 41 Teknologi AI Mata + 20 Teknologi Mata</p></div>;
}

export function Footer() { return <footer className="glass mt-8 flex flex-wrap items-center justify-between gap-2 p-4 text-sm"><p>© 2026 EYEVERSE AI</p><p className="text-cyan-400 font-semibold">Created by Dr. Sobri</p></footer>; }

export function EmptyState({ title = 'Data kosong', message = 'Tidak ada data untuk ditampilkan.' }) { return <div className="glass p-6 text-center"><h3 className="font-semibold">{title}</h3><p className="text-sm opacity-75">{message}</p></div>; }
export function ErrorState({ message }) { return <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-300">{message}</div>; }
export function LoadingSkeleton() { return <div className="glass h-28 animate-pulse" />; }
export function Toast() { const { toasts } = useApp(); return <div className="fixed right-4 top-4 z-[60] flex w-72 flex-col gap-2">{toasts.map((t) => <div key={t.id} className="glass px-3 py-2 text-sm">{t.message}</div>)}</div>; }

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[55] grid place-items-center bg-black/60 p-4" onClick={onClose}><div className="glass max-w-lg p-4" onClick={(e) => e.stopPropagation()}><h3 className="font-semibold">{title}</h3><div className="mt-2">{children}</div><button className="mt-3 rounded bg-cyan-500/20 px-3 py-1" onClick={onClose}>Tutup</button></div></div>;
}

export function ProtectedRoute({ children }) {
  return children;
}
