import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { BookingPage } from '@/pages/BookingPage';
import { MyAppointmentsPage } from '@/pages/MyAppointmentsPage';
import { DoctorWorkspacePage } from '@/pages/DoctorWorkspacePage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminDoctorsPage } from '@/pages/AdminDoctorsPage';

function HomeRedirect() {
  const { activeRole } = useApp();
  if (activeRole === 'DOCTOR') {
    return <Navigate to="/doctor" replace />;
  }
  if (activeRole === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/booking" replace />;
}

export function AppContent() {
  const { isDark } = useApp();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#F8FAFC' : '#0F172A',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/doctor" element={<DoctorWorkspacePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/doctors" element={<AdminDoctorsPage defaultTab="doctors" />} />
          <Route path="/admin/specialties" element={<AdminDoctorsPage defaultTab="specialties" />} />
          <Route path="/admin/appointments" element={<AdminDoctorsPage defaultTab="appointments" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
