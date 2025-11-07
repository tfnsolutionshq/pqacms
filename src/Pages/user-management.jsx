import React from 'react'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import UserManagement from '../Components/Stakeholders/Stakeholders'

function UserManagementPage() {
  return (
    <DashboardLayout activeMenuItem="user-management">
      <UserManagement />
    </DashboardLayout>
  )
}

export default UserManagementPage