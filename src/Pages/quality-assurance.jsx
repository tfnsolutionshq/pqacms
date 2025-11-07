import React from 'react'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'
import QualityAssurance from '../Components/QualityAssurance/QualityAssurance'

function QualityAssurancePage() {
  return (
    <DashboardLayout activeMenuItem="quality-assurance">
      <QualityAssurance />
    </DashboardLayout>
  )
}

export default QualityAssurancePage