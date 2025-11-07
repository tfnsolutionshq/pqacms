import React, { useState } from 'react'

function Assignwithapi({ user, onClose, onSuccess }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'depot_manager', label: 'Depot Manager' },
    { value: 'station_manager', label: 'Station Manager' }
  ]

  const handleAssign = async () => {
    if (!selectedRole) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/auth/assign-role', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          role: selectedRole
        })
      })

      if (res.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_name')
        window.location.assign('/')
        return
      }

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to assign role')
      }

      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to assign role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assign Role</h3>
        <p className="text-sm text-gray-600">Assign a role to {user.name}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Select Role --</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Assigning...' : 'Assign Role'}
        </button>
      </div>
    </div>
  )
}

export default Assignwithapi