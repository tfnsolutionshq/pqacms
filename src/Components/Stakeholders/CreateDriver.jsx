import React, { useState } from 'react'
import { FaTruck, FaUser, FaPhone, FaEnvelope, FaIdCard } from 'react-icons/fa'

function CreateDriver({ onClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expires_at: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
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
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/drivers', {
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
        throw new Error(data?.message || 'Failed to create driver')
      }
      
      const result = await res.json()
      setSuccess('Driver created successfully!')
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to create driver')
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
          <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="Ahmed"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="Hassan"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="ahmed@driver.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="+234 800 000 0000"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">License Number</label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="DL123456789"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">License Expiry</label>
          <input
            type="date"
            name="license_expires_at"
            value={formData.license_expires_at}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
          placeholder="Residential address"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Contact</label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="Contact name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Phone</label>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
            placeholder="+234 800 000 0000"
          />
        </div>
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
          className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Driver'}
        </button>
      </div>
    </form>
  )
}

export default CreateDriver