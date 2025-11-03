import React, { useState, useEffect } from 'react'
import { Search, Clock, CheckCircle, XCircle, MapPin, AlertTriangle, Copy, Eye, X, Users, Building2, Plus } from 'lucide-react'

function UnlockCodeRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [userRole, setUserRole] = useState('depot-manager') // 'depot-manager' or 'station-manager'
  const [selectedStation] = useState('MRS Filling Station, Ikoyi') // For station manager
  
  // Modal statesre
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showRequestUnlockModal, setShowRequestUnlockModal] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [reasonToView, setReasonToView] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedTanker, setSelectedTanker] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  // Station Manager new request inputs
  const [tankerOptions, setTankerOptions] = useState([])
  const [selectedTankerId, setSelectedTankerId] = useState('')
  const [newDestination, setNewDestination] = useState('')
  const [newNote, setNewNote] = useState('')
  const [posting, setPosting] = useState(false)

  // Sample data for unlock requests
  const unlockRequests = [
    {
      id: 'REQ-2401',
      tanker: 'TRK-2045',
      driver: 'John Adeyemi',
      destination: 'MRS Filling Station, Ikoyi',
      distance: '8km',
      status: 'pending',
      code: null,
      actions: ['Verify & Approve', 'Reject'],
      station: 'MRS Filling Station, Ikoyi',
      requestedBy: 'Station Manager - Lagos Depot'
    },
    {
      id: 'REQ-2402',
      tanker: 'TRK-3012',
      driver: 'Sarah Ibrahim',
      destination: 'Total Station, Wuse',
      distance: '5km',
      status: 'approved',
      code: 'TF-45892',
      actions: ['Copy Code'],
      station: 'Total Station, Wuse',
      requestedBy: 'Station Manager - Abuja Depot'
    },
    {
      id: 'REQ-2403',
      tanker: 'TRK-1874',
      driver: 'Michael Okafor',
      destination: 'Oando Station, Benin',
      distance: '200km',
      status: 'rejected',
      code: null,
      actions: ['View Reason'],
      station: 'Oando Station, Benin',
      requestedBy: 'Station Manager - Benin Depot'
    },
    {
      id: 'REQ-2404',
      tanker: 'TRK-1205',
      driver: 'Fatima Hassan',
      destination: 'MRS Filling Station, Ikoyi',
      distance: '12km',
      status: 'pending',
      code: null,
      actions: ['Verify & Approve', 'Reject'],
      station: 'MRS Filling Station, Ikoyi',
      requestedBy: 'Station Manager - Lagos Depot'
    }
  ]

  const stationManagerRequests = [
    {
      id: 'REQ-2401',
      tanker: 'TRK-2045',
      driver: 'John Adeyemi',
      destination: 'MRS Filling Station, Ikoyi',
      distance: '8m',
      status: 'pending',
      code: null,
      actions: ['Send Reminder']
    },
    {
      id: 'REQ-2402',
      tanker: 'TRK-3012',
      driver: 'Sarah Ibrahim',
      destination: 'Total Station, Wuse',
      distance: '6m',
      status: 'approved',
      code: 'TF-45892',
      actions: ['Copy Code']
    },
    {
      id: 'REQ-2403',
      tanker: 'TRK-1874',
      driver: 'Michael Okafor',
      destination: 'Oando Station, Benin',
      distance: '2500m',
      status: 'rejected',
      code: null,
      actions: ['View Reason']
    }
  ]

  // Available tankers for Station Manager
  const availableTankers = [
    {
      id: 'TRK-2045',
      driver: 'John Adeyemi',
      plateNumber: 'LAG-2045-KY',
      product: 'Petrol',
      quantity: '30,000 Liters',
      destination: 'MRS Filling Station, Ikoyi',
      isLoaded: true
    },
    {
      id: 'TRK-3012',
      driver: 'Sarah Ibrahim',
      plateNumber: 'ABJ-7823-ZK',
      product: 'Diesel',
      quantity: '33,000 Liters',
      destination: 'Total Station, Wuse',
      isLoaded: true
    },
    {
      id: 'TRK-4521',
      driver: 'Ahmed Hassan',
      plateNumber: 'ABJ-4521-LL',
      product: 'Petrol',
      quantity: '25,000 Liters', 
      destination: 'Total Station, Wuse',
      isLoaded: true
    },
    {
      id: 'TRK-7890',
      driver: 'Grace Okoro',
      plateNumber: 'ABJ-7890-GK',
      product: 'Kerosene',
      quantity: '20,000 Liters',
      destination: 'Total Station, Wuse', 
      isLoaded: true
    }
  ]

  // Compute actions based on status/code
  const getActions = (status, code) => {
    if (status === 'pending') return ['Verify & Approve', 'Reject']
    if (status === 'approved' && code) return ['Copy Code']
    if (status === 'rejected') return ['View Reason']
    return []
  }

  // Fetch unlock requests
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`http://api.pqacms.tfnsolutions.us/api/unlock-requests?page=${currentPage}`,
          {
            headers: {
              Accept: 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            signal: controller.signal
          }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const mapped = (json.data || []).map((item) => ({
          id: item.id,
          tanker: item?.tanker?.tanker_number || item.tanker_id || '—',
          driver: item?.tanker?.driver_id || '',
          destination: item.destination || '',
          distance: '-',
          status: item.status || 'pending',
          code: item.code || null,
          rejectedReason: item.rejected_reason || null,
          actions: getActions(item.status, item.code)
        }))
        setRequests(mapped)
        setLastPage(json.last_page ?? 1)
        setTotal(json.total ?? mapped.length)
      } catch (e) {
        setError('Failed to load unlock requests')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [currentPage])

  // Filter requests: station manager sees all, depot manager sees all
  const getFilteredRequests = () => {
    const base = requests.length ? requests : unlockRequests
    return base
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700'
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDistanceColor = (distance) => {
    const numericDistance = parseInt(distance)
    if (isNaN(numericDistance)) return 'text-gray-600'
    if (numericDistance <= 10) return 'text-green-600'
    if (numericDistance <= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredRequests = getFilteredRequests().filter(request =>
    (request.tanker || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.driver || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.destination || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get statistics based on filtered data
  const getStats = () => {
    const data = getFilteredRequests()
    return {
      pending: data.filter(r => r.status === 'pending').length,
      approved: data.filter(r => r.status === 'approved').length,
      rejected: data.filter(r => r.status === 'rejected').length
    }
  }

  // Handler functions
  const handleApprove = (request) => {
    setSelectedRequest(request)
    setShowApproveModal(true)
  }

  const handleReject = (request) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  const handleConfirmApprove = async () => {
    const token = localStorage.getItem('auth_token')
    if (!selectedRequest?.id) {
      setShowApproveModal(false)
      setSuccessMessage('No request selected for approval')
      setShowSuccessModal(true)
      return
    }
    if (!token) {
      setShowApproveModal(false)
      setSuccessMessage('Not authenticated: please login to approve requests')
      setShowSuccessModal(true)
      return
    }
    try {
      const res = await fetch(`http://api.pqacms.tfnsolutions.us/api/unlock-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      let codeFromResponse = null
      try {
        const json = await res.json()
        codeFromResponse = json?.code || null
      } catch (_) {
        // non-JSON or empty body
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Update local list optimistically
      setRequests((prev) => prev.map((r) => r.id === selectedRequest.id
        ? { ...r, status: 'approved', code: codeFromResponse ?? r.code, actions: getActions('approved', codeFromResponse ?? r.code) }
        : r
      ))
      setShowApproveModal(false)
      setSuccessMessage('Request approved successfully')
      setShowSuccessModal(true)
    } catch (e) {
      setShowApproveModal(false)
      setSuccessMessage('Failed to approve request')
      setShowSuccessModal(true)
    }
  }

  const handleConfirmReject = async () => {
    const token = localStorage.getItem('auth_token')
    if (!selectedRequest?.id) {
      setShowRejectModal(false)
      setSuccessMessage('No request selected for rejection')
      setShowSuccessModal(true)
      return
    }
    if (!rejectionReason.trim()) {
      setSuccessMessage('Please provide a rejection reason')
      setShowSuccessModal(true)
      return
    }
    if (!token) {
      setShowRejectModal(false)
      setSuccessMessage('Not authenticated: please login to reject requests')
      setShowSuccessModal(true)
      return
    }
    try {
      const res = await fetch(`http://api.pqacms.tfnsolutions.us/api/unlock-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ approve: false, reason: rejectionReason.trim() })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Update local list optimistically
      setRequests((prev) => prev.map((r) => r.id === selectedRequest.id
        ? { ...r, status: 'rejected', code: null, rejectedReason: rejectionReason.trim(), actions: getActions('rejected', null) }
        : r
      ))
      setShowRejectModal(false)
      setSuccessMessage('Request rejected successfully')
      setShowSuccessModal(true)
      setRejectionReason('')
    } catch (e) {
      setShowRejectModal(false)
      setSuccessMessage('Failed to reject request')
      setShowSuccessModal(true)
    }
  }

  const handleNewRequest = () => {
    setSelectedRequest(null)
    setSelectedTanker(null)
    setSelectedTankerId('')
    setNewDestination('')
    setNewNote('')
    setShowRequestUnlockModal(true)
  }

  const handleRoleSwitch = (role) => {
    setUserRole(role)
    setSearchQuery('') // Clear search when switching roles
  }

  const handleActionClick = (action, request) => {
    // Role-based permission check
    if (userRole === 'station-manager' && (action === 'Verify & Approve' || action === 'Reject')) {
      setSuccessMessage('Access denied: Only Depot Managers can approve or reject requests')
      setShowSuccessModal(true)
      return
    }

    switch (action) {
      case 'Verify & Approve':
        handleApprove(request)
        break
      case 'Reject':
        handleReject(request)
        break
      case 'Copy Code':
        navigator.clipboard.writeText(request.code)
        setSuccessMessage('Code copied to clipboard')
        setShowSuccessModal(true)
        break
      case 'Send Reminder':
        setSuccessMessage('Reminder sent successfully')
        setShowSuccessModal(true)
        break
      case 'View Reason':
        setReasonToView(request.rejectedReason || 'No rejection reason provided')
        setShowReasonModal(true)
        break
      default:
        break
    }
  }

  const handleTankerSelect = (tankerId) => {
    setSelectedTankerId(tankerId)
    const tanker = (tankerOptions.find(t => t.id === tankerId) || availableTankers.find(t => t.id === tankerId))
    setSelectedTanker(tanker || null)
  }

  const handleSubmitUnlockRequest = async () => {
    if (!selectedTankerId) {
      setSuccessMessage('Please select a tanker first')
      setShowSuccessModal(true)
      return
    }
    if (!newDestination.trim()) {
      setSuccessMessage('Please enter a destination')
      setShowSuccessModal(true)
      return
    }
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setSuccessMessage('Not authenticated: please login to submit unlock request')
      setShowSuccessModal(true)
      return
    }
    try {
      setPosting(true)
      const res = await fetch('http://api.pqacms.tfnsolutions.us/api/unlock-requests', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tanker_id: selectedTankerId,
          destination: newDestination,
          note: newNote
        })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      setShowRequestUnlockModal(false)
      setSelectedTanker(null)
      setSelectedRequest(null)
      setSelectedTankerId('')
      setNewDestination('')
      setNewNote('')
      setSuccessMessage('Unlock code request submitted successfully!')
      setShowSuccessModal(true)
      // Optionally refresh list
      setCurrentPage(1)
    } catch (e) {
      setSuccessMessage('Failed to submit unlock request')
      setShowSuccessModal(true)
    } finally {
      setPosting(false)
    }
  }

  // Fetch tanker list when opening the New Request modal as Station Manager
  useEffect(() => {
    if (!showRequestUnlockModal || userRole !== 'station-manager') return
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const controller = new AbortController()
    async function loadTankers() {
      try {
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/tankers', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const mapped = (json.data || json || []).map(t => ({
          id: t.id,
          tanker_number: t.tanker_number || t.number || t.id,
          device_id: t.device_id || '',
          status: t.status || ''
        }))
        setTankerOptions(mapped)
        if (mapped.length && !selectedTankerId) {
          setSelectedTankerId(mapped[0].id)
          setSelectedTanker(mapped[0])
        }
      } catch (e) {
        // keep fallback availableTankers
      }
    }
    loadTankers()
    return () => controller.abort()
  }, [showRequestUnlockModal, userRole])

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Role Switcher */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {userRole === 'depot-manager' ? 'Unlock Code Requests - Depot Manager' : 'Unlock Code Requests - Station Manager'}
              </h1>
              <p className="text-sm text-gray-600">
                {userRole === 'depot-manager' 
                  ? 'Manage GPS-verified unlock code requests for tanker deliveries across all stations'
                  : `Manage unlock requests for ${selectedStation}`
                }
              </p>
            </div>
            
            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleRoleSwitch('depot-manager')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  userRole === 'station-manager'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4" />
                Station Manager
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{getStats().pending}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">{getStats().approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Today</p>
                <p className="text-2xl font-bold text-gray-900">{getStats().rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                {userRole === 'depot-manager' ? 'Search Requests' : 'My Station Requests'}
              </h3>
              {userRole === 'station-manager' && (
                <button
                  onClick={handleNewRequest}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Request
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={userRole === 'depot-manager' 
                  ? "Search by tanker ID, driver name, or station..." 
                  : "Search by tanker ID or driver name..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Unlock Requests</h3>
            <p className="text-sm text-gray-600">GPS-verified unlock code management</p>
            {loading && (
              <p className="text-sm text-gray-500 mt-2">Loading requests…</p>
            )}
            {error && requests.length === 0 && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th> */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanker</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">No unlock requests found.</td>
                  </tr>
                )}
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    {/* <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.id}</span>
                    </td> */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.tanker}</div>
                        {/* <div className="text-sm text-gray-500">{request.driver}</div> */}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{request.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {parseInt(request.distance) > 50 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-medium ${getDistanceColor(request.distance)}`}>
                          {request.distance}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {request.code ? (
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {request.code}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {userRole === 'depot-manager' ? (
                          // Depot Manager actions
                          request.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action, request)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                action === 'Verify & Approve'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : action === 'Reject'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : action === 'Copy Code'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {action === 'Copy Code' && <Copy className="w-3 h-3 inline mr-1" />}
                              {action === 'View Reason' && <Eye className="w-3 h-3 inline mr-1" />}
                              {action}
                            </button>
                          ))
                        ) : (
                          <>
                            {request.status === 'pending' && (
                              <button
                                onClick={() => handleActionClick('Send Reminder', request)}
                                className="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                Send Reminder
                              </button>
                            )}
                            {request.status === 'approved' && request.code && (
                              <button
                                onClick={() => handleActionClick('Copy Code', request)}
                                className="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                              >
                                <Copy className="w-3 h-3 inline mr-1" />
                                Copy Code
                              </button>
                            )}
                            {request.status === 'rejected' && (
                              <button
                                onClick={() => handleActionClick('View Reason', request)}
                                className="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                <Eye className="w-3 h-3 inline mr-1" />
                                View Reason
                              </button>
                            )}
                            {request.status !== 'pending' && !(request.status === 'approved' && request.code) && request.status !== 'rejected' && (
                              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-50 rounded-md">
                                Pending Review
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">Showing page {currentPage} of {lastPage} · Total {total}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className={`px-3 py-1 text-xs rounded-md border ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                disabled={currentPage >= lastPage}
                className={`px-3 py-1 text-xs rounded-md border ${currentPage >= lastPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Verification Success Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Verification Successful</h3>
                <p className="text-sm text-gray-600">Tanker location verified. Unlock code generated.</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tanker:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.tanker}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium text-green-600">8m from destination</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Unlock Code</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                    TF-93439
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This code has been sent to the Station Manager and Driver via SMS and in-app notification.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('TF-93439')
                    setSuccessMessage('Code copied to clipboard')
                    setShowApproveModal(false)
                    setShowSuccessModal(true)
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={handleConfirmApprove}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Unlock Request</h3>
                <p className="text-sm text-gray-600">Please provide a reason for rejecting this request. This will be sent to the requester.</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Request ID:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tanker:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.tanker}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.driver}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Requested By:</span>
                  <span className="font-medium text-gray-900">Station Manager - Lagos Depot</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this unlock request..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Common reasons: Vehicle not at destination, GPS verification failed, Security concern, etc.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Unlock Code Modal (triggered from New Request) */}
      {showRequestUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Request Unlock Code</h3>
                  <p className="text-sm text-gray-600">Select the loaded tanker at your destination to request unlock code. GPS verification required.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRequestUnlockModal(false)
                  setSelectedTanker(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tanker <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTanker?.id || ''}
                  onChange={(e) => handleTankerSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a loaded tanker..</option>
                  {(tankerOptions.length ? tankerOptions : availableTankers).map((t) => (
                    <option key={t.id} value={t.id}>
                      {(t.tanker_number || t.id)}
                      {t.plateNumber ? ` • ${t.plateNumber}` : ''}
                      {t.driver ? ` • ${t.driver}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTanker && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-yellow-800">Loaded Tanker Details</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">Verify information before requesting</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Product:</span>
                      <p className="text-gray-900">{selectedTanker.product}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>
                      <p className="text-gray-900">{selectedTanker.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Destination:</span>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-900">{selectedTanker.destination}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Driver:</span>
                    <p className="text-gray-900">{selectedTanker.driver}</p>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-blue-800">GPS Verification Required:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">You must be within 10 meters of the destination to request unlock code.</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter delivery destination (e.g., MRS Filling Station, Ikoyi)"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="Any additional information about this delivery..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRequestUnlockModal(false)
                  setSelectedTanker(null)
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUnlockRequest}
                disabled={posting}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-md hover:from-green-600 hover:to-yellow-600 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify & Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rejection Reason</h3>
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{reasonToView}</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-sm text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
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

export default UnlockCodeRequests