import React from 'react'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import TankerFleet from '../Components/Tankerfleet/TankerFleet'

function TankerFleetPage() {
  return (
    <DashboardLayout activeMenuItem="device-manager">
      <TankerFleet />
    </DashboardLayout>
  )
}

export default TankerFleetPage