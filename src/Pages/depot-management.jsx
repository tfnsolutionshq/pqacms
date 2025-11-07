import DepotManagement from "../Components/DepotManagement/DepotManagement"
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout"

function depotmanagement() {
  return (
    <DashboardLayout activeMenuItem="depot-management">
      <DepotManagement />
    </DashboardLayout>
  )
}

export default depotmanagement