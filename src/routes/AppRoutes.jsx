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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ai-technologies" element={<AITechnologiesPage />} />
      <Route path="/eye-technologies" element={<EyeTechnologiesPage />} />
      <Route path="/ai-technologies/:id" element={<AIDetailPage />} />
      <Route path="/eye-technologies/:id" element={<EyeDetailPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/diagnosis" element={<DiagnosisPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/home" element={<Navigate to="/" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
