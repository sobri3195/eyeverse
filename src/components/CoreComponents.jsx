import { Link, NavLink } from 'react-router-dom';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="glass p-2">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export const SearchBar = ({ value, onChange }) => (
  <div className="glass flex items-center gap-2 px-3 py-2">
    <Search size={16} />
    <input className="w-full bg-transparent outline-none" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search modul, pasien, laporan..." />
  </div>
);

const links = [
  ['/', 'Landing'], ['/dashboard', 'Dashboard'], ['/ai-technologies', 'AI Tech'], ['/eye-technologies', 'Eye Tech'],
  ['/upload', 'Upload'], ['/diagnosis', 'Diagnosis'], ['/analytics', 'Analytics'], ['/reports', 'Reports'], ['/history', 'History'],
  ['/education', 'Education'], ['/chatbot', 'Chatbot'], ['/admin', 'Admin'], ['/about', 'About'], ['/contact', 'Contact']
];

export const Sidebar = () => (
  <aside className="glass hidden h-[calc(100vh-2rem)] w-64 flex-col gap-2 p-4 lg:flex">
    <h2 className="text-xl font-bold text-cyan-500">EYEVERSE AI</h2>
    <p className="text-xs opacity-70">Platform 41 Teknologi AI Mata + 20 Teknologi Mata</p>
    <nav className="mt-4 flex flex-col gap-1 text-sm">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `rounded-xl px-3 py-2 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'}`}>
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export const Navbar = ({ search, setSearch }) => {
  const { notifications } = useApp();
  return (
    <header className="mb-4 flex items-center gap-3">
      <SearchBar value={search} onChange={setSearch} />
      <div className="glass flex items-center gap-2 p-2">
        <Bell size={16} />
        <span className="text-xs">{notifications.length}</span>
      </div>
      <ThemeToggle />
    </header>
  );
};

export const Footer = () => (
  <footer className="glass mt-8 flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
    <div>
      <strong>EYEVERSE AI</strong> © 2026
    </div>
    <div className="flex gap-3">
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </div>
    <div className="font-semibold text-cyan-500">Created by Dr. Sobri</div>
  </footer>
);

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm opacity-75">{subtitle}</p>
    </div>
    {actions}
  </div>
);

export const SectionTitle = ({ children }) => <h2 className="mb-3 text-lg font-semibold text-cyan-400">{children}</h2>;

export const LoadingSkeleton = () => <div className="glass h-24 animate-pulse" />;

export const Toasts = () => {
  const { toasts } = useApp();
  return (
    <div className="fixed right-5 top-5 z-50 flex w-72 flex-col gap-2">
      {toasts.map((t) => <div key={t.id} className="glass px-3 py-2 text-sm">{t.message}</div>)}
    </div>
  );
};
