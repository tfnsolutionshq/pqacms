import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/login'
import TwoFactor from './Components/Authentication/2fa'
import DashboardPage from './Pages/DashboardPage'
import TankerFleetPage from './Pages/TankerFleetPage'
import LoadingControlPage from './Pages/loading-control'
import UnlockCodeRequestPage from './Pages/unlock-code-request'
import LiveTrackingPage from './Pages/live-tracking'
import AlertsPage from './Pages/alerts'
import DeviceManagementPage from './Pages/device-management'
import QualityAssurancePage from './Pages/quality-assurance'
import UserManagementPage from './Pages/user-management'
import StakeholderDetailsPage from './Pages/stakeholder-details'
import NationalWaybillPage from './Pages/national-waybill'
import DepotManagementPage from './Pages/depot-management'
import StationManagementPage from './Pages/station-management'
import EventAndAuditLogsPage from './Pages/event-and-audit-logs'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/2fa" element={<TwoFactor />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tanker-fleet" element={<TankerFleetPage />} />
        <Route path="/loading-control" element={<LoadingControlPage />} />
        <Route path="/unlock-code-request" element={<UnlockCodeRequestPage />} />
        <Route path="/live-tracking" element={<LiveTrackingPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/stakeholder-details/:id" element={<StakeholderDetailsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/device-management" element={<DeviceManagementPage />} />
        <Route path="/quality-assurance" element={<QualityAssurancePage />} />
        <Route path="/national-waybill" element={<NationalWaybillPage />} />
        <Route path="/depot-management" element={<DepotManagementPage />} />
        <Route path="/station-management" element={<StationManagementPage />} />
        <Route path="/events-and-audit-logs" element={<EventAndAuditLogsPage />} />
      </Routes>
    </Router>
  )
}

export default App
