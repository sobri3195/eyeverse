import { createContext, useContext, useMemo, useState } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { buildSeedData } from '../utils/generateMockData';

const AppContext = createContext(null);
const seed = buildSeedData();

export function AppProvider({ children }) {
  const [auth, setAuth] = useLocalStorageState('eyeverse_auth', null);
  const [localReports, setLocalReports] = useLocalStorageState('eyeverse_local_reports', []);
  const [localHistories, setLocalHistories] = useLocalStorageState('eyeverse_local_histories', []);
  const [chatHistory, setChatHistory] = useLocalStorageState('eyeverse_chat', []);
  const [modulePreferences, setModulePreferences] = useLocalStorageState('eyeverse_preferences', { aiStatus: {}, eyeStatus: {} });
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);

  const reports = useMemo(() => [...localReports, ...seed.reports], [localReports]);
  const histories = useMemo(() => [...localHistories, ...seed.histories], [localHistories]);

  const pushToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  };

  const addReport = (report) => setLocalReports((prev) => [report, ...prev]);
  const removeLocalReport = (id) => setLocalReports((prev) => prev.filter((r) => r.id !== id));
  const addHistory = (history) => setLocalHistories((prev) => [history, ...prev]);
  const removeLocalHistory = (id) => setLocalHistories((prev) => prev.filter((h) => h.id !== id));

  const login = ({ email, name }) => setAuth({ email, name: name || 'User EYEVERSE', role: 'dokter' });
  const register = ({ email, name }) => setAuth({ email, name, role: 'dokter' });
  const logout = () => setAuth(null);

  const value = {
    auth,
    isAuthenticated: Boolean(auth),
    login,
    register,
    logout,
    globalSearch,
    setGlobalSearch,
    seed,
    reports,
    histories,
    localReports,
    localHistories,
    addReport,
    removeLocalReport,
    addHistory,
    removeLocalHistory,
    chatHistory,
    setChatHistory,
    modulePreferences,
    setModulePreferences,
    toasts,
    pushToast,
    notifications: seed.activities.slice(0, 5).map((a) => `${a.actor} ${a.action}`),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
