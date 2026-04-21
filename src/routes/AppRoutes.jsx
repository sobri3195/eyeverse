import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/UIComponents';

const LandingPage = lazy(() => import('../pages/LandingPage'));

const DashboardPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.DashboardPage })));
const AITechnologiesPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.AITechnologiesPage })));
const EyeTechnologiesPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.EyeTechnologiesPage })));
const AIDetailPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.AIDetailPage })));
const EyeDetailPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.EyeDetailPage })));
const UploadPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.UploadPage })));
const DiagnosisPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.DiagnosisPage })));
const AnalyticsPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.ReportsPage })));
const HistoryPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.HistoryPage })));
const EducationPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.EducationPage })));
const ChatbotPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.ChatbotPage })));
const AdminPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.AdminPage })));
const AboutPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('../pages/AppPages').then((m) => ({ default: m.NotFoundPage })));

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

const loadingScreen = (
  <div className="mx-auto my-10 max-w-5xl rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-300">
    Memuat halaman EYEVERSE...
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={loadingScreen}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={protect(<DashboardPage />)} />
        <Route path="/ai-technologies" element={protect(<AITechnologiesPage />)} />
        <Route path="/eye-technologies" element={protect(<EyeTechnologiesPage />)} />
        <Route path="/ai-technologies/:id" element={protect(<AIDetailPage />)} />
        <Route path="/eye-technologies/:id" element={protect(<EyeDetailPage />)} />
        <Route path="/upload" element={protect(<UploadPage />)} />
        <Route path="/diagnosis" element={protect(<DiagnosisPage />)} />
        <Route path="/analytics" element={protect(<AnalyticsPage />)} />
        <Route path="/reports" element={protect(<ReportsPage />)} />
        <Route path="/history" element={protect(<HistoryPage />)} />
        <Route path="/education" element={protect(<EducationPage />)} />
        <Route path="/chatbot" element={protect(<ChatbotPage />)} />
        <Route path="/admin" element={protect(<AdminPage />)} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
