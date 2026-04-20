import { useState } from 'react';
import { Footer, Navbar, Sidebar, Toasts } from '../components/CoreComponents';

export const AppLayout = ({ children }) => {
  const [search, setSearch] = useState('');
  return (
    <div className="min-h-screen p-4">
      <Toasts />
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <Sidebar />
        <main className="flex-1">
          <Navbar search={search} setSearch={setSearch} />
          {typeof children === 'function' ? children(search) : children}
          <Footer />
        </main>
      </div>
    </div>
  );
};
