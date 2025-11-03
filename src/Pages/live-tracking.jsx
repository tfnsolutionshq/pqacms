import React from 'react'
import LiveTracking from '../Components/Tankerfleet/LiveTracking'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'

function LiveTrackingPage() {
  return (
    <DashboardLayout activeMenuItem="live-tracking">
      <LiveTracking />
    </DashboardLayout>
  )
}

export default LiveTrackingPage