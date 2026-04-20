import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import {
  AboutPage,
  AdminPage,
  AIDetailPage,
  AITechnologiesPage,
  AnalyticsPage,
  ChatbotPage,
  ContactPage,
  DashboardPage,
  DiagnosisPage,
  EducationPage,
  EyeDetailPage,
  EyeTechnologiesPage,
  HistoryPage,
  NotFoundPage,
  ReportsPage,
  UploadPage
} from '../pages/AppPages';
import { ProtectedRoute } from '../components/UIComponents';

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
  );
}
