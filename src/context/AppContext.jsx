import { createContext, useContext, useMemo, useState } from 'react';
import { useMockAuth } from '../hooks/useMockAuth';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const auth = useMockAuth();
  const [notifications] = useState(['Scan baru siap ditinjau', 'Update modul AI tersedia', 'Reminder export laporan']);
  const [toasts, setToasts] = useState([]);

  const pushToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  };

  const value = useMemo(() => ({ ...auth, notifications, toasts, pushToast }), [auth, notifications, toasts]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
