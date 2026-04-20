import { useState } from 'react';

export const useMockAuth = () => {
  const [user, setUser] = useState(null);

  const login = ({ email, role }) => setUser({ email, role, name: 'Dr. Vision User' });
  const logout = () => setUser(null);

  return { user, login, logout };
};
