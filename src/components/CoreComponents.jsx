import { Link, NavLink } from 'react-router-dom';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="glass p-2" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export const SearchBar = ({ value, onChange }) => (
  <div className="glass flex w-full items-center gap-2 px-3 py-2">
    <Search size={16} className="shrink-0" />
    <input
      className="w-full bg-transparent text-sm outline-none sm:text-base"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search modul, pasien, laporan..."
    />
  </div>
);

const links = [
  ['/', 'Landing'], ['/dashboard', 'Dashboard'], ['/ai-technologies', 'AI Tech'], ['/eye-technologies', 'Eye Tech'],
  ['/upload', 'Upload'], ['/diagnosis', 'Diagnosis'], ['/analytics', 'Analytics'], ['/reports', 'Reports'], ['/history', 'History'],
  ['/education', 'Education'], ['/chatbot', 'Chatbot'], ['/admin', 'Admin'], ['/about', 'About'], ['/contact', 'Contact']
];

const Brand = ({ compact = false }) => (
  <div className="flex items-center gap-3">
    <img src="/logo-eyeverse.svg" alt="EYEVERSE AI logo" className={compact ? 'h-8 w-8' : 'h-10 w-10'} />
    <div>
      <h2 className={compact ? 'text-lg font-bold text-cyan-500' : 'text-xl font-bold text-cyan-500'}>EYEVERSE AI</h2>
      {!compact && <p className="text-xs opacity-70">Platform 41 Teknologi AI Mata + 20 Teknologi Mata</p>}
    </div>
  </div>
);

export const Sidebar = () => (
  <aside className="glass hidden h-[calc(100vh-2rem)] w-64 flex-col gap-2 p-4 lg:flex">
    <Brand />
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="mb-4">
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <Brand compact />
        <button
          className="glass p-2"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="glass mb-3 grid grid-cols-2 gap-1 p-3 text-sm sm:grid-cols-3 lg:hidden">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `rounded-lg px-2 py-2 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} />
        <div className="ml-auto flex items-center gap-2">
          <div className="glass flex items-center gap-2 p-2">
            <Bell size={16} />
            <span className="text-xs">{notifications.length}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
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
    <div className="fixed right-5 top-5 z-50 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((t) => <div key={t.id} className="glass px-3 py-2 text-sm">{t.message}</div>)}
    </div>
  );
};
