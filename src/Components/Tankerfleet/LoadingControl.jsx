import React, { useEffect, useState } from 'react'
import { ChevronDown, CheckCircle, Clock, Lock, X, Building2, Users, User } from 'lucide-react'

function LoadingControl() {
  const [selectedTanker, setSelectedTanker] = useState('TRK-3012 - Sarah Ibrahim')
  const [selectedTankerId, setSelectedTankerId] = useState('')
  const [tankerOptions, setTankerOptions] = useState([])
  const [productType, setProductType] = useState('Premium Petrol (PMS)')
  const [quantity, setQuantity] = useState('33000')
  const [destination, setDestination] = useState('Station name')
  const [location, setLocation] = useState('Station location')
  const [destinationLat, setDestinationLat] = useState('Station Map Coordinate (Latitude)')
  const [destinationLng, setDestinationLng] = useState('Station Map Coordinate (Longitude)')
  const [departureTime, setDepartureTime] = useState('')
  const [createStatus, setCreateStatus] = useState({ loading: false, error: '', success: '' })
  const [userRole, setUserRole] = useState('depot-manager')
  const [isLoggedIn] = useState(() => !!localStorage.getItem('auth_token'))
  const [selectedStation] = useState('Station A, Lagos')
  const [currentDriverId] = useState('John Adeyemi') // Simulated current driver ID
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lockStatus, setLockStatus] = useState({ loading: false, error: '', success: '' })
  const [lockContext, setLockContext] = useState({ opId: null, tanker: '', tankerId: null, product: '', destination: '' })
  const [tankerStatusMap, setTankerStatusMap] = useState({})

  // Driver's current load data
  const driverCurrentLoad = {
    id: 'TRK-2045',
    driver: 'John Adeyemi',
    product: 'Premium Petrol',
    quantity: '33,000L',
    destination: 'Station A, Lagos',
    time: '10:30 AM',
    status: 'locked'
  }

  const [depotLoadings, setDepotLoadings] = useState([
    {
      opId: null,
      id: 'TRK-2045',
      driver: 'John Adeyemi',
      product: 'Premium Petrol',
      quantity: '33,000L',
      destination: 'Station A, Lagos, 12.4327°N, 8.1812°E',
      time: '10:30 AM',
      status: 'locked'
    },
    {
      opId: null,
      id: 'TRK-3012',
      driver: 'Sarah Ibrahim',
      product: 'Diesel',
      quantity: '28,000L',
      destination: 'Station B, Abuja, 12.4327°N, 8.1812°E',
      time: '09:15 AM',
      status: 'locked'
    },
    {
      opId: null,
      id: 'TRK-1874',
      driver: 'Michael Okafor',
      product: 'Premium Petrol',
      quantity: '33,000L',
      destination: 'Station C, Enugu, 12.4327°N, 8.1812°E',
      time: '08:00 AM',
      status: 'pending'
    }
  ])

  const stationLoadings = [
    {
      id: 'TRK-2045',
      driver: 'John Adeyemi',
      product: 'Premium Petrol',
      quantity: '33,000L',
      destination: 'Station A, Lagos',
      time: '10:30 AM',
      status: 'locked'
    },
    {
      id: 'TRK-3012',
      driver: 'Sarah Ibrahim',
      product: 'Diesel',
      quantity: '28,000L',
      destination: 'Station B, Abuja',
      time: '09:15 AM',
      status: 'locked'
    },
    {
      id: 'TRK-1874',
      driver: 'Michael Okafor',
      product: 'Premium Petrol',
      quantity: '33,000L',
      destination: 'Station C, Warri',
      time: '08:00 AM',
      status: 'pending'
    }
  ]

  const loadingsData = userRole === 'station-manager' ? stationLoadings : depotLoadings

  // Fetch depot manager load operations from API
  useEffect(() => {
    const fetchLoadOperations = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const headers = { Accept: 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/load-operations', {
          method: 'GET',
          headers,
        })
        if (!res.ok) {
          // Keep defaults if request fails
          return
        }
        const payload = await res.json()
        const list = Array.isArray(payload?.data) ? payload.data : []
        const mapped = list.map((item) => {
          const fuelLabel = item.fuel_type === 'PMS' ? 'Premium Petrol' : item.fuel_type === 'AGO' ? 'Diesel' : item.fuel_type === 'DPK' ? 'Kerosene' : (item.fuel_type || 'Fuel')
          const qty = typeof item.quantity === 'number' ? `${item.quantity.toLocaleString()}L` : String(item.quantity || '—')
          const started = item.started_at ? new Date(item.started_at) : null
          const timeStr = started ? started.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
          const statusRaw = (item?.status || '').toLowerCase()
          const status = (statusRaw === 'locked' || statusRaw === 'completed') ? 'locked' : 'pending'
          return {
            opId: item?.id || null,
            tankerId: item?.tanker?.id || item?.tanker_id || null,
            id: item?.tanker?.tanker_number || item?.tanker_id || item?.id || '—',
            tankerStatus: (item?.tanker?.status || '').toLowerCase(),
            driver: '—',
            product: fuelLabel,
            quantity: qty,
            destination: '—',
            time: timeStr,
            status,
            progress: typeof item.progress === 'number' ? item.progress : undefined,
          }
        })
        if (mapped.length > 0) {
          setDepotLoadings(mapped)
        }
      } catch (_) {
        // swallow errors, keep defaults
      }
    }

    if (userRole === 'depot-manager' && isLoggedIn) {
      fetchLoadOperations()
    }
  }, [userRole, isLoggedIn])

  // Load tanker dropdown options (persisted by TankerFleet)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tankers_simple')
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed) && parsed.length) {
        setTankerOptions(parsed)
        setSelectedTankerId(parsed[0]?.id || '')
        setSelectedTanker(parsed[0]?.tanker_number || '')
      }
    } catch (_) {
      setTankerOptions([])
    }
  }, [])

  // Also fetch tankers directly from API to ensure accurate tanker_id
  useEffect(() => {
    const fetchTankers = async () => {
      try {
        if (!(userRole === 'depot-manager' && isLoggedIn)) return
        const token = localStorage.getItem('auth_token')
        const headers = { Accept: 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/tankers', {
          method: 'GET',
          headers,
        })
        if (!res.ok) {
          // keep any existing options; API may return 500 if unauthenticated
          return
        }
        const payload = await res.json()
        const list = Array.isArray(payload?.data) ? payload.data : []
        const mapped = list.map(item => ({ id: item?.id, tanker_number: item?.tanker_number, status: item?.status }))
        if (mapped.length) {
          setTankerOptions(mapped.map(({ id, tanker_number }) => ({ id, tanker_number })))
          setSelectedTankerId(mapped[0]?.id || '')
          setSelectedTanker(mapped[0]?.tanker_number || '')
          // build status map for quick lookups
          const statusMap = {}
          mapped.forEach(t => { if (t.id) statusMap[t.id] = { status: (t.status || '').toLowerCase(), tanker_number: t.tanker_number } })
          setTankerStatusMap(statusMap)
          // persist for reuse (without status to keep prior behavior)
          try { localStorage.setItem('tankers_simple', JSON.stringify(mapped.map(({ id, tanker_number }) => ({ id, tanker_number })))) } catch (_) {}
        }
      } catch (_) {
        // swallow errors and retain existing options
      }
    }
    fetchTankers()
  }, [userRole, isLoggedIn])

  // Create a new loading operation
  const handleCreateLoading = async () => {
    setCreateStatus({ loading: true, error: '', success: '' })
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Please log in to create a loading.')
      if (!selectedTankerId) throw new Error('Please select a tanker.')

      let fuelCode = 'PMS'
      const pt = (productType || '').toUpperCase()
      if (pt.includes('AGO')) fuelCode = 'AGO'
      else if (pt.includes('DPK')) fuelCode = 'DPK'

      const payload = {
        tanker_id: selectedTankerId,
        fuel_type: fuelCode,
        quantity: Number(quantity) || 0,
        destination: destination || null,
        destination_lat: destinationLat !== '' ? Number(destinationLat) : null,
        destination_lng: destinationLng !== '' ? Number(destinationLng) : null,
        departure_time: departureTime || null,
      }

      const res = await fetch('http://api.pqacms.tfnsolutions.us/api/load-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to create loading operation')
      }
      const data = await res.json()
      setCreateStatus({ loading: false, error: '', success: 'Loading operation created successfully.' })
      // Optimistically prepend to Today’s Loadings
      const newCard = {
        opId: data?.id || null,
        tankerId: data?.tanker?.id || selectedTankerId || null,
        id: data?.tanker?.tanker_number || selectedTanker || '—',
        driver: '—',
        product: fuelCode === 'PMS' ? 'Premium Petrol' : fuelCode === 'AGO' ? 'Diesel' : fuelCode === 'DPK' ? 'Kerosene' : fuelCode,
        quantity: `${(Number(quantity) || 0).toLocaleString()}L`,
        destination: destination || '—',
        time: '—',
        status: 'pending',
        progress: 0,
      }
      setDepotLoadings(prev => [newCard, ...(Array.isArray(prev) ? prev : [])])
    } catch (err) {
      setCreateStatus({ loading: false, error: err?.message || 'Error creating loading', success: '' })
    }
  }

  // Inline update for a loading operation
  const [editingOpId, setEditingOpId] = useState(null)
  const [updateForm, setUpdateForm] = useState({ status: 'queued', progress: 0, started_at: '', completed_at: '' })
  const [patchStatus, setPatchStatus] = useState({ loading: false, error: '', success: '' })

  const startEditLoading = (opId, loading) => {
    if (!opId) return
    setEditingOpId(opId)
    setPatchStatus({ loading: false, error: '', success: '' })
    setUpdateForm({
      status: (loading?.status === 'locked' ? 'completed' : 'loading'),
      progress: typeof loading?.progress === 'number' ? loading.progress : 0,
      started_at: '',
      completed_at: '',
    })
  }

  const handleUpdateField = (field, value) => {
    setUpdateForm(prev => ({ ...prev, [field]: value }))
  }

  const submitUpdateLoading = async () => {
    if (!editingOpId) return
    setPatchStatus({ loading: true, error: '', success: '' })
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Please log in to update a loading.')

      const payload = {
        status: updateForm.status || undefined,
        progress: updateForm.progress !== '' ? Math.max(0, Math.min(100, Number(updateForm.progress))) : undefined,
        started_at: updateForm.started_at || undefined,
        completed_at: updateForm.completed_at || undefined,
      }

      const res = await fetch(`http://api.pqacms.tfnsolutions.us/api/load-operations/${editingOpId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to update loading')
      }
      await res.json()
      setPatchStatus({ loading: false, error: '', success: 'Loading updated.' })
      // Reflect update in UI
      setDepotLoadings(prev => (Array.isArray(prev) ? prev.map(card => {
        if (card.opId === editingOpId) {
          const updatedStatus = updateForm.status === 'completed' ? 'locked' : (updateForm.status === 'loading' ? 'pending' : card.status)
          return {
            ...card,
            status: updatedStatus,
            progress: payload.progress ?? card.progress,
            time: updateForm.started_at ? new Date(updateForm.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : card.time,
          }
        }
        return card
      }) : prev))
    } catch (err) {
      setPatchStatus({ loading: false, error: err?.message || 'Error updating loading', success: '' })
    }
  }

  const handleRoleSwitch = (role) => {
    setUserRole(role)
  }

  const renderLoadingCards = () => (
    loadingsData.map((loading) => {
      const isLocked = loading.status === 'locked'
      const showPendingAction = userRole === 'depot-manager'
      const tStatusFromMap = loading.tankerId ? (tankerStatusMap[loading.tankerId]?.status || '') : ''
      const tStatusRaw = tStatusFromMap || (loading.tankerStatus || '')
      const tankerIsLocked = tStatusRaw === 'locked'
      return (
        <div
          key={loading.id}
          className={`p-3 rounded-lg border ${
            isLocked ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">{loading.id}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isLocked ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {isLocked ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Locked ✓
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    Pending
                  </div>
                )}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-1">Driver: {loading.driver}</div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Product:</span>
              <div className="font-medium text-gray-900">{loading.product}</div>
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>
              <div className="font-medium text-gray-900">{loading.quantity}</div>
            </div>
          </div>

          <div className="mt-2 text-xs">
            <span className="text-gray-500">Destination:</span>
            <div className="font-medium text-gray-900">{loading.destination}</div>
          </div>

          <div className="mt-2 text-xs">
            <span className="text-gray-500">Time:</span>
            <span className="font-medium text-gray-900 ml-1">{loading.time}</span>
          </div>

          {typeof loading.progress === 'number' && (
            <div className="mt-2 text-xs">
              <span className="text-gray-500">Progress:</span>
              <span className="font-medium text-gray-900 ml-1">{loading.progress}%</span>
            </div>
          )}

          {/* Tanker Status (from tanker API) */}
          {loading.tankerId && (
            <div className="mt-2 text-xs">
              <span className="text-gray-500">Tanker Status:</span>
              <span className="font-medium text-gray-900 ml-1">{tankerIsLocked ? 'Locked' : (tStatusRaw ? tStatusRaw : 'Unknown')}</span>
            </div>
          )}

          {/* Activate Lock button if tanker is not locked */}
          {showPendingAction && !!loading.opId && loading.tankerId && !tankerIsLocked && (
            <div className="mt-2 pt-2 border-t border-orange-200">
              <button
                onClick={() => {
                  if (!loading.opId) {
                    setLockStatus({ loading: false, error: 'Operation ID unavailable for this loading.', success: '' })
                    return
                  }
                  setLockContext({
                    opId: loading.opId,
                    tanker: loading.id || '',
                    tankerId: loading.tankerId || null,
                    product: loading.product || '',
                    destination: loading.destination || '',
                  })
                  setLockStatus({ loading: false, error: '', success: '' })
                  setShowConfirmModal(true)
                }}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                Activate Lock
              </button>
            </div>
          )}

          {/* Update Controls (Depot Manager only, requires opId) */}
          {showPendingAction && !!loading.opId && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {editingOpId !== loading.opId ? (
                <button
                  onClick={() => startEditLoading(loading.opId, loading)}
                  className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                >
                  Update Loading
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Status</label>
                      <select
                        value={updateForm.status}
                        onChange={(e) => handleUpdateField('status', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      >
                        <option value="queued">queued</option>
                        <option value="loading">loading</option>
                        <option value="completed">completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Progress</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={updateForm.progress}
                        onChange={(e) => handleUpdateField('progress', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Started At</label>
                      <input
                        type="datetime-local"
                        value={updateForm.started_at}
                        onChange={(e) => handleUpdateField('started_at', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Completed At</label>
                      <input
                        type="datetime-local"
                        value={updateForm.completed_at}
                        onChange={(e) => handleUpdateField('completed_at', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={submitUpdateLoading}
                      disabled={patchStatus.loading}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      {patchStatus.loading ? 'Updating…' : 'Save Update'}
                    </button>
                    <button
                      onClick={() => setEditingOpId(null)}
                      className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  {patchStatus.error && (
                    <p className="text-xs text-red-600">{patchStatus.error}</p>
                  )}
                  {patchStatus.success && (
                    <p className="text-xs text-green-600">{patchStatus.success}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )
    })
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Management</h1>
              <p className="text-sm text-gray-600">
                {userRole === 'depot-manager'
                  ? 'Manage tanker loading operations and smart lock activation'
                  : userRole === 'station-manager'
                  ? `View loading operations and lock status for ${selectedStation}`
                  : 'View your assigned tanker and device information'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => handleRoleSwitch('depot-manager')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'depot-manager'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Depot Manager
              </button>
              <button
                onClick={() => handleRoleSwitch('station-manager')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'station-manager'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4" />
                Station Manager
              </button>
              <button
                onClick={() => handleRoleSwitch('driver')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'driver'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                Driver
              </button>
            </div>
          </div>
        </div>

        {userRole === 'depot-manager' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Loading Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">+</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">New Loading</h2>
                    <p className="text-sm text-gray-600">Record loading and activate smart lock</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Select Tanker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Tanker</label>
                  <div className="relative">
                    <select
                      value={selectedTankerId}
                      onChange={(e) => {
                        const id = e.target.value
                        setSelectedTankerId(id)
                        const opt = tankerOptions.find(t => t.id === id)
                        setSelectedTanker(opt?.tanker_number || '')
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    >
                      <option value="">-- Choose Tanker --</option>
                      {tankerOptions.length > 0 ? (
                        tankerOptions.map(t => (
                          <option key={t.id} value={t.id}>{t.tanker_number}</option>
                        ))
                      ) : (
                        <>
                          <option value="TRK-3012">TRK-3012</option>
                          <option value="TRK-2045">TRK-2045</option>
                          <option value="TRK-1874">TRK-1874</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Device Status */}
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                  <CheckCircle size={16} />
                  <span>Device DEV-3012-A is online and ready</span>
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <div className="relative">
                    <select 
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    >
                      <option value="Premium Petrol (PMS)">Premium Petrol (PMS)</option>
                      <option value="Diesel (AGO)">Diesel (AGO)</option>
                      <option value="Kerosene (DPK)">Kerosene (DPK)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Liters)</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Station name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Station location"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Destination Latitude */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Destination Latitude</label>
                    <button className="text-green-600 text-xs hover:text-green-700">Need Help?</button>
                  </div>
                  <input
                    type="text"
                    value={destinationLat}
                    onChange={(e) => setDestinationLat(e.target.value)}
                    placeholder="Station Map Coordinate (Latitude)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Destination Longitude */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Destination Longitude</label>
                    <button className="text-green-600 text-xs hover:text-green-700">Need Help?</button>
                  </div>
                  <input
                    type="text"
                    value={destinationLng}
                    onChange={(e) => setDestinationLng(e.target.value)}
                    placeholder="Station Map Coordinate (Longitude)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {/* <button 
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-yellow-500 text-white py-3 px-4 rounded-md text-sm font-medium hover:from-green-700 hover:to-yellow-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock size={16} />
                    Confirm Loading & Activate Lock
                  </button> */}
                  <button
                    onClick={handleCreateLoading}
                    disabled={createStatus.loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    {createStatus.loading ? 'Creating…' : 'Create Loading'}
                  </button>
                </div>
                {createStatus.error && (
                  <p className="text-red-600 text-sm mt-2">{createStatus.error}</p>
                )}
                {createStatus.success && (
                  <p className="text-green-600 text-sm mt-2">{createStatus.success}</p>
                )}
              </div>
            </div>

            {/* Today's Loadings Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Today's Loadings</h2>
                <p className="text-sm text-gray-600">Recent loading operations and lock status</p>
              </div>

              <div className="p-4 space-y-3">
                {renderLoadingCards()}
              </div>
            </div>
          </div>
        ) : userRole === 'driver' ? (
          <div className="max-w-2xl">
            {/* My Current Load Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Current Load</h2>
                <p className="text-sm text-gray-600">View your current fuel load details and lock status</p>
              </div>
              <div className="p-4">
                <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{driverCurrentLoad.id}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} />
                          Locked ✓
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">Driver: {driverCurrentLoad.driver}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Product:</span>
                      <div className="font-medium text-gray-900">{driverCurrentLoad.product}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <div className="font-medium text-gray-900">{driverCurrentLoad.quantity}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500">Destination:</span>
                    <div className="font-medium text-gray-900">{driverCurrentLoad.destination}</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium text-gray-900 ml-1">{driverCurrentLoad.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Today's Loadings</h2>
              <p className="text-sm text-gray-600">Recent loading operations and lock status</p>
            </div>
            <div className="p-4 space-y-3">
              {renderLoadingCards()}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Smart Lock Activation</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                This will send a lock command to the tanker's smart lock device. The tanker will be secured and can only be unlocked at the designated destination.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanker:</span>
                  <span className="font-medium text-gray-900">{lockContext.tanker || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product:</span>
                  <span className="font-medium text-gray-900">{lockContext.product || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-medium text-gray-900">{lockContext.destination || '—'}</span>
                </div>
                {lockStatus.error && (
                  <div className="text-red-600 text-xs">{lockStatus.error}</div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (!lockContext.opId) {
                        setLockStatus({ loading: false, error: 'No operation selected to lock.', success: '' })
                        return
                      }
                      const token = localStorage.getItem('auth_token')
                      if (!token) {
                        setLockStatus({ loading: false, error: 'Please log in to activate lock.', success: '' })
                        return
                      }
                      setLockStatus({ loading: true, error: '', success: '' })
                      const res = await fetch(`http://api.pqacms.tfnsolutions.us/api/load-operations/${lockContext.opId}/activate-lock`, {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ confirm: true }),
                      })
                      if (!res.ok) {
                        const txt = await res.text()
                        throw new Error(txt || 'Failed to activate lock')
                      }
                      // Reflect success in cards
                      setDepotLoadings(prev => (Array.isArray(prev) ? prev.map(card => {
                        if (card.opId === lockContext.opId) {
                          return { ...card, status: 'locked', progress: 100 }
                        }
                        return card
                      }) : prev))
                      // Reflect in tanker status map
                      if (lockContext.tankerId) {
                        setTankerStatusMap(prev => ({ ...prev, [lockContext.tankerId]: { ...(prev[lockContext.tankerId] || {}), status: 'locked' } }))
                      }
                      setLockStatus({ loading: false, error: '', success: 'Lock command sent successfully.' })
                      setShowConfirmModal(false)
                      setShowSuccessModal(true)
                    } catch (err) {
                      setLockStatus({ loading: false, error: err?.message || 'Error activating lock', success: '' })
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-yellow-500 rounded-md hover:from-green-700 hover:to-yellow-600 transition-colors"
                >
                  {lockStatus.loading ? 'Activating…' : 'Activate Lock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Lock Activated</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Lock command sent successfully. Device confirmed
              </p>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-yellow-500 rounded-md hover:from-green-700 hover:to-yellow-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingControl