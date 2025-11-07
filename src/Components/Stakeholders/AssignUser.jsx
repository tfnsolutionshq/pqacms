import React, { useState } from 'react'
import { FaUser, FaUserTie, FaTruck, FaBuilding, FaStore, FaUserCog } from 'react-icons/fa'

function AssignUser({ selectedUser, availableDepots = [], availableStations = [], onClose }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedDepot, setSelectedDepot] = useState('')
  const [selectedStation, setSelectedStation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    { id: 'admin', label: 'Admin', icon: FaUserCog, color: 'text-red-600' },
    { id: 'depot_manager', label: 'Depot Manager', icon: FaUserTie, color: 'text-blue-600' },
    { id: 'station_manager', label: 'Station Manager', icon: FaUser, color: 'text-green-600' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const assignmentData = {
      userId: selectedUser?.id,
      role: selectedRole,
      depot: selectedDepot,
      station: selectedStation
    }
    console.log('Assigning user:', assignmentData)
    setIsLoading(false)
  }

  const getFilteredDepots = () => {
    if (selectedRole === 'depot_manager') {
      return availableDepots.filter(depot => !depot.hasManager)
    }
    return availableDepots
  }

  const getFilteredStations = () => {
    if (selectedRole === 'station_manager') {
      return availableStations.filter(station => !station.hasManager)
    }
    return availableStations.filter(station => station.depot === selectedDepot)
  }

  if (!selectedUser) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>No user selected for assignment</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium text-gray-900">{selectedUser.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{selectedUser.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium text-gray-900">{selectedUser.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium text-gray-900">{selectedUser.location}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    if (!isLoading) {
                      setSelectedRole(role.id)
                      setSelectedDepot('')
                      setSelectedStation('')
                    }
                  }}
                  disabled={isLoading}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={role.color} size={20} />
                  <span className="font-medium text-gray-900">{role.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Depot Selection for Depot Manager */}
        {selectedRole === 'depot_manager' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Depot to Manage</label>
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isLoading}
              required
            >
              <option value="">Choose an available depot</option>
              {getFilteredDepots().map(depot => (
                <option key={depot.id} value={depot.id}>{depot.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Only depots without managers are available
            </p>
          </div>
        )}

        {/* Station Selection for Station Manager */}
        {selectedRole === 'station_manager' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Station to Manage</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              disabled={isLoading}
              required
            >
              <option value="">Choose an available station</option>
              {getFilteredStations().map(station => (
                <option key={station.id} value={station.id}>{station.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Only stations without managers are available
            </p>
          </div>
        )}

        {/* Depot Selection for Driver */}
        {selectedRole === 'driver' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Depot Assignment</label>
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              disabled={isLoading}
              required
            >
              <option value="">Choose a depot</option>
              {availableDepots.map(depot => (
                <option key={depot.id} value={depot.id}>{depot.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Multiple drivers can be assigned to one depot
            </p>
          </div>
        )}

        {/* Role Permissions */}
        {selectedRole && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Role Permissions</h4>
            <div className="space-y-2">
              {selectedRole === 'admin' && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Full system administration and configuration
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Create and manage all users and roles
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Create and delete depots, stations, and infrastructure
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Access all system analytics and reports
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Manage system settings and security policies
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Override all operational decisions and approvals
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Access audit logs and compliance reports
                  </div>
                </>
              )}
              {selectedRole === 'depot_manager' && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Create and manage multiple depots and stations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Edit depot configurations and settings
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Assign and reassign station managers
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Create and assign drivers to stations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Monitor and approve waybill operations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Access fleet analytics and performance reports
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Manage device assignments and diagnostics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Issue and verify quality certificates
                  </div>
                </>
              )}
              {selectedRole === 'station_manager' && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Manage assigned station operations and settings
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Create and edit waybills for station deliveries
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Update trip statuses and delivery confirmations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Monitor and approve station trip history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Coordinate driver schedules and assignments
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Access station performance and inventory data
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Issue quality certificates for station products
                  </div>
                </>
              )}
              {selectedRole === 'driver' && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Execute delivery trips between depots and stations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    View and update personal trip history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Update trip status and delivery confirmations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Access assigned tanker information and diagnostics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Report device issues and maintenance needs
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    View waybill details for assigned trips
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !selectedRole || 
              (selectedRole === 'depot_manager' && !selectedDepot) ||
              (selectedRole === 'station_manager' && !selectedStation) ||
              (selectedRole === 'driver' && !selectedDepot)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Assigning...' : 'Assign Role'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssignUser