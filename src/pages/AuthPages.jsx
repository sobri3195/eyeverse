import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email')?.toString().trim();
    const password = fd.get('password')?.toString();
    if (!email || !email.includes('@') || !password || password.length < 6) {
      setError('Email/password tidak valid (password min 6 karakter).');
      return;
    }
    login({ email, name: 'Dr. Vision User', role: 'dokter' });
    navigate(location.state?.from || '/dashboard');
  };

  return <div className="grid min-h-screen place-items-center p-4"><form onSubmit={onSubmit} className="glass w-full max-w-md p-6 space-y-3"><h1 className="text-2xl font-bold">Login EYEVERSE AI</h1><input name="email" type="email" placeholder="Email" className="w-full rounded-xl bg-white/10 p-2" /><input name="password" type="password" placeholder="Password" className="w-full rounded-xl bg-white/10 p-2" />{error && <p className="text-sm text-red-300">{error}</p>}<button className="w-full rounded-xl bg-cyan-500 p-2 font-semibold">Masuk</button><p className="text-sm">Belum punya akun? <Link to="/register" className="text-cyan-300">Register</Link></p><p className="text-center text-sm text-cyan-400">Created by Dr. Sobri</p></form></div>;
}

export function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const password = fd.get('password')?.toString();
    const confirm = fd.get('confirm')?.toString();
    if (!name || !email.includes('@') || password.length < 6 || password !== confirm) {
      setError('Validasi gagal. Cek nama/email/password/konfirmasi.');
      return;
    }
    register({ name, email });
    navigate('/dashboard');
  };

  return <div className="grid min-h-screen place-items-center p-4"><form onSubmit={onSubmit} className="glass w-full max-w-md p-6 space-y-3"><h1 className="text-2xl font-bold">Register EYEVERSE AI</h1><input name="name" placeholder="Nama" className="w-full rounded-xl bg-white/10 p-2" /><input name="email" type="email" placeholder="Email" className="w-full rounded-xl bg-white/10 p-2" /><input name="password" type="password" placeholder="Password" className="w-full rounded-xl bg-white/10 p-2" /><input name="confirm" type="password" placeholder="Konfirmasi Password" className="w-full rounded-xl bg-white/10 p-2" />{error && <p className="text-sm text-red-300">{error}</p>}<button className="w-full rounded-xl bg-cyan-500 p-2 font-semibold">Daftar</button><p className="text-sm">Sudah punya akun? <Link to="/login" className="text-cyan-300">Login</Link></p></form></div>;
}
