import React from 'react'
import NationalWaybill from '../Components/NationalWaybill/NationalWaybill'
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout'

export default function NationalWaybillPage() {
  return (
    <DashboardLayout activeMenuItem="national-waybill">
      <NationalWaybill />
    </DashboardLayout>
  )
}