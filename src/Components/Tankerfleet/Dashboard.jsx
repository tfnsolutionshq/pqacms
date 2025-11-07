import React from 'react'
import { FaTruck, FaMapMarkerAlt, FaExclamationTriangle, FaWifi } from 'react-icons/fa'

const activeDeliveries = [
  {
    id: 'TRK-2045',
    driver: 'John Adeyemi',
    route: 'Lagos → Port Harcourt',
    progress: 65,
    eta: '2h 15m',
    status: 'LOCKED'
  },
  {
    id: 'TRK-3012',
    driver: 'Sarah Ibrahim',
    route: 'Abuja → Kano',
    progress: 42,
    eta: '3h 45m',
    status: 'LOCKED'
  },
  {
    id: 'TRK-1874',
    driver: 'Michael Okafor',
    route: 'Benin → Warri',
    progress: 88,
    eta: '45m',
    status: 'LOCKED'
  }
]

const recentActivity = [
  {
    id: 'TRK-2045',
    location: 'Station A, Lagos',
    time: '5 mins ago',
    type: 'arrival'
  },
  {
    id: 'TRK-3012',
    event: 'Route Deviation Detected',
    time: '12 mins ago',
    type: 'alert'
  },
  {
    id: 'TRK-1874',
    location: 'Depot B, Abuja',
    time: '23 mins ago',
    type: 'departure'
  },
  {
    id: 'TRK-4521',
    event: 'Last seen: Onitsha',
    time: '1 hour ago',
    type: 'offline'
  }
]

const dashboardStats = [
  {
    label: 'Registered Tankers',
    value: '24',
    change: '+2% this month from last hour',
    icon: FaTruck,
    iconBg: 'bg-blue-500'
  },
  {
    label: 'Active In Transit',
    value: '18',
    change: 'Real-time tracking from last hour',
    icon: FaMapMarkerAlt,
    iconBg: 'bg-green-500'
  },
  {
    label: 'Active Alerts',
    value: '3',
    change: 'Critical incidents from last hour',
    icon: FaExclamationTriangle,
    iconBg: 'bg-red-500'
  },
  {
    label: 'Offline Devices',
    value: '1',
    change: 'stable from last hour',
    icon: FaWifi,
    iconBg: 'bg-orange-500'
  }
]

function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Full system administration and control center</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            System Online
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Deliveries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Active Deliveries</h3>
                  <p className="text-sm text-gray-500">Tankers currently en route</p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Map
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {delivery.driver.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{delivery.id}</p>
                        <p className="text-xs text-gray-500">Driver: {delivery.driver}</p>
                      </div>
                    </div>
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                      {delivery.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <FaMapMarkerAlt className="w-3 h-3" />
                    <span>{delivery.route}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{delivery.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full" 
                        style={{ width: `${delivery.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>⏱</span>
                      <span>ETA: {delivery.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Live system events</p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentActivity.map((activity, index) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case 'arrival':
                      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    case 'alert':
                      return <FaExclamationTriangle className="w-3 h-3 text-orange-500" />
                    case 'departure':
                      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    case 'offline':
                      return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    default:
                      return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  }
                }

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1.5">{getIcon()}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{activity.id}</p>
                      <p className="text-sm text-gray-600">
                        {activity.location || activity.event}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Dashboard
