import React from 'react'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import DeviceManagement from '../Components/DeviceManagement/DeviceManagement'

function DeviceManagementPage() {
  return (
    <DashboardLayout activeMenuItem="device-management">
      <DeviceManagement />
    </DashboardLayout>
  )
}

export default DeviceManagementPage