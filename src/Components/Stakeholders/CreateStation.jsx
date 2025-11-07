import React, { useState, useEffect } from 'react'
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

function CreateStation({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    depot_id: '',
    location: '',
    address: '',
    storage_capacity_liters: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [depots, setDepots] = useState([])
  const [depotsLoading, setDepotsLoading] = useState(true)

  useEffect(() => {
    const fetchDepots = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/depots', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          setDepots(data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch depots:', err)
      } finally {
        setDepotsLoading(false)
      }
    }
    
    fetchDepots()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('auth_token')
      const payload = {
        depot_id: formData.depot_id,
        name: formData.name,
        code: formData.code,
        location: formData.location || null,
        address: formData.address || null,
        storage_capacity_liters: formData.storage_capacity_liters ? parseInt(formData.storage_capacity_liters) : null
      }
      
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/stations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Failed to create station')
      }
      
      const result = await res.json()
      setSuccess('Station created successfully!')
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to create station')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Station Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
            placeholder="Victoria Island Station"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Station Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
            placeholder="VI-STA"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Parent Depot</label>
          <select
            name="depot_id"
            value={formData.depot_id}
            onChange={handleChange}
            disabled={isLoading || depotsLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
            required
          >
            <option value="">{depotsLoading ? 'Loading depots...' : 'Select depot'}</option>
            {depots.map(depot => (
              <option key={depot.id} value={depot.id}>{depot.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Storage Capacity (L)</label>
          <input
            type="number"
            name="storage_capacity_liters"
            value={formData.storage_capacity_liters}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
            placeholder="120000"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="Victoria Island, Lagos"
          required
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="Full address"
          rows={2}
        />
      </div>
      
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>
      )}
      
      {success && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">{success}</div>
      )}
      
      <div className="flex justify-end gap-2 pt-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Station'}
        </button>
      </div>
    </form>
  )
}

export default CreateStation