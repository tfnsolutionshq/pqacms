import React from 'react'
import UnlockCodeRequests from '../Components/Tankerfleet/UnlockCodeRequests'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'

function UnlockCodeRequestPage() {
  return (
    <DashboardLayout activeMenuItem="unlock-requests">
      <UnlockCodeRequests />
    </DashboardLayout>
  )
}

export default UnlockCodeRequestPage