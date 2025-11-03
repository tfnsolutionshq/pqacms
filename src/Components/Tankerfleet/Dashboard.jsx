import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Fuel,
  Gauge,
  Headset,
  Lock,
  MapPin,
  Navigation2,
  NotebookText,
  PlayCircle,
  Smartphone,
  User,
  Truck,
  Unlock
} from 'lucide-react'

const depotStatsCards = [
  {
    label: 'Loading Operations',
    value: '12',
    delta: '+4 today',
    icon: <PlayCircle className="w-4 h-4 text-yellow-600" />
  },
  {
    label: 'Fleet Active',
    value: '18',
    delta: '24 total',
    icon: <Truck className="w-4 h-4 text-green-600" />
  },
  {
    label: 'Lock Commands',
    value: '27',
    delta: '+5 today',
    icon: <Lock className="w-4 h-4 text-purple-600" />
  },
  {
    label: 'Fuel Loaded',
    value: '145K',
    delta: 'Liters today',
    icon: <Fuel className="w-4 h-4 text-orange-600" />
  }
]

const depotLoadingQueue = [
  {
    id: 'TRK-2045',
    driver: 'John Adeyemi',
    fuelType: 'PMS',
    quantity: '33,000L',
    progress: 65,
    status: 'Loading',
    eta: 'Est. completion: 8 mins'
  },
  {
    id: 'TRK-3012',
    driver: 'Sarah Ibrahim',
    fuelType: 'AGO',
    quantity: '33,000L',
    progress: 0,
    status: 'Queued'
  },
  {
    id: 'TRK-1874',
    driver: 'Michael Okafor',
    fuelType: 'DPK',
    quantity: '30,000L',
    progress: 0,
    status: 'Queued'
  }
]

const depotFleetSummary = [
  {
    label: 'Loading',
    value: 3,
    color: 'bg-blue-500'
  },
  {
    label: 'En Route',
    value: 12,
    color: 'bg-green-500'
  },
  {
    label: 'Idle',
    value: 6,
    color: 'bg-slate-400'
  },
  {
    label: 'Deactivated',
    value: 3,
    color: 'bg-red-500'
  }
]

const depotLockCommands = [
  {
    tanker: 'TRK-2045',
    action: 'Lock Activated',
    time: '3 mins ago',
    color: 'text-green-600'
  },
  {
    tanker: 'TRK-3012',
    action: 'Lock Armed',
    time: '12 mins ago',
    color: 'text-green-600'
  },
  {
    tanker: 'TRK-4521',
    action: 'Lock Override',
    time: '25 mins ago',
    color: 'text-orange-500'
  },
  {
    tanker: 'TRK-1874',
    action: 'Lock Released',
    time: '45 mins ago',
    color: 'text-gray-500'
  }
]

const driverStatsCards = [
  {
    label: 'Trip Progress',
    value: '65%',
    detail: '158 km remaining',
    iconBg: 'bg-blue-100 text-blue-600',
    icon: <Gauge className="w-4 h-4" />
  },
  {
    label: 'ETA',
    value: '2h 15m',
    detail: '12:45 PM',
    iconBg: 'bg-green-100 text-green-600',
    icon: <Clock className="w-4 h-4" />
  },
  {
    label: 'Lock Status',
    value: 'Locked',
    detail: 'Secure',
    iconBg: 'bg-purple-100 text-purple-600',
    icon: <Lock className="w-4 h-4" />
  },
  {
    label: 'Fuel Load',
    value: '33K',
    detail: 'Liters',
    iconBg: 'bg-orange-100 text-orange-600',
    icon: <Fuel className="w-4 h-4" />
  }
]

const driverTripDetails = {
  tanker: 'TRK-2045',
  tripId: 'TRIP-2401',
  fuelType: 'PMS',
  quantity: '33,000L',
  totalDistance: '450 km',
  remainingDistance: '158 km',
  progress: 65,
  route: 'Lagos Depot — Station A - Port Harcourt'
}

const driverCheckpoints = [
  {
    title: 'Lagos Depot',
    time: '06:30 AM',
    status: 'completed'
  },
  {
    title: 'Ore Checkpoint',
    time: '08:15 AM',
    status: 'completed'
  },
  {
    title: 'Benin Checkpoint',
    time: 'Now',
    status: 'current'
  },
  {
    title: 'Port Harcourt Station',
    time: 'ETA 12:45 PM',
    status: 'upcoming'
  }
]

const driverQuickActions = [
  {
    title: 'Request Unlock',
    description: 'Request unlock code at destination',
    icon: <Unlock className="w-4 h-4" />,
    iconClasses: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'View Load Details',
    description: 'Current fuel load information',
    icon: <NotebookText className="w-4 h-4" />,
    iconClasses: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Report Issue',
    description: 'Report vehicle or route issue',
    icon: <AlertTriangle className="w-4 h-4" />,
    iconClasses: 'bg-red-100 text-red-600'
  },
  {
    title: 'Contact Support',
    description: 'Contact control center',
    icon: <Headset className="w-4 h-4" />,
    iconClasses: 'bg-green-100 text-green-600'
  }
]

const driverRecentTrips = [
  {
    route: 'Lagos → Ibadan',
    fuel: 'AGO - TRIP-2398',
    date: 'Oct 27, 2025'
  },
  {
    route: 'Abuja → Kano',
    fuel: 'PMS - TRIP-2395',
    date: 'Oct 25, 2025'
  },
  {
    route: 'Lagos → Benin',
    fuel: 'DPK - TRIP-2391',
    date: 'Oct 23, 2025'
  }
]

