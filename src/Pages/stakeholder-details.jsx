import StakeholderDetails from "../Components/Stakeholders/StakeholderDetails"
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout"

function StakeholderDetailsPage() {
  return (
    <DashboardLayout activeMenuItem="user-management">
        <StakeholderDetails />
    </DashboardLayout>
  )
}

export default StakeholderDetailsPage
