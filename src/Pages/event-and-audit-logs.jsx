import EventAndAuditLogs from "../Components/EventAndAuditLogs/EventAndAuditLogs"
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout"

function eventandauditlogs() {
  return (
    <DashboardLayout activeMenuItem="event-and-audit-logs">
      <EventAndAuditLogs />
    </DashboardLayout>
  )
}

export default eventandauditlogs