function Dashboard() {
  const [userRole, setUserRole] = useState('depot-manager')

  const renderDepotDashboard = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Depot Operations</h1>
            <p className="text-sm text-slate-500">Loading operations and fleet management</p>
          </div>
          {/* <div className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            Depot Online
          </div> */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setUserRole('depot-manager')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userRole === 'depot-manager'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Depot Manager
            </button>
            <button
              onClick={() => setUserRole('driver')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userRole === 'driver'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-4 w-4" />
              Driver
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md shadow-sm hover:from-green-600 hover:to-green-700 sm:w-auto">
              <BadgeCheck className="w-4 h-4" />
              New Loading
            </button>
            <button className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 sm:w-auto">
              <Truck className="w-4 h-4" />
              View Fleet
            </button>
            <button className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 sm:w-auto">
              <Lock className="w-4 h-4" />
              Lock Control
            </button>
            <div className="flex w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 md:hidden">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
              Depot Online
            </div>
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 sm:w-auto sm:ml-auto">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {depotStatsCards.map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</div>
                <p className="mt-1 text-xs text-slate-500">{item.delta}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Loading Queue</h3>
                <p className="text-sm text-slate-500">Active and pending loading operations</p>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100">Manage</button>
            </div>
            <div className="p-6 space-y-4">
              {depotLoadingQueue.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.id}</div>
                      <p className="text-xs text-slate-500">Driver: {item.driver}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Loading'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.status === 'Loading' ? <ArrowUpRight className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <div>
                      <span className="font-medium text-slate-600">Fuel Type:</span>
                      <span className="ml-2 text-slate-900 font-medium">{item.fuelType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Quantity:</span>
                      <span className="ml-2 text-slate-900 font-medium">{item.quantity}</span>
                    </div>
                  </div>

                  {item.status === 'Loading' ? (
                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-slate-900 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{item.eta}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500">Position in queue: {index + 1}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Fleet Summary</h3>
              <p className="text-sm text-slate-500">Current fleet status</p>
            </div>
            <div className="p-6 space-y-4">
              {depotFleetSummary.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-slate-900 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Lock Commands</h3>
                <p className="text-sm text-slate-500">Recent lock operations</p>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100">Control</button>
            </div>
            <div className="p-6 space-y-4">
              {depotLockCommands.map((item) => (
                <div key={item.tanker} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.tanker}</p>
                    <p className={`text-xs font-medium ${item.color}`}>{item.action}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDriverDashboard = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-3">
            <Smartphone className="w-4 h-4 mt-0.5" />
            <div>
              <span className="font-medium">Mobile Interface Preview.</span> This role typically uses the mobile operations app. You're viewing a web preview for demo purposes.
            </div>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            On Duty
          </span>
        </div> */}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Active Trip</h1>
            <p className="text-sm text-slate-500">{driverTripDetails.route}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setUserRole('depot-manager')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userRole === 'depot-manager'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Depot Manager
            </button>
            <button
              onClick={() => setUserRole('driver')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userRole === 'driver'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-4 w-4" />
              Driver
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {driverStatsCards.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</div>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                {item.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Trip Details</h3>
                <p className="text-sm text-slate-500">Current delivery information</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                <Navigation2 className="w-4 h-4" />
                Navigate
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-2xl bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 p-5 border border-slate-200">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{driverTripDetails.tripId}</p>
                    <h4 className="text-xl font-semibold text-slate-900">{driverTripDetails.tanker}</h4>
                    <p className="text-sm text-slate-500">Fuel Type: <span className="font-medium text-slate-700">{driverTripDetails.fuelType}</span></p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                    <div>
                      <p className="text-slate-500">Quantity</p>
                      <p className="font-semibold text-slate-900">{driverTripDetails.quantity}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total Distance</p>
                      <p className="font-semibold text-slate-900">{driverTripDetails.totalDistance}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Remaining</p>
                      <p className="font-semibold text-slate-900">{driverTripDetails.remainingDistance}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Lock Status</p>
                      <p className="font-semibold text-slate-900">Locked</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>Trip Progress</span>
                    <span>{driverTripDetails.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${driverTripDetails.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Route Checkpoints</h4>
                <div className="space-y-3">
                  {driverCheckpoints.map((checkpoint) => {
                    const isCompleted = checkpoint.status === 'completed'
                    const isCurrent = checkpoint.status === 'current'
                    return (
                      <div
                        key={checkpoint.title}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
                          isCurrent
                            ? 'border-slate-300 bg-slate-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                              isCompleted
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                : isCurrent
                                ? 'border-slate-400 bg-slate-200 text-slate-700'
                                : 'border-slate-200 bg-white text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : isCurrent ? (
                              <MapPin className="w-3 h-3" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            )}
                          </span>
                          <div>
                            <p className="font-medium text-slate-800">{checkpoint.title}</p>
                            <p className="text-xs text-slate-500">{checkpoint.time}</p>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">Current</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-500">Common operations</p>
            </div>
            <div className="grid grid-cols-1 gap-3 p-6">
              {driverQuickActions.map((action) => (
                <button
                  key={action.title}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-sm"
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${action.iconClasses}`}>
                    {action.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Recent Trips</h3>
              <p className="text-sm text-slate-500">Your completed deliveries</p>
            </div>
            <div className="space-y-4 p-6">
              {driverRecentTrips.map((trip) => (
                <div key={trip.route} className="flex items-start justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{trip.route}</p>
                    <p className="text-xs text-slate-500">{trip.fuel}</p>
                  </div>
                  <span className="text-xs text-slate-500">{trip.date}</span>
                </div>
              ))}
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                View All My Trips
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center" />

        {userRole === 'depot-manager' ? renderDepotDashboard() : renderDriverDashboard()}
      </div>
    </div>
  )
}

export default Dashboard
