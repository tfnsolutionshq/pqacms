import React, { useState, useEffect } from 'react'
import { Search, Filter, Bell, AlertTriangle, Shield, CheckCircle, MapPin, Clock, User, Phone, Eye, MessageSquare, AlertCircle, Navigation, Maximize2, Users } from 'lucide-react'

const Alerts = () => {
  const [activeTab, setActiveTab] = useState('Active Alerts (3)')
  const [searchTerm, setSearchTerm] = useState('')
  const [userRole, setUserRole] = useState('depot-manager') // default to depot manager view
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [showNewAlertModal, setShowNewAlertModal] = useState(false)
  const [creatingAlert, setCreatingAlert] = useState(false)
  const [newAlertTankerId, setNewAlertTankerId] = useState('')
  const [newAlertSeverity, setNewAlertSeverity] = useState('critical')
  const [newAlertType, setNewAlertType] = useState('unauthorized_unlock_attempt')
  const [newAlertMessage, setNewAlertMessage] = useState('')
  const [newAlertLat, setNewAlertLat] = useState('')
  const [newAlertLng, setNewAlertLng] = useState('')
  const [securityOfficeName, setSecurityOfficeName] = useState('')
  const [tankerOptions, setTankerOptions] = useState([])
  // Resolve modal state
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [resolveNote, setResolveNote] = useState('')
  const [alertToResolve, setAlertToResolve] = useState(null)

  // Sample alert data (fallback)
  const defaultAlerts = [
    {
      tankerNumber: 'TRK-3012',
      displayId: 'TRK-3012',
      alertId: null,
      type: 'critical',
      title: 'Unauthorized unlock attempt detected',
      driver: 'Sarah Ibrahim',
      location: 'Kaduna-Zaria Road',
      coordinates: '10.5269° N, 7.4389° E',
      timestamp: '5 mins ago',
      status: 'active',
      actions: ['View Location', 'Contact Driver']
    },
    {
      tankerNumber: 'TRK-2045',
      displayId: 'TRK-2045',
      alertId: null,
      type: 'warning',
      title: 'Route deviation detected - 850m off planned route',
      driver: 'John Adeyemi',
      location: 'Benin-Ore Expressway',
      coordinates: '6.7847° N, 3.4906° E',
      timestamp: '12 mins ago',
      status: 'active',
      actions: ['View Route', 'Contact Driver']
    },
    {
      tankerNumber: 'TRK-4521',
      displayId: 'TRK-4521',
      alertId: null,
      type: 'warning',
      title: 'Smart lock device offline for 2 hours',
      driver: 'Unassigned',
      location: 'Last seen: Onitsha',
      coordinates: '6.1415° N, 6.7831° E',
      timestamp: '2 hours ago',
      status: 'active',
      actions: ['Check Device', 'Notify Technician']
    },
    {
      tankerNumber: 'TRK-1874',
      displayId: 'TRK-1874',
      alertId: null,
      type: 'resolved',
      title: 'GPS signal restored after maintenance',
      driver: 'Michael Okafor',
      location: 'Warri Depot',
      coordinates: '5.5160° N, 5.7500° E',
      timestamp: '1 hour ago',
      status: 'resolved',
      actions: ['View Details']
    }
  ]

  const [alerts, setAlerts] = useState(defaultAlerts)

  // Driver-specific data
  const driverData = {
    name: 'John Adeyemi',
    currentLocation: 'Benin-Ore Expressway',
    coordinates: '6.7465° N, 3.4906° E',
    lastUpdate: '30 sec ago',
    eta: '2h 15m',
    progress: '65%',
    speed: '72 km/h',
    lockStatus: 'Secured',
    tanker: {
      id: 'TRK-2045',
      location: 'Benin-Ore Expressway',
      status: 'En Route'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <Shield className="w-5 h-5 text-white" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-white" />
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-white" />
      default:
        return <Bell className="w-5 h-5 text-white" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500'
      case 'warning':
        return 'bg-orange-500'
      case 'resolved':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getCardBorderColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-orange-500 bg-orange-50'
      case 'resolved':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const getActionButtonColor = (action) => {
    if (action === 'Resolve' || action === 'Acknowledge') {
      return 'bg-green-500 hover:bg-green-600 text-white'
    }
    return 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab.startsWith('Active Alerts')) {
      return alert.status === 'active'
    } else if (activeTab.startsWith('Resolved')) {
      return alert.status === 'resolved'
    }
    return true
  })

  const activeAlerts = alerts.filter(alert => alert.status === 'active')
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical')
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning')
  const resolvedToday = alerts.filter(alert => alert.status === 'resolved')

  const tabs = [`Active Alerts (${activeAlerts.length})`, `Resolved (${resolvedToday.length})`]

  // Map API alert structure to UI alert structure
  const mapApiAlertToUi = (apiAlert) => {
    const status = apiAlert?.status === 'resolved' ? 'resolved' : 'active'
    const severity = apiAlert?.severity || 'warning'
    const type = status === 'resolved' ? 'resolved' : (severity === 'critical' ? 'critical' : 'warning')
    const tankerNumber = apiAlert?.tanker?.tanker_number || apiAlert?.tanker_id || 'Unknown Tanker'
    const lat = apiAlert?.lat
    const lng = apiAlert?.lng
    const coordinates = (typeof lat === 'number' && typeof lng === 'number')
      ? `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
      : '—'
    const createdAt = apiAlert?.created_at
    const timestamp = createdAt ? new Date(createdAt).toLocaleString() : '—'
    const actions = status === 'active' ? ['View Location', 'Resolve'] : ['View Details']

    return {
      alertId: apiAlert?.id || null,
      tankerNumber,
      displayId: tankerNumber,
      type,
      title: apiAlert?.message || 'Alert',
      driver: 'Unknown',
      location: '—',
      coordinates,
      timestamp,
      status,
      actions
    }
  }

  const [bannerMessage, setBannerMessage] = useState(null)
  const [bannerKind, setBannerKind] = useState('info') // 'info' | 'success' | 'error'

  const resolveAlert = async (alertId, note) => {
    try {
      setResolving(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (!alertId) throw new Error('Missing alert ID')
      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/alerts/${alertId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ action: 'resolved', note: note || null })
      })
      if (!res.ok) {
        throw new Error(`Failed to resolve alert: ${res.status}`)
      }
      // Optimistically update UI
      setAlerts(prev => prev.map(a => a.alertId === alertId ? { ...a, status: 'resolved', type: 'resolved', actions: ['View Details'] } : a))
      setBannerMessage('Alert resolved successfully.')
      setBannerKind('success')
      // Close and reset modal state
      setShowResolveModal(false)
      setAlertToResolve(null)
      setResolveNote('')
    } catch (err) {
      setBannerMessage(err?.message || 'Unable to resolve alert')
      setBannerKind('error')
    } finally {
      setResolving(false)
    }
  }

  const handleAlertAction = async (alert, action) => {
    if (action === 'Resolve') {
      if (usingFallback || !alert.alertId) {
        setBannerMessage('Cannot resolve mock alerts. Switch to API data.')
        setBannerKind('info')
        return
      }
      setAlertToResolve(alert)
      setResolveNote('')
      setShowResolveModal(true)
      return
    }
    // No-op for other actions in this demo
  }

  const submitNewAlert = async () => {
    const tanker_id = newAlertTankerId.trim()
    const message = newAlertMessage.trim()
    if (!message) {
      setBannerMessage('Message is required')
      setBannerKind('error')
      return
    }
    const lat = newAlertLat === '' ? null : newAlertLat
    const lng = newAlertLng === '' ? null : newAlertLng
    try {
      setCreatingAlert(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/alerts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          tanker_id,
          severity: newAlertSeverity,
          type: newAlertType,
          message,
          lat,
          lng
        })
      })
      if (!res.ok) {
        throw new Error(`Failed to create alert: ${res.status}`)
      }
      const json = await res.json()
      const created = mapApiAlertToUi(json?.data || json)
      setAlerts(prev => [created, ...prev])
      setUsingFallback(false)
      setBannerMessage('Alert created successfully.')
      setBannerKind('success')
      setShowNewAlertModal(false)
      setNewAlertTankerId('')
      setNewAlertMessage('')
      setNewAlertLat('')
      setNewAlertLng('')
      setNewAlertSeverity('critical')
      setNewAlertType('unauthorized_unlock_attempt')
    } catch (err) {
      setBannerMessage(err?.message || 'Unable to create alert')
      setBannerKind('error')
    } finally {
      setCreatingAlert(false)
    }
  }

  // Load tanker dropdown options (persisted by TankerFleet)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('tankers_simple') : null
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed) && parsed.length) {
        setTankerOptions(parsed)
        setNewAlertTankerId(prev => prev || parsed[0]?.id || '')
      }
    } catch (_) {
      setTankerOptions([])
    }
  }, [])

  // Also fetch tankers directly from API to ensure accurate tanker_id
  useEffect(() => {
    const fetchTankers = async () => {
      try {
        if (userRole !== 'depot-manager') return
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (!token) return
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/tankers', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          return
        }
        const payload = await res.json()
        const list = Array.isArray(payload?.data) ? payload.data : []
        const mapped = list.map(item => ({ id: item?.id, tanker_number: item?.tanker_number }))
        if (mapped.length) {
          setTankerOptions(mapped)
          setNewAlertTankerId(prev => prev || mapped[0]?.id || '')
          try { localStorage.setItem('tankers_simple', JSON.stringify(mapped)) } catch (_) {}
        }
      } catch (_) {
        // swallow errors and retain existing options
      }
    }
    fetchTankers()
  }, [userRole])

  // Fetch alerts for depot manager from API
  useEffect(() => {
    const fetchAlerts = async () => {
      if (userRole !== 'depot-manager') return
      setLoading(true)
      setError(null)
      setUsingFallback(false)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/alerts?page=1', {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        if (!res.ok) {
          throw new Error(`Failed to fetch alerts: ${res.status}`)
        }
        const json = await res.json()
        const apiData = Array.isArray(json?.data) ? json.data : []
        const uiAlerts = apiData.map(mapApiAlertToUi)
        setAlerts(uiAlerts.length ? uiAlerts : defaultAlerts)
        setUsingFallback(uiAlerts.length === 0)
      } catch (err) {
        setError(err?.message || 'Unable to load alerts')
        setAlerts(defaultAlerts)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole])

  // Driver View Component
  const DriverView = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Location</h1>
            <p className="text-gray-600 mt-1">Your current location and route details</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                <p className="text-sm text-gray-600">All tankers with real-time positions</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </button>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center relative">
              <div className="text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive Map View</p>
              </div>
              
              {/* Map Markers */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Status Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs font-medium text-gray-700 mb-2">Status</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Loaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Unloaded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location Details */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">TRK-2045</h3>
                  <p className="text-sm text-gray-600">John Adeyemi</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  En Route
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Driver</p>
                  <p className="font-medium text-gray-900">{driverData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Location</p>
                  <p className="font-medium text-gray-900">{driverData.currentLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">GPS Coordinates</p>
                  <p className="font-medium text-gray-900">{driverData.coordinates}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Speed</p>
                  <p className="font-medium text-gray-900">{driverData.speed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Update</p>
                  <p className="font-medium text-gray-900">{driverData.lastUpdate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ETA</p>
                  <p className="font-medium text-gray-900">{driverData.eta}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-medium text-gray-900">{driverData.progress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lock Status</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    {driverData.lockStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Navigation className="w-4 h-4" />
                  View Full Route
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <Clock className="w-4 h-4" />
                  Route History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Tanker Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Tanker</h2>
              <span className="text-sm text-gray-500">Your assigned vehicle</span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by TRK ID, plate, or driver..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tanker Card */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{driverData.tanker.id}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  {driverData.tanker.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Lagos - Port Harcourt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Route: Via Expressway</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">25 hours</span>
                </div>
              </div>
            </div>

            {/* Detailed View */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Detailed View: {driverData.tanker.id}</h4>
              <p className="text-sm text-gray-600 mb-4">Complete tracking and status information</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Driver</p>
                  <p className="font-medium text-gray-900">{driverData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Location</p>
                  <p className="font-medium text-gray-900">{driverData.currentLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">GPS Coordinates</p>
                  <p className="font-medium text-gray-900">{driverData.coordinates}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Speed</p>
                  <p className="font-medium text-gray-900">{driverData.speed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Update</p>
                  <p className="font-medium text-gray-900">{driverData.lastUpdate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ETA</p>
                  <p className="font-medium text-gray-900">{driverData.eta}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-medium text-gray-900">{driverData.progress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lock Status</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    {driverData.lockStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Navigation className="w-4 h-4" />
                  View Full Route
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  <Clock className="w-4 h-4" />
                  Route History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Depot Manager View Component (API-backed)
  const DepotManagerView = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alert Center</h1>
            <p className="text-gray-600 mt-1">Monitor and respond to security alerts and system notifications</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setShowNewAlertModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <AlertCircle className="w-4 h-4" />
              New Alert
            </button>
          </div>
        </div>
        {loading && (
          <div className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
            Loading alerts…
          </div>
        )}
        {!loading && usingFallback && (
          <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            Showing mock alerts due to API error.
          </div>
        )}
        {!loading && error && !usingFallback && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Active Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeAlerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{criticalAlerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{warningAlerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Resolved Today */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{resolvedToday.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Alert Cards */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.alertId || alert.tankerNumber || alert.displayId}
                className={`border-l-4 ${getCardBorderColor(alert.type)} rounded-lg p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Alert Icon */}
                    <div className={`w-10 h-10 ${getAlertColor(alert.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getAlertIcon(alert.type)}
                    </div>

                    {/* Alert Content */}
                      <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.tankerNumber || alert.displayId}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.type === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <p className="text-gray-900 font-medium mb-3">{alert.title}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Driver:</span>
                            <span className="font-medium text-gray-900">{alert.driver}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium text-gray-900">{alert.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        <span className="font-medium">GPS Coordinates:</span> {alert.coordinates}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleAlertAction(alert, action)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${getActionButtonColor(action)}`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Alert Modal */}
      {showNewAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Alert</h3>
              <button onClick={() => setShowNewAlertModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanker</label>
                <select
                  value={newAlertTankerId}
                  onChange={(e) => setNewAlertTankerId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tankerOptions.length === 0 ? (
                    <option value="">No tankers available</option>
                  ) : (
                    tankerOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.tanker_number || opt.id}</option>
                    ))
                  )}
                </select>
                {tankerOptions.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Ensure you are logged in and tankers have been fetched.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Security Office Name (optional)</label>
                <input
                  type="text"
                  value={securityOfficeName}
                  onChange={(e) => setSecurityOfficeName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Warri Depot Security"
                />
                <p className="text-xs text-gray-500 mt-1">This field is for display only and not sent.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={newAlertSeverity}
                    onChange={(e) => setNewAlertSeverity(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="critical">critical</option>
                    <option value="warning">warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newAlertType}
                    onChange={(e) => setNewAlertType(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unauthorized_unlock_attempt">unauthorized_unlock_attempt</option>
                    <option value="route_deviation">route_deviation</option>
                    <option value="device_offline">device_offline</option>
                    <option value="geo_fence_breach">geo_fence_breach</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={3}
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lock tamper detected"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude (optional)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newAlertLat}
                    onChange={(e) => setNewAlertLat(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9.0597"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude (optional)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newAlertLng}
                    onChange={(e) => setNewAlertLng(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="7.4951"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNewAlertModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={creatingAlert}
              >
                Cancel
              </button>
              <button
                onClick={submitNewAlert}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={creatingAlert || !newAlertMessage.trim()}
              >
                {creatingAlert ? 'Creating…' : 'Create Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Alert Modal */}
      {showResolveModal && alertToResolve && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resolve Alert</h3>
              <button onClick={() => setShowResolveModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <div className="font-medium">{alertToResolve.title}</div>
                <div className="text-gray-500 mt-1">{alertToResolve.tankerNumber || alertToResolve.displayId} • {alertToResolve.timestamp}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resolution note (optional)</label>
                <textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add context for this resolution"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={resolving}
              >
                Cancel
              </button>
              <button
                onClick={() => alertToResolve?.alertId && resolveAlert(alertToResolve.alertId, resolveNote)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={resolving || !alertToResolve?.alertId}
              >
                {resolving ? 'Resolving…' : 'Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Toggle */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {userRole === 'driver' ? 'Driver View' : 'Depot Manager View'}
            </h2>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUserRole('driver')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'driver'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                Driver
              </button>
              <button
                onClick={() => setUserRole('depot-manager')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'depot-manager'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Depot Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render appropriate view based on role */}
      {userRole === 'driver' ? <DriverView /> : <DepotManagerView />}
      {bannerMessage && (
        <div className={`mx-6 mt-4 mb-6 px-4 py-2 rounded border ${
          bannerKind === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
          bannerKind === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {bannerMessage}
        </div>
      )}
    </div>
  )
}

export default Alerts