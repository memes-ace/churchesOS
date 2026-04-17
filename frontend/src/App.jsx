import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ChurchLayout from './components/layouts/ChurchLayout'
import SuperAdminLayout from './components/layouts/SuperAdminLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChurchDashboard from './pages/ChurchDashboard'
import MembersPage from './pages/MembersPage'
import AttendancePage from './pages/AttendancePage'
import FinancePage from './pages/FinancePage'
import EventsPage from './pages/EventsPage'
import CommunicationPage from './pages/CommunicationPage'
import SermonsPage from './pages/SermonsPage'
import VisitorsPage from './pages/VisitorsPage'
import PrayerPage from './pages/PrayerPage'
import MarketplacePage from './pages/MarketplacePage'
import ReportsPage from './pages/ReportsPage'
import MinistriesPage from './pages/MinistriesPage'
import SongLibraryPage from './pages/SongLibraryPage'
import EquipmentPage from './pages/EquipmentPage'
import PurchasesPage from './pages/PurchasesPage'
import RolesPage from './pages/RolesPage'
import CellGroupsPage from './pages/CellGroupsPage'
import CounsellingPage from './pages/CounsellingPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import VolunteersPage from './pages/VolunteersPage'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperChurchesPage from './pages/SuperChurchesPage'
import SuperRevenuePage from './pages/SuperRevenuePage'

function Guard({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F172A' }}>
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function Root() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'super_admin'
    ? <Navigate to="/super-admin" replace />
    : <Navigate to="/church/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/church" element={<Guard roles={['church_admin','finance_officer','ministry_leader','media_team']}><ChurchLayout /></Guard>}>
            <Route path="dashboard" element={<ChurchDashboard />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="communication" element={<CommunicationPage />} />
            <Route path="sermons" element={<SermonsPage />} />
            <Route path="visitors" element={<VisitorsPage />} />
            <Route path="prayer" element={<PrayerPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="ministries" element={<MinistriesPage />} />
            <Route path="cell-groups" element={<CellGroupsPage />} />
            <Route path="counselling" element={<CounsellingPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="volunteers" element={<VolunteersPage />} />
            <Route path="songs" element={<SongLibraryPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="roles" element={<RolesPage />} />
          </Route>

          <Route path="/super-admin" element={<Guard roles={['super_admin']}><SuperAdminLayout /></Guard>}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="churches" element={<SuperChurchesPage />} />
            <Route path="revenue" element={<SuperRevenuePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { style: { background: '#DBEAFE', color: '#1E40AF' } },
          error: { style: { background: '#FEE2E2', color: '#991B1B' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  )
}
// New modules - add to imports at top manually
