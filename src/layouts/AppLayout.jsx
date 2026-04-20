import { Footer, Navbar, Toast } from '../components/UIComponents';

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen p-4">
      <Toast />
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <div className="hidden lg:block lg:w-64" />
        <main className="flex-1">
          <Navbar />
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
