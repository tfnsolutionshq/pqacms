import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/login'
import TwoFactor from './Components/Authentication/2fa'
import DashboardPage from './Pages/DashboardPage'
import TankerFleetPage from './Pages/TankerFleetPage'
import LoadingControlPage from './Pages/loading-control'
import UnlockCodeRequestPage from './Pages/unlock-code-request'
import LiveTrackingPage from './Pages/live-tracking'
import AlertsPage from './Pages/alerts'
import UserManagementPage from './Pages/user-management'

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
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </Router>
  )
}

export default App
