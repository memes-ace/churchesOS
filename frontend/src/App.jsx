import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import CellGroupsPage from './pages/CellGroupsPage'
import CounsellingPage from './pages/CounsellingPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import VolunteersPage from './pages/VolunteersPage'
import AiPage from './pages/AiPage'
import PendingApprovalPage from './pages/PendingApprovalPage'
import LandingPage from './pages/LandingPage'
import SongLibraryPage from './pages/SongLibraryPage'
import EquipmentPage from './pages/EquipmentPage'
import PurchasesPage from './pages/PurchasesPage'
import RolesPage from './pages/RolesPage'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperChurchesPage from './pages/SuperChurchesPage'
import SuperRevenuePage from './pages/SuperRevenuePage'
import MemberPortalPage from './pages/MemberPortalPage'
import MemberLoginPage from './pages/MemberLoginPage'
import VendorRegisterPage from './pages/VendorRegisterPage'
import SuperVendorsPage from './pages/SuperVendorsPage'
import QuoteRequestsPage from './pages/QuoteRequestsPage'
import SuperSettingsPage from './pages/SuperSettingsPage'
import PlansPage from './pages/PlansPage'
import SmsTopupsPage from './pages/SmsTopupsPage'
import MarketplaceAdminPage from './pages/MarketplaceAdminPage'
import LandingEditorPage from './pages/LandingEditorPage'
import ChurchSettingsPage from './pages/ChurchSettingsPage'
import SuperLoginPage from './pages/SuperLoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Keep backend alive - ping every 10 minutes to prevent Render cold starts
if (typeof window !== 'undefined') {
  setInterval(() => {
    fetch('https://churchesos.onrender.com/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ping', password: 'ping' })
    }).catch(() => {})
  }, 10 * 60 * 1000) // every 10 minutes
}

function Root() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F172A' }}>
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'super_admin' || user.email === 'admin@churchesos.com' || user.email === 'churchesos97@gmail.com') {
    return <Navigate to="/super-admin" replace />
  }
  return <Navigate to="/church/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendor-apply" element={<VendorRegisterPage />} />
          <Route path="/pending" element={<PendingApprovalPage user={JSON.parse(localStorage.getItem('cos_user') || '{}')} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/member-portal" element={<MemberPortalPage />} />
          <Route path="/member-login" element={<MemberLoginPage />} />
          <Route path="/vendor-register" element={<VendorRegisterPage />} />
          <Route path="/admin-login" element={<SuperLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/church" element={<ChurchLayout />}>
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
            <Route path="ai" element={<AiPage />} />
            <Route path="songs" element={<SongLibraryPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="settings" element={<ChurchSettingsPage />} />
          </Route>

          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="churches" element={<SuperChurchesPage />} />
            <Route path="revenue" element={<SuperRevenuePage />} />
            <Route path="vendors" element={<SuperVendorsPage />} />
            <Route path="quotes" element={<QuoteRequestsPage />} />
            <Route path="settings" element={<SuperSettingsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="sms" element={<SmsTopupsPage />} />
            <Route path="marketplace" element={<MarketplaceAdminPage />} />
            <Route path="landing" element={<LandingEditorPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
