import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    login({ email: fd.get('email'), role: fd.get('role') });
    navigate('/dashboard');
  };
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Login EYEVERSE AI</h1>
        <input name="email" type="email" required placeholder="Email" className="mt-3 w-full rounded-xl bg-white/10 p-2" />
        <select name="role" className="mt-3 w-full rounded-xl bg-slate-800 p-2"><option>admin</option><option>dokter</option><option>peneliti</option><option>pasien</option></select>
        <button className="mt-4 w-full rounded-xl bg-cyan-500 p-2 font-semibold">Masuk</button>
        <p className="mt-2 text-sm">Belum punya akun? <Link to="/register" className="text-cyan-400">Register</Link></p>
        <p className="mt-4 text-center text-sm font-semibold text-cyan-500">Created by Dr. Sobri</p>
      </form>
    </div>
  );
}

export const RegisterPage = () => (
  <div className="grid min-h-screen place-items-center p-4">
    <form className="glass w-full max-w-md p-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <input placeholder="Nama" className="mt-3 w-full rounded-xl bg-white/10 p-2" />
      <input placeholder="Email" className="mt-3 w-full rounded-xl bg-white/10 p-2" />
      <input placeholder="Password" type="password" className="mt-3 w-full rounded-xl bg-white/10 p-2" />
      <button className="mt-4 w-full rounded-xl bg-cyan-500 p-2">Daftar</button>
      <p className="mt-2 text-sm">Sudah punya akun? <Link to="/login" className="text-cyan-400">Login</Link></p>
    </form>
  </div>
);
