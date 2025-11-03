"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Lock, Unlock, MoreVertical, Eye, Trash2, Edit2, Users, Navigation, X } from "lucide-react"
import truckBlue from "../../assets/truck-blue.svg"
import truckOrange from "../../assets/truck-orange.svg"
import truckPurple from "../../assets/truck-purple.svg"

const TankerFleetDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || "depot_manager") // "depot_manager" or "driver"
  const [currentDriverId] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      return u?.name || u?.id || 'John Doe'
    } catch (_) {
      return 'John Doe'
    }
  })
  const [tankers, setTankers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'))

  // Role verification via API removed per request; rely on localStorage and UI toggle

  useEffect(() => {
    // Load tankers for depot managers
    const fetchTankers = async () => {
      setError("")
      setLoading(true)
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/tankers', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          let msg = 'Failed to load tankers.'
          try {
            const data = await res.json()
            if (data?.message) msg = data.message
          } catch (_) {}
          throw new Error(msg)
        }
        const list = await res.json()
        // Map API data to UI structure
        const images = [truckBlue, truckOrange, truckPurple]
        const mapped = (Array.isArray(list) ? list : []).map((item, idx) => ({
          id: item?.tanker_number || item?.id || `TRK-${idx + 1}`,
          rawId: item?.id || null,
          plate: item?.tanker_number || '—',
          status: (item?.status || 'locked').toLowerCase() === 'locked' ? 'Locked' : 'Unlocked',
          truckImage: images[idx % images.length],
          tabs: ["Overview", "Device", "History"],
          defaultTab: "Overview",
          deviceId: item?.device_id || '—',
          lastSync: '—',
          testConnection: true,
          driver: item?.driver?.name || 'Unassigned',
          owner: item?.owner?.name || item?.fleet_name || '—',
          contact: item?.contact || '—',
          totalTrips: item?.total_trips ?? 0,
          historyTrips: [],
        }))
        setTankers(mapped)
        // Persist simple tanker options for use in other views (e.g., LoadingControl dropdown)
        try {
          const simple = mapped
            .filter(t => !!t.rawId)
            .map(t => ({ id: t.rawId, tanker_number: t.plate }))
          localStorage.setItem('tankers_simple', JSON.stringify(simple))
        } catch (_) {}
      } catch (err) {
        setError(err.message || 'Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (userRole === 'depot_manager' && isLoggedIn) {
      fetchTankers()
    } else if (userRole === 'depot_manager' && !isLoggedIn) {
      setError('Please log in to view tankers.')
    }
  }, [userRole, isLoggedIn])

  // Ensure driver has at least one dummy tanker
  useEffect(() => {
    if (userRole === 'driver') {
      setTankers((prev) => {
        const hasMine = prev.some((t) => t.driver === currentDriverId)
        if (hasMine) return prev
        const dummy = {
          id: 'TRK-DR-001',
          plate: 'DR-001',
          status: 'Locked',
          truckImage: truckBlue,
          tabs: ["Overview", "Device", "History"],
          defaultTab: "Overview",
          deviceId: 'DEV-DR-001',
          lastSync: '—',
          testConnection: true,
          driver: currentDriverId,
          owner: 'My Fleet',
          contact: '+000 000 0000',
          totalTrips: 5,
          historyTrips: [
            { name: 'City Delivery', date: '2025-01-02', status: 'Completed' },
            { name: 'Depot Transfer', date: '2025-01-01', status: 'Completed' },
          ],
        }
        return [dummy, ...prev]
      })
    }
  }, [userRole, currentDriverId])

  const [activeTab, setActiveTab] = useState({})
  const [expandedCard, setExpandedCard] = useState(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  // Register modal form state
  const [regTankerNumber, setRegTankerNumber] = useState("")
  const [regDeviceId, setRegDeviceId] = useState("")
  const [regDriverId, setRegDriverId] = useState("")
  const [regOwnerId, setRegOwnerId] = useState("")
  const [regFleetName, setRegFleetName] = useState("TurboFlux Fleet")
  const [regContact, setRegContact] = useState("")
  const [regTotalTrips, setRegTotalTrips] = useState(0)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState("")

  const handleTabChange = (tankerId, tab) => {
    setActiveTab((prev) => ({ ...prev, [tankerId]: tab }))
  }

  const toggleCardExpand = (tankerId) => {
    setExpandedCard(expandedCard === tankerId ? null : tankerId)
  }

  const handleOpenRegisterModal = () => {
    setRegisterError("")
    setRegisterSuccess("")
    setShowRegisterModal(true)
  }

  const handleRegisterTanker = async () => {
    setRegisterError("")
    setRegisterSuccess("")
    setRegisterLoading(true)
    try {
      if (!isLoggedIn) throw new Error('You must be logged in to register a tanker.')
      const token = localStorage.getItem('auth_token')

      const payload = {
        tanker_number: regTankerNumber || undefined,
        device_id: regDeviceId || undefined,
        driver_id: regDriverId || undefined,
        owner_id: regOwnerId || undefined,
        status: 'locked',
        fleet_name: regFleetName || undefined,
        contact: regContact || undefined,
        total_trips: Number(regTotalTrips) || 0,
      }

      const res = await fetch('http://api.pqacms.tfnsolutions.us/api/tankers', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let msg = 'Failed to register tanker.'
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch (_) {}
        throw new Error(msg)
      }

      const created = await res.json()
      setRegisterSuccess('Tanker registered successfully.')
      // Optimistically add to list
      const images = [truckBlue, truckOrange, truckPurple]
      setTankers(prev => [
        {
          id: created?.tanker_number || created?.id || regTankerNumber || `TRK-${prev.length + 1}`,
          plate: created?.tanker_number || regTankerNumber || '—',
          status: (created?.status || 'locked').toLowerCase() === 'locked' ? 'Locked' : 'Unlocked',
          truckImage: images[(prev.length) % images.length],
          tabs: ["Overview", "Device", "History"],
          defaultTab: "Overview",
          deviceId: created?.device_id || regDeviceId || '—',
          lastSync: '—',
          testConnection: true,
          driver: created?.driver?.name || 'Unassigned',
          owner: created?.owner?.name || created?.fleet_name || regFleetName || '—',
          contact: created?.contact || regContact || '—',
          totalTrips: created?.total_trips ?? Number(regTotalTrips) ?? 0,
          historyTrips: [],
        },
        ...prev,
      ])

      // Reset and close modal after short delay
      setTimeout(() => {
        setShowRegisterModal(false)
        setRegTankerNumber("")
        setRegDeviceId("")
        setRegDriverId("")
        setRegOwnerId("")
        setRegFleetName("TurboFlux Fleet")
        setRegContact("")
        setRegTotalTrips(0)
        setRegisterSuccess("")
      }, 800)
    } catch (err) {
      setRegisterError(err.message || 'Unexpected error occurred')
    } finally {
      setRegisterLoading(false)
    }
  }

  // Filter tankers based on role
  const getFilteredTankersByRole = () => {
    if (userRole === "driver") {
      // Driver can only see their assigned tanker
      return tankers.filter(tanker => tanker.driver === currentDriverId)
    }
    // Depot manager can see all tankers
    return tankers
  }

  const filteredTankers = getFilteredTankersByRole().filter(
    (tanker) =>
      tanker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tanker.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tanker.driver.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 mb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {userRole === "driver" ? "My Tanker Details" : "Tanker Fleet Management"}
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              {userRole === "driver" 
                ? "View your assigned tanker and device information" 
                : "Register and manage tanker vehicles and smart lock devices"
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Role Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUserRole('depot_manager')
                  try { localStorage.setItem('user_role', 'depot_manager') } catch (_) {}
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  userRole === 'depot_manager' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Depot Manager
              </button>
              <button
                onClick={() => {
                  setUserRole('driver')
                  try { localStorage.setItem('user_role', 'driver') } catch (_) {}
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  userRole === 'driver' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Driver
              </button>
            </div>
            
            {/* Register Button - Only for Depot Manager */}
            {userRole === "depot_manager" && (
              <button 
                onClick={handleOpenRegisterModal}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all w-full md:w-auto justify-center md:justify-start"
              >
                <Plus size={16} />
                Register New Tanker
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={userRole === "driver" 
              ? "Search by plate number, driver, or device ID..." 
              : "Search by plate number, driver, or device ID..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-slate-600 text-sm mb-4">Loading tankers...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-sm mb-4">{error}</div>
      )}

      {/* Restricted notice removed; driver sees only their trucks via filtering */}

      {/* Tanker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredTankers.length === 0 && !loading && !error && (
          <div className="text-slate-600 text-sm">{userRole === 'depot_manager' ? 'No tankers found.' : 'Driver view: no tanker data available yet.'}</div>
        )}
        {filteredTankers.map((tanker) => (
          <div
            key={tanker.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Card Header */}
            <div className="p-4 md:p-6 border-b border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={tanker.truckImage} 
                      alt={`${tanker.id} truck`}
                      className="w-10 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{tanker.id}</h3>
                    <p className="text-sm text-slate-600">{tanker.plate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      tanker.status === "Locked" ? "bg-slate-900 text-white" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tanker.status === "Locked" ? <Lock size={14} /> : <Unlock size={14} />}
                    {tanker.status}
                  </span>
                  {userRole === "depot_manager" ? (
                    <>
                      <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-slate-600" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-slate-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="px- pb-4">
                <div className="bg-slate-50 rounded-lg p-1 flex w-full">
                  {tanker.tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tanker.id, tab)}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        (activeTab[tanker.id] || tanker.defaultTab) === tab
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-6">
              {(activeTab[tanker.id] || tanker.defaultTab) === "Overview" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Driver:</span>
                    <span className="font-medium text-slate-900">{tanker.driver}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Owner:</span>
                    <span className="font-medium text-slate-900">{tanker.owner}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Contact:</span>
                    <span className="font-medium text-slate-900">{tanker.contact}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Total Trips:</span>
                    <span className="font-medium text-slate-900">{tanker.totalTrips}</span>
                  </div>
                </div>
              )}

              {(activeTab[tanker.id] || tanker.defaultTab) === "Device" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Device ID:</span>
                    <span className="font-medium text-slate-900">{tanker.deviceId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Status:</span>
                    <span className="px-2 py-1 bg-slate-900 text-white text-xs rounded font-medium">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Last Sync:</span>
                    <span className="font-medium text-slate-900">{tanker.lastSync}</span>
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors">
                    {userRole === "driver" ? "View Connection Status" : "Test Connection"}
                  </button>
                </div>
              )}

              {(activeTab[tanker.id] || tanker.defaultTab) === "History" && (
                <div className="space-y-3">
                  {tanker.historyTrips && tanker.historyTrips.length > 0 ? (
                    <>
                      {tanker.historyTrips.map((trip, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 bg-gray-50 rounded-md px-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{trip.name}</p>
                            <p className="text-xs text-slate-500">{trip.date}</p>
                          </div>
                          <span className="text-xs text-green-600 font-medium">{trip.status}</span>
                        </div>
                      ))}
                      <button className="mt-3 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                        <Eye size={14} />
                        View Full History
                      </button>
                    </>
                  ) : (
                    <p className="text-slate-600 text-sm">No history available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register Tanker Modal - Only show for Depot Manager */}
      {showRegisterModal && userRole === "depot_manager" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
              <h2 className="text-base font-semibold text-slate-900">Register New Tanker</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              <p className="text-xs text-slate-600 mb-3">
                Add a new tanker to the fleet and link with smart lock device.
              </p>

              {/* Tanker Photo removed per request */}

              {/* Plate Number */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Plate Number
                </label>
                <input
                  type="text"
                  placeholder="TRK-6001"
                  value={regTankerNumber}
                  onChange={(e) => setRegTankerNumber(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Lock Device ID */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lock Device ID
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="DEV-6001-X"
                    value={regDeviceId}
                    onChange={(e) => setRegDeviceId(e.target.value)}
                    className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="px-2 py-1.5 text-xs text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors">
                    Verify
                  </button>
                </div>
              </div>

              {/* Assigned Driver */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assigned Driver
                </label>
                <input
                  type="text"
                  placeholder="Driver UUID"
                  value={regDriverId}
                  onChange={(e) => setRegDriverId(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Owner Information */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Owner Information
                </label>
                <input
                  type="text"
                  placeholder="Owner UUID"
                  value={regOwnerId}
                  onChange={(e) => setRegOwnerId(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="+2348000000099"
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Fleet Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Fleet Name
                </label>
                <input
                  type="text"
                  placeholder="TurboFlux Fleet"
                  value={regFleetName}
                  onChange={(e) => setRegFleetName(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Total Trips */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total Trips
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={regTotalTrips}
                  onChange={(e) => setRegTotalTrips(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-3 border-t flex-shrink-0">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterTanker}
                disabled={registerLoading}
                className={`flex-1 px-3 py-1.5 text-sm text-white rounded-md font-medium transition-all ${registerLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500'}`}
              >
                {registerLoading ? 'Registering...' : 'Register Tanker'}
              </button>
            </div>

            {registerError && (
              <div className="px-3 pb-3 text-xs text-red-600 font-medium">{registerError}</div>
            )}
            {registerSuccess && (
              <div className="px-3 pb-3 text-xs text-green-600 font-medium">{registerSuccess}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TankerFleetDashboard
