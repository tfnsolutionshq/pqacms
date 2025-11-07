import StationManagement from "../Components/StationManagement/StationManagement"
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout"

function stationmanagement() {
  return (
    <DashboardLayout activeMenuItem="station-management">
      <StationManagement />
    </DashboardLayout>
  )
}

export default stationmanagement