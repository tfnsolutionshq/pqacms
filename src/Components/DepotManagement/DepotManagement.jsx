import React, { useState, useEffect } from 'react'
import { FaBuilding, FaPlus, FaSearch, FaDownload, FaUpload, FaEdit, FaTrash, FaEye, FaMapMarkerAlt, FaUsers, FaTruck, FaFilter, FaSort } from 'react-icons/fa'
import CreateDepot from '../Stakeholders/CreateDepot'

function DepotManagement() {
  const [depots, setDepots] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDepot, setSelectedDepot] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchDepots()
  }, [])

  const fetchDepots = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/depots', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_name')
        window.location.assign('/')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setDepots(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch depots:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (depotId) => {
    if (!confirm('Are you sure you want to delete this depot?')) return
    
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/depots/${depotId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        fetchDepots()
      }
    } catch (err) {
      console.error('Failed to delete depot:', err)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Code', 'Location', 'Status', 'Created At'],
      ...filteredDepots.map(depot => [
        depot.name,
        depot.code,
        depot.location,
        'Active',
        new Date(depot.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'depots.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',')
      
      // Process CSV data here
      console.log('Importing depots from CSV:', { headers, lines })
      alert('Import functionality would be implemented here')
    }
    reader.readAsText(file)
  }

  const filteredDepots = depots
    .filter(depot => 
      depot.name.toLowerCase().includes(search.toLowerCase()) ||
      depot.code.toLowerCase().includes(search.toLowerCase()) ||
      depot.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || ''
      const bVal = b[sortBy] || ''
      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal)
      }
      return bVal.localeCompare(aVal)
    })

  const getStats = () => {
    return {
      total: depots.length,
      active: depots.length, // Assuming all are active
      withManagers: Math.floor(Math.random() * depots.length) + 1,
      stations: Math.floor(Math.random() * 50) + 15
    }
  }

  const stats = getStats()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Depot Management</h1>
            <p className="text-sm text-gray-600">Manage fuel depots, locations, and operations</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              <FaUpload size={14} />
              Import
            </label>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaDownload size={14} />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <FaPlus size={14} />
              Add Depot
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Depots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaBuilding className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Depots</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FaBuilding className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">With Managers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.withManagers}</p>
            </div>
            <FaUsers className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stations</p>
              <p className="text-2xl font-bold text-orange-600">{stats.stations}</p>
            </div>
            <FaTruck className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search depots by name, code, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
              <option value="location">Sort by Location</option>
              <option value="created_at">Sort by Date</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaSort className={sortOrder === 'desc' ? 'transform rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Depots Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Depots ({filteredDepots.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading depots...</p>
          </div>
        ) : filteredDepots.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaBuilding className="mx-auto text-4xl mb-4 text-gray-300" />
            <p>No depots found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredDepots.map((depot) => (
              <div key={depot.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{depot.name}</h4>
                      <p className="text-sm text-gray-500">{depot.code}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{depot.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaTruck className="text-gray-400" />
                    <span>Capacity: {(depot.capacity || 0).toLocaleString()}L</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDepot(depot)
                      setShowDetailsModal(true)
                    }}
                    className="flex-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(depot.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Depot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create New Depot</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CreateDepot onClose={() => { setShowCreateModal(false); fetchDepots(); }} />
          </div>
        </div>
      )}

      {/* Depot Details Modal */}
      {showDetailsModal && selectedDepot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Depot Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Depot Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedDepot.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Depot Code</label>
                  <p className="text-gray-900">{selectedDepot.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedDepot.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">Active</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Capacity</label>
                  <p className="text-gray-900">{(selectedDepot.capacity || 0).toLocaleString()} Liters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-gray-900">{new Date(selectedDepot.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedDepot.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Active Tankers</h4>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Today's Loadings</h4>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900">Stations</h4>
                  <p className="text-2xl font-bold text-orange-600">{Math.floor(Math.random() * 8) + 9}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepotManagement