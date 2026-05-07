import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SuperAdminDashboard from './features/superadmin/SuperAdminDashboard';
import PropertiesPage from './features/properties/PropertiesPage';
import RevenueIntelligencePage from './features/revenue/RevenueIntelligencePage';
import ReputationPage from './features/reputation/ReputationPage';
import AlertsPage from './features/alerts/AlertsPage';
import StaffPage from './features/staff/StaffPage';
import BranchReportsPage from './features/reports/BranchReportsPage';
import RoomsPage from './features/rooms/RoomsPage';
import BookingsPage from './features/bookings/BookingsPage';
import EventsPage from './features/events/EventsPage';
import MenuPage from './features/food/MenuPage';
import CateringPage from './features/food/CateringPage';
import GuestsPage from './features/guests/GuestsPage';
import BillingPage from './features/billing/BillingPage';
import ProfilePage from './features/profile/ProfilePage';
import SettingsPage from './features/settings/SettingsPage';
import IntegrationsPage from './features/integrations/IntegrationsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isOwner } = useAuth();
  if (isAuthenticated) return <Navigate to={isOwner ? '/super-dashboard' : '/dashboard'} replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Enterprise / Super Admin */}
        <Route path="/super-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/revenue" element={<RevenueIntelligencePage />} />
        <Route path="/reputation" element={<ReputationPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        {/* Branch / Property Operations */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<BranchReportsPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/food/menu" element={<MenuPage />} />
        <Route path="/food/catering" element={<CateringPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
