import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import Alerts from '../Components/Tankerfleet/Alerts'

function AlertsPage() {
  return (
    <DashboardLayout activeMenuItem="alert-center">
      <Alerts />
    </DashboardLayout>
  )
}

export default AlertsPage