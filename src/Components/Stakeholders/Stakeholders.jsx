import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaUserTie, FaUserCog, FaTruck, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPlus, FaChevronDown, FaBuilding, FaStore, FaUsers, FaDownload, FaUpload } from 'react-icons/fa'
import CreateDepot from './CreateDepot'
import CreateStation from './CreateStation'
import CreateDriver from './CreateDriver'
import CreateUser from './CreateUser'
import AssignUser from './AssignUser'
import Assignwithapi from './Assignwithapi'

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <FaUser className="text-white" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function UserRow({ user, userType, onViewClick, onAssignClick }) {
  const getIcon = () => {
    switch (userType) {
      case 'admins': return <FaUserCog className="text-red-600" />
      case 'depot_managers': return <FaUserTie className="text-blue-600" />
      case 'station_managers': return <FaUser className="text-green-600" />
      case 'drivers': return <FaTruck className="text-orange-600" />
      default: return <FaUser className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200'
      case 'Inactive': return 'bg-red-50 text-red-700 border-red-200'
      case 'Suspended': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white border-b border-gray-100 p-3 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <div className={`flex-1 grid grid-cols-1 gap-3 min-w-0 ${userType === 'drivers' ? 'md:grid-cols-4' : userType === 'all_users' ? 'md:grid-cols-5' : 'md:grid-cols-5'}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.id}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-800 truncate">{user.email}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-800 truncate">{user.phone}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-800 truncate">{user.location}</p>
            </div>
            {userType === 'all_users' ? (
              <div className="min-w-0">
                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${
                  user.assignmentStatus === 'Assigned' 
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {user.assignmentStatus}
                </span>
                <p className="text-xs text-gray-500 mt-1 truncate">{user.userType}</p>
              </div>
            ) : userType !== 'drivers' && (
              <div className="min-w-0">
                <p className="text-xs text-gray-800 truncate">{user.role}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
          <button 
            onClick={() => onViewClick && onViewClick(user)}
            className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            View
          </button>
          {userType === 'all_users' && user.assignmentStatus === 'Unassigned' ? (
            <button 
              onClick={() => onAssignClick && onAssignClick(user)}
              className="px-2 py-1 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white"
            >
              Assign
            </button>
          ) : (
            <button className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Stakeholders() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('admins')
  const [search, setSearch] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [showCreateDepot, setShowCreateDepot] = useState(false)
  const [showCreateStation, setShowCreateStation] = useState(false)
  const [showCreateDriver, setShowCreateDriver] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showUserAssignModal, setShowUserAssignModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  // const [depots, setDepots] = useState([])
  // const [stations, setStations] = useState([])
  // const [depotsLoading, setDepotsLoading] = useState(true)
  // const [stationsLoading, setStationsLoading] = useState(true)
  // const [apiUsers, setApiUsers] = useState([])
  // const [usersLoading, setUsersLoading] = useState(true)
  // const [showApiAssignModal, setShowApiAssignModal] = useState(false)
  const [useMockData] = useState(true)

  // Fetch depots, stations, and users
  // React.useEffect(() => {
  //   const fetchDepots = async () => {
  //     try {
  //       const token = localStorage.getItem('auth_token')
  //       const res = await fetch('https://api.pqacms.tfnsolutions.us/api/depots', {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       if (res.ok) {
  //         const data = await res.json()
  //         setDepots(data.data || [])
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch depots:', err)
  //     } finally {
  //       setDepotsLoading(false)
  //     }
  //   }

  //   const fetchStations = async () => {
  //     try {
  //       const token = localStorage.getItem('auth_token')
  //       const res = await fetch('https://api.pqacms.tfnsolutions.us/api/stations', {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       if (res.ok) {
  //         const data = await res.json()
  //         setStations(data.data || [])
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch stations:', err)
  //     } finally {
  //       setStationsLoading(false)
  //     }
  //   }

  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem('auth_token')
  //       const res = await fetch('https://api.pqacms.tfnsolutions.us/api/users/role/all', {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       if (res.status === 401) {
  //         localStorage.removeItem('auth_token')
  //         localStorage.removeItem('user_role')
  //         localStorage.removeItem('user_name')
  //         window.location.assign('/')
  //         return
  //       }
  //       if (res.ok) {
  //         const data = await res.json()
  //         setApiUsers(Array.isArray(data) ? data : [])
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch users:', err)
  //     } finally {
  //       setUsersLoading(false)
  //     }
  //   }

  //   fetchDepots()
  //   fetchStations()
  //   fetchUsers()
  // }, [])

  const handleViewUser = (user) => {
    if (activeTab === 'depot_managers' || activeTab === 'station_managers' || activeTab === 'drivers') {
      navigate(`/stakeholder-details/${user.id}`, { state: { user, userType: activeTab } })
    }
  }

  const handleAssignUser = (user) => {
    setSelectedUser(user)
    setShowUserAssignModal(true)
  }

  // const handleApiAssignUser = (user) => {
  //   setSelectedUser(user)
  //   setShowApiAssignModal(true)
  // }

  // const handleAssignSuccess = () => {
  //   // Refresh users list
  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem('auth_token')
  //       const res = await fetch('https://api.pqacms.tfnsolutions.us/api/users/role/all', {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       if (res.ok) {
  //         const data = await res.json()
  //         setApiUsers(Array.isArray(data) ? data : [])
  //       }
  //     } catch (err) {
  //       console.error('Failed to refresh users:', err)
  //     }
  //   }
  //   fetchUsers()
  // }

  const handleCreateUser = (userData) => {
    console.log('Creating user:', userData)
    // Here you would typically make an API call to create the user
  }

  const userData = {
    admins: [
      {
        id: 'ADM-001',
        name: 'John Administrator',
        email: 'john.admin@pqacms.com',
        phone: '+234 800 000 0001',
        location: 'Lagos, Nigeria',
        status: 'Active',
        joined: '2024-01-15',
        role: 'System Administrator'
      },
      {
        id: 'ADM-002',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@pqacms.com',
        phone: '+234 800 000 0002',
        location: 'Abuja, Nigeria',
        status: 'Active',
        joined: '2024-02-20',
        role: 'Super Administrator'
      }
    ],
    depot_managers: [
      {
        id: 'DPM-001',
        name: 'Michael Johnson',
        email: 'michael.johnson@depot.com',
        phone: '+234 800 000 0101',
        location: 'Port Harcourt Depot',
        status: 'Active',
        joined: '2024-03-10',
        role: 'Depot Operations Manager'
      },
      {
        id: 'DPM-002',
        name: 'Emma Davis',
        email: 'emma.davis@depot.com',
        phone: '+234 800 000 0102',
        location: 'Warri Depot',
        status: 'Active',
        joined: '2024-01-25',
        role: 'Depot Quality Manager'
      },
      {
        id: 'DPM-003',
        name: 'David Brown',
        email: 'david.brown@depot.com',
        phone: '+234 800 000 0103',
        location: 'Kaduna Depot',
        status: 'Suspended',
        joined: '2023-11-15',
        role: 'Depot Fleet Manager'
      }
    ],
    station_managers: [
      {
        id: 'STM-001',
        name: 'Lisa Thompson',
        email: 'lisa.thompson@station.com',
        phone: '+234 800 000 0201',
        location: 'Victoria Island Station',
        status: 'Active',
        joined: '2024-04-05',
        role: 'Station Operations Manager'
      },
      {
        id: 'STM-002',
        name: 'Robert Garcia',
        email: 'robert.garcia@station.com',
        phone: '+234 800 000 0202',
        location: 'Ikeja Station',
        status: 'Active',
        joined: '2024-02-14',
        role: 'Station Supervisor'
      },
      {
        id: 'STM-003',
        name: 'Jennifer Lee',
        email: 'jennifer.lee@station.com',
        phone: '+234 800 000 0203',
        location: 'Lekki Station',
        status: 'Inactive',
        joined: '2023-12-08',
        role: 'Station Quality Controller'
      }
    ],
    drivers: [
      {
        id: 'DRV-001',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@driver.com',
        phone: '+234 800 000 0301',
        location: 'Lagos Zone',
        status: 'Active',
        joined: '2024-05-12',
        role: 'Senior Driver - TRK-2045'
      },
      {
        id: 'DRV-002',
        name: 'Chidi Okafor',
        email: 'chidi.okafor@driver.com',
        phone: '+234 800 000 0302',
        location: 'Abuja Zone',
        status: 'Active',
        joined: '2024-03-28',
        role: 'Driver - TRK-3012'
      },
      {
        id: 'DRV-003',
        name: 'Fatima Abubakar',
        email: 'fatima.abubakar@driver.com',
        phone: '+234 800 000 0303',
        location: 'Kano Zone',
        status: 'Active',
        joined: '2024-04-18',
        role: 'Driver - TRK-4567'
      },
      {
        id: 'DRV-004',
        name: 'Emeka Nwankwo',
        email: 'emeka.nwankwo@driver.com',
        phone: '+234 800 000 0304',
        location: 'Port Harcourt Zone',
        status: 'Suspended',
        joined: '2024-01-30',
        role: 'Driver - TRK-7890'
      }
    ]
  }

  const allUsers = [
    ...userData.admins.map(user => ({ ...user, assignmentStatus: 'Assigned', userType: 'Admin' })),
    ...userData.depot_managers.map(user => ({ ...user, assignmentStatus: 'Assigned', userType: 'Depot Manager' })),
    ...userData.station_managers.map(user => ({ ...user, assignmentStatus: 'Assigned', userType: 'Station Manager' })),
    ...userData.drivers.map(user => ({ ...user, assignmentStatus: 'Assigned', userType: 'Driver' })),
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+234 800 000 0401',
      location: 'Lagos, Nigeria',
      status: 'Active',
      joined: '2024-01-20',
      assignmentStatus: 'Unassigned',
      userType: 'None'
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+234 800 000 0402',
      location: 'Abuja, Nigeria',
      status: 'Active',
      joined: '2024-01-22',
      assignmentStatus: 'Unassigned',
      userType: 'None'
    }
  ]

  const tabs = [
    { id: 'admins', label: 'Admins', icon: FaUserCog, count: userData.admins.length },
    { id: 'depot_managers', label: 'Depot Managers', icon: FaUserTie, count: userData.depot_managers.length },
    { id: 'station_managers', label: 'Station Managers', icon: FaUser, count: userData.station_managers.length },
    { id: 'drivers', label: 'Drivers', icon: FaTruck, count: userData.drivers.length },
    { id: 'all_users', label: 'All Users', icon: FaUsers, count: allUsers.length }
  ]

  const filteredUsers = (activeTab === 'all_users' ? allUsers : userData[activeTab])
    .filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (activeTab === 'all_users') {
        // Sort unassigned users to the top
        if (a.assignmentStatus === 'Unassigned' && b.assignmentStatus !== 'Unassigned') return -1
        if (a.assignmentStatus !== 'Unassigned' && b.assignmentStatus === 'Unassigned') return 1
      }
      return 0
    })

  const getTotalUsers = () => {
    return Object.values(userData).reduce((total, users) => total + users.length, 0)
  }

  const getActiveUsers = () => {
    return Object.values(userData).reduce((total, users) => 
      total + users.filter(user => user.status === 'Active').length, 0
    )
  }

  const getAvailableDepots = () => {
    // Extract depots from StakeholderDetails data structure
    const allDepots = [
      { id: 'DEP-001', name: 'Port Harcourt Main Depot', hasManager: true, manager: 'Michael Johnson' },
      { id: 'DEP-002', name: 'Port Harcourt East Depot', hasManager: false, manager: null },
      { id: 'DEP-003', name: 'Warri Central Depot', hasManager: true, manager: 'Emma Davis' },
      { id: 'DEP-004', name: 'Kaduna North Depot', hasManager: true, manager: 'David Brown' },
      { id: 'DEP-005', name: 'Lagos East Depot', hasManager: false, manager: null },
      { id: 'DEP-006', name: 'Abuja North Depot', hasManager: false, manager: null }
    ]
    return allDepots
  }

  const getAvailableStations = () => {
    // Extract stations from StakeholderDetails data structure
    const allStations = [
      { id: 'STA-001', name: 'GRA Station', depot: 'DEP-001', hasManager: true, manager: 'Lisa Thompson' },
      { id: 'STA-002', name: 'Mile 1 Station', depot: 'DEP-001', hasManager: true, manager: 'Robert Garcia' },
      { id: 'STA-003', name: 'Trans Amadi Station', depot: 'DEP-001', hasManager: true, manager: 'Jennifer Lee' },
      { id: 'STA-004', name: 'Eleme Station', depot: 'DEP-002', hasManager: false, manager: null },
      { id: 'STA-005', name: 'Onne Station', depot: 'DEP-002', hasManager: false, manager: null },
      { id: 'STA-006', name: 'Warri Main Station', depot: 'DEP-003', hasManager: false, manager: null },
      { id: 'STA-007', name: 'Effurun Station', depot: 'DEP-003', hasManager: false, manager: null },
      { id: 'STA-008', name: 'Kaduna Central Station', depot: 'DEP-004', hasManager: false, manager: null },
      { id: 'STA-009', name: 'Victoria Island Station', depot: 'DEP-005', hasManager: false, manager: null },
      { id: 'STA-010', name: 'Lekki Station', depot: 'DEP-005', hasManager: false, manager: null }
    ]
    return allStations
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stakeholders Management</h1>
          <p className="text-sm text-gray-500">Manage system users and their access permissions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Import Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaUpload size={14} />
            Import
          </button>
          
          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaDownload size={14} />
            Export
          </button>
          
          {/* Create User Button */}
          <button
            onClick={() => setShowCreateUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FaUsers size={14} />
            Create User
          </button>
        </div>
      </div>

      {useMockData && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Users" value={getTotalUsers()} subtitle="All stakeholders" color="bg-gray-800" />
            <StatCard title="Active Users" value={getActiveUsers()} subtitle="Currently active" color="bg-green-500" />
            <StatCard title="Admins" value={userData.admins.length} subtitle="System administrators" color="bg-red-500" />
            <StatCard title="Drivers" value={userData.drivers.length} subtitle="Fleet drivers" color="bg-orange-500" />
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* User list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-50 border-b border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <div className="w-6"></div>
                <div className={`flex-1 grid grid-cols-1 gap-3 ${activeTab === 'drivers' ? 'md:grid-cols-4' : 'md:grid-cols-5'}`}>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</div>
                  {activeTab === 'all_users' ? (
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assignment</div>
                  ) : activeTab !== 'drivers' && (
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</div>
                  )}
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</div>
              </div>
            </div>
            
            {/* User rows */}
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-600 text-sm py-8">
                No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} userType={activeTab} onViewClick={handleViewUser} onAssignClick={handleAssignUser} />
              ))
            )}
          </div>
        </>
      )}
      
      {/* Modals */}
      {showCreateDepot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Depot</h2>
              <button onClick={() => setShowCreateDepot(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CreateDepot onClose={() => setShowCreateDepot(false)} />
          </div>
        </div>
      )}
      
      {showCreateStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Station</h2>
              <button onClick={() => setShowCreateStation(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CreateStation onClose={() => setShowCreateStation(false)} />
          </div>
        </div>
      )}
      
      {showCreateDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Driver</h2>
              <button onClick={() => setShowCreateDriver(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CreateDriver onClose={() => setShowCreateDriver(false)} />
          </div>
        </div>
      )}
      
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create User</h2>
              <button onClick={() => setShowCreateUser(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CreateUser onClose={() => setShowCreateUser(false)} onSubmit={handleCreateUser} />
          </div>
        </div>
      )}
      
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Assign Users</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <AssignUser />
          </div>
        </div>
      )}
      
      {showUserAssignModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assign Role to {selectedUser.name}</h2>
              <button onClick={() => setShowUserAssignModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AssignUser selectedUser={selectedUser} availableDepots={getAvailableDepots()} availableStations={getAvailableStations()} onClose={() => setShowUserAssignModal(false)} />
            </div>
          </div>
        </div>
      )}
      
      {/* {showApiAssignModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assign Role</h2>
              <button onClick={() => setShowApiAssignModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="p-6">
              <Assignwithapi 
                user={selectedUser} 
                onClose={() => setShowApiAssignModal(false)} 
                onSuccess={handleAssignSuccess}
              />
            </div>
          </div>
        </div>
      )} */}

      {/* All Users - Commented out API integration */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="bg-gray-50 border-b border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaUsers className="text-purple-600" />
            All Users ({useMockData ? allUsers.length : apiUsers.length})
          </h3>
          <p className="text-sm text-gray-600">
            {useMockData ? 'Mock data users' : 'Users from API with role assignment'}
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!useMockData && usersLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading users...</div>
          ) : (useMockData ? allUsers : apiUsers).length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No users found</div>
          ) : (
            (useMockData ? allUsers : apiUsers).map((user) => (
              <div key={user.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-1 text-gray-900">{user.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Role:</span>
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                          (useMockData ? user.assignmentStatus === 'Assigned' : user.role)
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {useMockData 
                            ? (user.assignmentStatus === 'Assigned' ? user.userType : 'Unassigned')
                            : (user.role || 'Unassigned')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {useMockData ? (
                      user.assignmentStatus === 'Unassigned' ? (
                        <button
                          onClick={() => handleAssignUser(user)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Assign
                        </button>
                      ) : (
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Assigned
                        </span>
                      )
                    ) : (
                      !user.role ? (
                        <button
                          onClick={() => handleApiAssignUser(user)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Assign
                        </button>
                      ) : (
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Assigned
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div> */}

      {/* Depots & Stations Section - Commented out API integration */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FaBuilding className="text-blue-600" />
                Depots ({depots.length})
              </h3>
              <button
                onClick={() => setShowCreateDepot(true)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Depot
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {depotsLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading depots...</div>
            ) : depots.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No depots found</div>
            ) : (
              depots.map((depot) => (
                <div key={depot.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{depot.name}</p>
                      <p className="text-xs text-gray-500">{depot.code} • {depot.location}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FaStore className="text-green-600" />
                Stations ({stations.length})
              </h3>
              <button
                onClick={() => setShowCreateStation(true)}
                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Station
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {stationsLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading stations...</div>
            ) : stations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No stations found</div>
            ) : (
              stations.map((station) => (
                <div key={station.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{station.name}</p>
                      <p className="text-xs text-gray-500">{station.code} • {station.location}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}

      

    </div>
  )
}