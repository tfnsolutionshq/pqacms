import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, Navigation, Route, History, Maximize2, X, User, Building2, Truck, Gauge } from 'lucide-react'

const LiveTracking = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTanker, setSelectedTanker] = useState(null)
  const [isFullscreen] = useState(false)
  const [showFullRouteModal, setShowFullRouteModal] = useState(false)
  const [showRouteHistoryModal, setShowRouteHistoryModal] = useState(false)
  const [showFullscreenMapModal, setShowFullscreenMapModal] = useState(false)
  const [userRole, setUserRole] = useState('depot-manager') // 'depot-manager' or 'driver'
  const [currentDriverId] = useState('John Adeyemi')
  const [usingSample, setUsingSample] = useState(true)
  // Create Trip modal state
  const [showCreateTripModal, setShowCreateTripModal] = useState(false)
  const [createTripStatus, setCreateTripStatus] = useState({ loading: false, error: '', success: '' })
  const [newTripTankerId, setNewTripTankerId] = useState('')
  const [newTripOrigin, setNewTripOrigin] = useState('')
  const [newTripDestination, setNewTripDestination] = useState('')
  const [newTripDepartedAt, setNewTripDepartedAt] = useState('')
  const [tankerOptions, setTankerOptions] = useState([])

  // Sample tanker data (used as fallback)
  const [tankers, setTankers] = useState([
    {
      id: 'TRK-2045',
      plateNumber: 'LAG-4521-XY',
      driver: 'John Adeyemi',
      route: 'Lagos → Port Harcourt',
      destination: 'Benin-Ore Expressway',
      speed: '72 km/h',
      status: 'active',
      lastUpdate: '30 sec ago',
      eta: '2h 15m',
      progress: 65,
      coordinates: { lat: 6.7465, lng: 4.4890 },
      currentLocation: 'Benin-Ore Expressway',
      lockStatus: 'Secured',
      alerts: 0
    },
    {
      id: 'TRK-3012',
      plateNumber: 'ABJ-7823-ZK',
      driver: 'Sarah Ibrahim',
      route: 'Abuja → Kano',
      destination: 'Kaduna-Zaria Road',
      speed: '65 km/h',
      status: 'active',
      lastUpdate: '1 min ago',
      eta: '3h 45m',
      progress: 42,
      coordinates: { lat: 10.5269, lng: 7.4390 },
      currentLocation: 'Kaduna-Zaria Road',
      lockStatus: 'secured',
      alerts: 1
    },
    {
      id: 'TRK-1874',
      plateNumber: 'BEN-2109-PQ',
      driver: 'Michael Okafor',
      route: 'Benin → Warri',
      destination: 'Sapele Road',
      speed: '58 km/h',
      status: 'active',
      lastUpdate: '2 min ago',
      eta: '2h 15m',
      progress: 68,
      coordinates: { lat: 5.6037, lng: 5.6037 },
      currentLocation: 'Sapele Road',
      lockStatus: 'secured',
      alerts: 0
    }
  ])

  // Fetch trips from API and map to tanker cards
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      setUsingSample(true)
      return // keep sample data if unauthenticated
    }
    const controller = new AbortController()
    async function loadTrips() {
      try {
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/trips?page=1', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })
        if (!res.ok) {
          // retain sample data on failure
          setUsingSample(true)
          return
        }
        const json = await res.json()
        const list = Array.isArray(json?.data) ? json.data : []
        const mapped = list.map((trip) => {
          const t = trip?.tanker || {}
          const tankerNumber = t?.tanker_number || t?.id || 'Unknown'
          const routeText = [trip?.origin, trip?.destination].filter(Boolean).join(' → ')
          const lastUpdate = trip?.updated_at ? new Date(trip.updated_at).toLocaleString() : '—'
          const eta = trip?.arrived_at ? new Date(trip.arrived_at).toLocaleString() : '—'
          const progress = trip?.status === 'completed' ? 100 : 0
          const lockStatus = (t?.status || '').toLowerCase() === 'locked' ? 'Secured' : 'Unlocked'
          return {
            id: tankerNumber,
            plateNumber: tankerNumber,
            driver: t?.driver_id || 'Unknown',
            route: routeText || '—',
            destination: trip?.destination || '—',
            speed: '—',
            status: trip?.status || 'active',
            lastUpdate,
            eta,
            progress,
            coordinates: null,
            currentLocation: trip?.destination || '—',
            lockStatus,
            alerts: 0,
          }
        })
        if (mapped.length) {
          setTankers(mapped)
          setUsingSample(false)
        } else {
          setUsingSample(true)
        }
      } catch (_) {
        // swallow errors; keep sample data
        setUsingSample(true)
      }
    }
    loadTrips()
    return () => controller.abort()
  }, [])

  // Load tanker options from cache (persisted by other pages)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('tankers_simple') : null
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed) && parsed.length) {
        setTankerOptions(parsed)
        setNewTripTankerId(prev => prev || parsed[0]?.id || '')
      }
    } catch (_) {
      setTankerOptions([])
    }
  }, [])

  // Refresh trips list (used after creating a trip)
  const refreshTrips = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return
    try {
      const res = await fetch('http://api.pqacms.tfnsolutions.us/api/trips?page=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) return
      const json = await res.json()
      const list = Array.isArray(json?.data) ? json.data : []
      const mapped = list.map((trip) => {
        const t = trip?.tanker || {}
        const tankerNumber = t?.tanker_number || t?.id || 'Unknown'
        const routeText = [trip?.origin, trip?.destination].filter(Boolean).join(' → ')
        const lastUpdate = trip?.updated_at ? new Date(trip.updated_at).toLocaleString() : '—'
        const eta = trip?.arrived_at ? new Date(trip.arrived_at).toLocaleString() : '—'
        const progress = trip?.status === 'completed' ? 100 : 0
        const lockStatus = (t?.status || '').toLowerCase() === 'locked' ? 'Secured' : 'Unlocked'
        return {
          id: tankerNumber,
          plateNumber: tankerNumber,
          driver: t?.driver_id || 'Unknown',
          route: routeText || '—',
          destination: trip?.destination || '—',
          speed: '—',
          status: trip?.status || 'active',
          lastUpdate,
          eta,
          progress,
          coordinates: null,
          currentLocation: trip?.destination || '—',
          lockStatus,
          alerts: 0,
        }
      })
      if (mapped.length) {
        setTankers(mapped)
        setUsingSample(false)
      }
    } catch (_) {}
  }

  // Submit new trip
  const handleSubmitCreateTrip = async () => {
    setCreateTripStatus({ loading: true, error: '', success: '' })
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (!token) throw new Error('Not authenticated: please login to create trips')
      if (!newTripTankerId) throw new Error('Please select or enter a tanker')
      if (!newTripOrigin.trim()) throw new Error('Origin is required')
      if (!newTripDestination.trim()) throw new Error('Destination is required')
      if (newTripOrigin.length > 100) throw new Error('Origin must be ≤ 100 characters')
      if (newTripDestination.length > 100) throw new Error('Destination must be ≤ 100 characters')

      const departedISO = newTripDepartedAt
        ? new Date(newTripDepartedAt).toISOString()
        : null

      const payload = {
        tanker_id: newTripTankerId,
        origin: newTripOrigin.trim(),
        destination: newTripDestination.trim(),
        departed_at: departedISO,
      }

      const res = await fetch('http://api.pqacms.tfnsolutions.us/api/trips', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      let json = null
      try { json = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = json?.message || 'Failed to create trip'
        throw new Error(msg)
      }
      setCreateTripStatus({ loading: false, error: '', success: 'Trip created successfully' })
      // Reset minimal fields but keep modal open to show success
      setNewTripOrigin('')
      setNewTripDestination('')
      setNewTripDepartedAt('')
      // Refresh trips list
      refreshTrips()
    } catch (e) {
      setCreateTripStatus({ loading: false, error: e.message || 'Failed to create trip', success: '' })
    }
  }

  // Filter tankers based on role
  const getFilteredTankers = () => {
    if (userRole === 'driver') {
      return tankers.filter(tanker => tanker.driver === currentDriverId)
    }
    return tankers
  }

  const filteredTankers = getFilteredTankers().filter(tanker =>
    tanker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tanker.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tanker.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTankerSelect = (tanker) => {
    setSelectedTanker(tanker)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Data Source Indicator */}
      <div className="mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${usingSample ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
          {usingSample ? 'Showing sample data — log in for live trips' : 'Live trips loaded from API'}
        </span>
      </div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateTripModal(true)}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Trip
        </button>
      </div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === 'driver' ? 'My Location' : 'Live GPS Tracking'}
            </h1>
            <p className="text-sm text-gray-600">
              {userRole === 'driver' 
                ? 'Your current location and route status' 
                : 'Real-time tanker location and route monitoring'
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Role Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setUserRole('depot-manager')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  userRole === 'depot-manager'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Building2 size={16} />
                Depot Manager
              </button>
              <button
                onClick={() => setUserRole('driver')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  userRole === 'driver'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User size={16} />
                Driver
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {userRole === 'driver' ? (
        // Driver View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Location - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Following
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">All tankers with real-time positions</p>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Map View</p>
                    <p className="text-sm text-gray-400">Real-time GPS tracking</p>
                  </div>
                  
                  {/* Sample tanker marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-green-500 rounded-full p-2">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Tanker info popup */}
                  <div className="absolute top-1/3 left-1/3 bg-white rounded-lg shadow-lg p-3 border">
                    <div className="text-sm font-medium text-gray-900">TRK-2045</div>
                    <div className="text-xs text-gray-600">John Adeyemi</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        30 sec
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Gauge className="w-3 h-3" />
                        72 km/h
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3 border">
                    <div className="text-xs font-medium text-gray-900 mb-2">Status</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Loaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Unloaded</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Tanker - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Tanker</h2>
                <p className="text-sm text-gray-600">Your assigned vehicle</p>
              </div>
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by TRK ID, plate, or driver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Driver's Tanker */}
                {filteredTankers.map((tanker) => (
                  <div key={tanker.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{tanker.id}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tanker.plateNumber}
                        </span>
                      </div>
                      {tanker.alerts > 0 && (
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                          {tanker.alerts}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Driver:</span>
                        <span className="font-medium">{tanker.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">{tanker.route}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Location:</span>
                        <span className="font-medium">{tanker.currentLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-medium">{tanker.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lock Status:</span>
                        <span className="font-medium text-green-600">{tanker.lockStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="font-medium">{tanker.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-medium">{tanker.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{tanker.progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{tanker.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${tanker.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                        <Route className="w-3 h-3" />
                        View Full Route
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <Clock className="w-3 h-3" />
                        Route History
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Depot Manager View (existing layout)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                  <p className="text-sm text-gray-600">All tankers with real-time positions</p>
                </div>
                <button
                  onClick={() => setShowFullscreenMapModal(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Map Container */}
            <div className={`relative ${isFullscreen ? 'h-96' : 'h-80'} bg-gray-100 overflow-hidden`}>
              {/* Map Background with Roads */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Road lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                  <defs>
                    <pattern id="road" patternUnits="userSpaceOnUse" width="10" height="10">
                      <rect width="10" height="10" fill="#e5e7eb"/>
                      <rect width="2" height="10" x="4" fill="#d1d5db"/>
                    </pattern>
                  </defs>
                  <path d="M50 50 Q150 100 250 80 T350 120" stroke="#9ca3af" strokeWidth="8" fill="none" strokeDasharray="5,5"/>
                  <path d="M80 200 Q180 150 280 180 T380 160" stroke="#9ca3af" strokeWidth="8" fill="none" strokeDasharray="5,5"/>
                  <path d="M20 120 Q120 180 220 140 T320 200" stroke="#9ca3af" strokeWidth="8" fill="none" strokeDasharray="5,5"/>
                </svg>
                
                {/* Tanker Markers */}
                <div className="absolute top-16 left-32 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                     onClick={() => handleTankerSelect(tankers[0])}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-32 left-48 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                     onClick={() => handleTankerSelect(tankers[1])}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-48 left-64 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                     onClick={() => handleTankerSelect(tankers[2])}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                {/* Selected Tanker Popup */}
                {selectedTanker && (
                  <div className="absolute top-20 left-40 bg-white rounded-lg shadow-xl p-4 min-w-48 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{selectedTanker.id}</h3>
                      <button
                        onClick={() => setSelectedTanker(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{selectedTanker.driver}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Navigation className="w-3 h-3" />
                      <span>{selectedTanker.speed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {selectedTanker.eta}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Locked</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Unlocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tanker List Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Tankers</h2>
              <p className="text-sm text-gray-600">Real-time fleet status</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {tankers.map((tanker) => (
                  <div 
                    key={tanker.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTanker?.id === tanker.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTankerSelect(tanker)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${tanker.lockStatus === 'Secured' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-900">{tanker.id}</span>
                      </div>
                      <span className="text-xs text-gray-500">{tanker.lastUpdate}</span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{tanker.route}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Navigation className="w-3 h-3" />
                        <span>{tanker.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-xs">🏃‍♂️ {tanker.speed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Detailed View */}
      {selectedTanker && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed View: {selectedTanker.id}</h2>
            <p className="text-sm text-gray-600">Complete tracking and status information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Driver Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Driver</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.driver}</p>
              </div>
              
              {/* Current Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Location</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.currentLocation}</p>
              </div>
              
              {/* GPS Coordinates */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">GPS Coordinates</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.coordinates.lat}° N, {selectedTanker.coordinates.lng}° E</p>
              </div>
              
              {/* Speed */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Speed</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.speed}</p>
              </div>
              
              {/* Last Update */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Last Update</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.lastUpdate}</p>
              </div>
              
              {/* ETA */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">ETA</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedTanker.eta}</p>
              </div>
              
              {/* Progress */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedTanker.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{selectedTanker.progress}%</span>
                </div>
              </div>
              
              {/* Lock Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Lock Status</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white">
                  {selectedTanker.lockStatus}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowFullRouteModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Route className="w-4 h-4" />
                View Full Route
              </button>
              <button 
                onClick={() => setShowRouteHistoryModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <History className="w-4 h-4" />
                Route History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Route Map Modal */}
      {showFullRouteModal && selectedTanker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Full Route Map: {selectedTanker.id}</h2>
                  <p className="text-sm text-gray-600">Complete route from origin to destination</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullRouteModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Info */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Route:</span>
                  <span className="ml-2 text-gray-900">{selectedTanker.route}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Progress:</span>
                  <span className="ml-2 text-gray-900">65% Complete</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">ETA:</span>
                  <span className="ml-2 text-gray-900">2h 15m</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative h-64 bg-gray-100">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Road lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                  <defs>
                    <pattern id="modalRoad" patternUnits="userSpaceOnUse" width="10" height="10">
                      <rect width="10" height="10" fill="#e5e7eb"/>
                      <rect width="2" height="10" x="4" fill="#d1d5db"/>
                    </pattern>
                  </defs>
                  
                  {/* Main route path */}
                  <path
                    d="M 50 200 Q 200 100 350 200 Q 450 250 550 200"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray="8,4"
                    fill="none"
                    opacity="0.7"
                  />
                </svg>

                {/* Route Markers */}
                {/* Start Point */}
                <div className="absolute top-48 left-12 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                    Start: Lagos
                  </div>
                </div>

                {/* Current Position */}
                <div className="absolute top-48 left-80 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                    Current: Benin-Ore Expressway
                  </div>
                </div>

                {/* Destination */}
                <div className="absolute top-48 right-12 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                    Destination: Port Harcourt
                  </div>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Route Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Distance:</span>
                      <span className="font-medium">425 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance Covered:</span>
                      <span className="font-medium">276 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium">149 km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">72 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lock Status:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">Secured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Update:</span>
                      <span className="font-medium">30 sec ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route History Modal */}
      {showRouteHistoryModal && selectedTanker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Route History: {selectedTanker.id}</h2>
                  <p className="text-sm text-gray-600">Journey timeline and location checkpoints</p>
                </div>
              </div>
              <button
                onClick={() => setShowRouteHistoryModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Driver and Route Info */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Driver:</span>
                  <span className="ml-2 text-gray-900">John Adeyemi</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Route:</span>
                  <span className="ml-2 text-gray-900">Lagos → Port Harcourt</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Transit</span>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Journey Timeline</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {/* Journey Started */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Journey Started</h4>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                    <p className="text-sm text-gray-600">Lagos Depot</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>🕐 2025-10-29 14:30</span>
                      <span>📍 6.5244° N, 3.3792° E</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">GPS</span>
                    </div>
                  </div>
                </div>

                {/* Checkpoint Passed */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Checkpoint Passed</h4>
                      <span className="text-xs text-gray-500">GPS</span>
                    </div>
                    <p className="text-sm text-gray-600">Ikorodu Checkpoint</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>🕐 2025-10-29 15:45</span>
                      <span>📍 6.6090° N, 3.5060° E</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">GPS</span>
                    </div>
                  </div>
                </div>

                {/* Route Waypoint */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Route Waypoint</h4>
                      <span className="text-xs text-gray-500">GPS</span>
                    </div>
                    <p className="text-sm text-gray-600">Sagamu Interchange</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>🕐 2025-10-29 16:20</span>
                      <span>📍 6.8391° N, 3.6469° E</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">GPS</span>
                    </div>
                  </div>
                </div>

                {/* Current Location */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mt-1 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Current Location</h4>
                      <span className="text-xs text-blue-600 font-medium">Live</span>
                    </div>
                    <p className="text-sm text-gray-600">Benin-Ore Expressway</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>🕐 2025-10-29 17:00</span>
                      <span>📍 6.7465° N, 3.4906° E</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">GPS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Map Modal */}
      {showFullscreenMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Live GPS Tracking</h2>
                <p className="text-sm text-gray-600">All tankers with real-time positions</p>
              </div>
              <button
                onClick={() => setShowFullscreenMapModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen Map */}
            <div className="relative h-[60vh] bg-gray-100">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Road lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                  <defs>
                    <pattern id="fullscreenRoad" patternUnits="userSpaceOnUse" width="10" height="10">
                      <rect width="10" height="10" fill="#e5e7eb"/>
                      <rect width="2" height="10" x="4" fill="#d1d5db"/>
                    </pattern>
                  </defs>
                  
                  {/* Multiple road paths */}
                  <path d="M 100 300 L 700 300" stroke="url(#fullscreenRoad)" strokeWidth="20" fill="none"/>
                  <path d="M 400 100 L 400 500" stroke="url(#fullscreenRoad)" strokeWidth="20" fill="none"/>
                  <path d="M 200 200 L 600 400" stroke="url(#fullscreenRoad)" strokeWidth="15" fill="none"/>
                </svg>

                {/* Tanker Markers */}
                {/* Tanker 1 */}
                <div className="absolute top-72 left-32 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    TRK-2045<br/>
                    <span className="text-gray-500">Lagos → Port Harcourt</span>
                  </div>
                </div>

                {/* Tanker 2 */}
                <div className="absolute top-80 left-96 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    TRK-3012<br/>
                    <span className="text-gray-500">Abuja → Kano</span>
                  </div>
                </div>

                {/* Tanker 3 */}
                <div className="absolute top-96 right-48 transform translate-x-1/2 -translate-y-1/2 cursor-pointer">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    TRK-1874<br/>
                    <span className="text-gray-500">Benin → Warri</span>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Active Tankers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Alert Status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreateTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">New Trip</h2>
              <button
                onClick={() => { setShowCreateTripModal(false); setCreateTripStatus({ loading: false, error: '', success: '' }) }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Tanker */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Tanker</label>
                {tankerOptions.length > 0 ? (
                  <select
                    value={newTripTankerId}
                    onChange={(e) => setNewTripTankerId(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tankerOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.tanker_number || opt.id}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Paste tanker_id (uuid)"
                    value={newTripTankerId}
                    onChange={(e) => setNewTripTankerId(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">Required. Must exist as a tanker ID.</p>
              </div>

              {/* Origin */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g., Lagos"
                  value={newTripOrigin}
                  onChange={(e) => setNewTripOrigin(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Destination */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g., Port Harcourt"
                  value={newTripDestination}
                  onChange={(e) => setNewTripDestination(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Departed At */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Departed At (optional)</label>
                <input
                  type="datetime-local"
                  value={newTripDepartedAt}
                  onChange={(e) => setNewTripDepartedAt(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Uses ISO8601 when submitted.</p>
              </div>

              {/* Status Messages */}
              {createTripStatus.error && (
                <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {createTripStatus.error}
                </div>
              )}
              {createTripStatus.success && (
                <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  {createTripStatus.success}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowCreateTripModal(false); setCreateTripStatus({ loading: false, error: '', success: '' }) }}
                  className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCreateTrip}
                  disabled={createTripStatus.loading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${createTripStatus.loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {createTripStatus.loading ? 'Creating…' : 'Create Trip'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveTracking