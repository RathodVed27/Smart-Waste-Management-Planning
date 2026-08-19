import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Entry from './pages/Entry';
import StaffLogin from './pages/StaffLogin';
import { useAuth, type StaffRole } from './data/AuthContext';
// Citizen Pages
import CitizenHome from './pages/citizen/CitizenHome';
import ReportWaste from './pages/citizen/ReportWaste';
import ReportList from './pages/citizen/ReportList';
import ReportStatus from './pages/citizen/ReportStatus';

import DriverHome from './pages/driver/DriverHome';
import StopCompletion from './pages/driver/StopCompletion';
import ReportIssue from './pages/driver/ReportIssue';

import WardAdminDashboard from './pages/admin/WardAdminDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

const ProtectedRole = ({ role }: { role: StaffRole }) => {
  const { role: activeRole } = useAuth();
  return activeRole === role ? <Outlet /> : <Navigate to={`/login/${role}`} replace />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="/roles" element={<Entry />} />
        <Route path="/login/:role" element={<StaffLogin />} />
        <Route element={<MainLayout />}>
          <Route path="/citizen">
            <Route index element={<CitizenHome />} />
            <Route path="report" element={<ReportWaste />} />
            <Route path="reports" element={<ReportList />} />
            <Route path="report/:id" element={<ReportStatus />} />
            {/* nearby maps placeholder */}
            <Route path="nearby" element={<CitizenHome />} />
          </Route>
          <Route element={<ProtectedRole role="driver" />}>
            <Route path="/driver">
              <Route index element={<DriverHome />} />
              <Route path="stop/:id" element={<StopCompletion />} />
              <Route path="issue" element={<ReportIssue />} />
            </Route>
          </Route>
          <Route element={<ProtectedRole role="ward-admin" />}><Route path="/ward-admin/*" element={<WardAdminDashboard />} /></Route>
          <Route element={<ProtectedRole role="super-admin" />}><Route path="/super-admin/*" element={<SuperAdminDashboard />} /></Route>
        </Route>
        <Route path="*" element={<Navigate to="/citizen" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
