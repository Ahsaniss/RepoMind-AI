import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import RepositoriesPage from './pages/Repositories';
import RepositoryPage from './pages/Repository';
import AIEngineerPage from './pages/AIEngineer';
import AnalysisPage from './pages/Analysis';
import SecurityPage from './pages/Security';
import TestsPage from './pages/Tests';
import DocumentationPage from './pages/Documentation';
import ArchitecturePage from './pages/Architecture';
import ActivityPage from './pages/Activity';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/repositories"   element={<RepositoriesPage />} />
          <Route path="/repositories/:id" element={<RepositoryPage />} />
          <Route path="/ai"             element={<AIEngineerPage />} />
          <Route path="/analysis"       element={<AnalysisPage />} />
          <Route path="/security"       element={<SecurityPage />} />
          <Route path="/tests"          element={<TestsPage />} />
          <Route path="/documentation"  element={<DocumentationPage />} />
          <Route path="/architecture"   element={<ArchitecturePage />} />
          <Route path="/activity"       element={<ActivityPage />} />
          <Route path="/settings"       element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
