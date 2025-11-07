import React, { useState } from 'react'
import { FaSearch, FaFilter, FaDownload, FaSync, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaClock } from 'react-icons/fa'

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function EventAndAuditLogs() {
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('All Modules')
  const [actionFilter, setActionFilter] = useState('All Actions')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateRange, setDateRange] = useState('Last 7 Days')

  const auditLogs = [
    {
      timestamp: '2025-11-05 14:35:22',
      user: 'John Adebayo',
      userId: 'USR-001',
      role: 'Admin',
      action: 'User Created',
      module: 'User Management',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100'
    },
    {
      timestamp: '2025-11-05 14:28:15',
      user: 'Sarah Johnson',
      userId: 'USR-002',
      role: 'Depot Manager',
      action: 'Way Bill Approved',
      module: 'Way Bill Management',
      status: 'SUCCESS',
      ipAddress: '192.168.1.105'
    },
    {
      timestamp: '2025-11-05 14:15:08',
      user: 'Admin System',
      userId: 'SYS-001',
      role: 'System',
      action: 'Device Deactivated',
      module: 'Device Management',
      status: 'WARNING',
      ipAddress: '192.168.1.100'
    },
    {
      timestamp: '2025-11-05 14:02:45',
      user: 'Emmanuel Uche',
      userId: 'USR-015',
      role: 'Security Officer',
      action: 'Lock Override Attempted',
      module: 'Smart Lock Control',
      status: 'FAILURE',
      ipAddress: '192.168.1.120'
    },
    {
      timestamp: '2025-11-05 13:45:30',
      user: 'Fatima Ibrahim',
      userId: 'USR-008',
      role: 'Station Manager',
      action: 'QA Certificate Verified',
      module: 'Quality Assurance',
      status: 'SUCCESS',
      ipAddress: '192.168.1.112'
    },
    {
      timestamp: '2025-11-05 13:30:12',
      user: 'John Adebayo',
      userId: 'USR-001',
      role: 'Admin',
      action: 'Stakeholder Registered',
      module: 'Stakeholder Management',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100'
    },
    {
      timestamp: '2025-11-05 13:12:55',
      user: 'Chidinma Eze',
      userId: 'USR-012',
      role: 'Driver',
      action: 'Route Deviation Alert',
      module: 'Live Tracking',
      status: 'WARNING',
      ipAddress: '192.168.1.125'
    },
    {
      timestamp: '2025-11-05 12:58:20',
      user: 'Service Center 24/7',
      userId: 'SVC-001',
      role: 'Service Center',
      action: 'Emergency Override Approved',
      module: 'Service Center Dashboard',
      status: 'SUCCESS',
      ipAddress: '192.168.1.130'
    },
    {
      timestamp: '2025-11-05 12:40:35',
      user: 'John Adebayo',
      userId: 'USR-001',
      role: 'Admin',
      action: 'Report Generated',
      module: 'Reports',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100'
    },
    {
      timestamp: '2025-11-05 12:25:10',
      user: 'Aisha Mohammed',
      userId: 'USR-020',
      role: 'Depot Manager',
      action: 'Tanker Assignment Modified',
      module: 'Tanker Management',
      status: 'SUCCESS',
      ipAddress: '192.168.1.108'
    },
    {
      timestamp: '2025-11-05 12:05:45',
      user: 'John Adebayo',
      userId: 'USR-001',
      role: 'Admin',
      action: 'User Role Changed',
      module: 'User Management',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100'
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full"><FaCheckCircle className="w-3 h-3" /> SUCCESS</span>
      case 'WARNING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full"><FaExclamationTriangle className="w-3 h-3" /> WARNING</span>
      case 'FAILURE':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full"><FaTimesCircle className="w-3 h-3" /> FAILURE</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full">{status}</span>
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-500">Comprehensive system activity monitoring and audit tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaSync className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600">
            <FaDownload className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Events" 
          value="12" 
          icon={<FaChartLine className="w-6 h-6 text-white" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Successful" 
          value="9" 
          icon={<FaCheckCircle className="w-6 h-6 text-white" />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Warnings" 
          value="2" 
          icon={<FaExclamationTriangle className="w-6 h-6 text-white" />} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Failed" 
          value="1" 
          icon={<FaTimesCircle className="w-6 h-6 text-white" />} 
          color="bg-red-500" 
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters & Search</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Modules</option>
              <option>User Management</option>
              <option>Way Bill Management</option>
              <option>Device Management</option>
              <option>Quality Assurance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Actions</option>
              <option>User Created</option>
              <option>Way Bill Approved</option>
              <option>Device Deactivated</option>
              <option>Lock Override</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>SUCCESS</option>
              <option>WARNING</option>
              <option>FAILURE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FaClock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Audit Trail (12 entries)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-3 h-3 text-gray-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{log.user}</p>
                      <p className="text-gray-500">{log.userId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <span className="px-2 py-1 text-xs text-gray-700 border border-gray-200 rounded-md">{log.role}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">{log.action}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <span className="px-2 py-1 text-xs text-gray-700 border border-gray-200 rounded-md">{log.module}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EventAndAuditLogs