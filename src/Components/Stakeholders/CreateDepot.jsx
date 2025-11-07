import React, { useState } from 'react'
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

function CreateDepot({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    address: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/depots', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Failed to create depot')
      }
      
      const result = await res.json()
      setSuccess('Depot created successfully!')
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to create depot')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Depot Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Port Harcourt Main Depot"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Depot Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="PHC-MAIN"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Port Harcourt, Rivers State"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Full address of the depot"
          rows={3}
        />
      </div>
      

      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
      )}
      
      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>
      )}
      
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
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Depot'}
        </button>
      </div>
    </form>
  )
}

export default CreateDepot