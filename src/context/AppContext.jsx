import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { initialReports } from '../data/reports';
import { initialHistory } from '../data/history';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [auth, setAuth] = useLocalStorageState('eyeverse_auth', null);
  const [reports, setReports] = useLocalStorageState('eyeverse_reports', initialReports);
  const [history, setHistory] = useLocalStorageState('eyeverse_history', initialHistory);
  const [chatHistory, setChatHistory] = useLocalStorageState('eyeverse_chat', []);
  const [modulePreferences, setModulePreferences] = useLocalStorageState('eyeverse_preferences', { aiStatus: {}, eyeStatus: {} });
  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');

  const pushToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  };

  const login = (payload) => {
    setAuth({ email: payload.email, name: payload.name || 'User EYEVERSE', role: payload.role || 'dokter' });
    pushToast('Login berhasil');
  };
  const register = (payload) => {
    setAuth({ email: payload.email, name: payload.name, role: 'dokter' });
    pushToast('Registrasi berhasil');
  };
  const logout = () => {
    setAuth(null);
    pushToast('Logout berhasil');
  };

  const value = useMemo(() => ({
    auth,
    isAuthenticated: Boolean(auth),
    login,
    register,
    logout,
    reports,
    setReports,
    history,
    setHistory,
    chatHistory,
    setChatHistory,
    modulePreferences,
    setModulePreferences,
    toasts,
    pushToast,
    globalSearch,
    setGlobalSearch,
    notifications: ['2 laporan perlu review', '1 modul AI dinonaktifkan admin', 'Pengingat kontrol pasien hari ini']
  }), [auth, reports, history, chatHistory, modulePreferences, toasts, globalSearch]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

export function useRequireAuth() {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  if (!isAuthenticated) navigate('/login');
}
