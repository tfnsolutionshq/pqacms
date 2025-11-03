import React from 'react'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import LoadingControl from '../Components/Tankerfleet/LoadingControl'

function LoadingControlPage() {
  return (
    <DashboardLayout activeMenuItem="loading-control">
      <LoadingControl />
    </DashboardLayout>
  )
}

export default LoadingControlPage