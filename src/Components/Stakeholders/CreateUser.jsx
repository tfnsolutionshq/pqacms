import React, { useState } from 'react'

function CreateUser({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('https://api.pqacms.tfnsolutions.us/api/auth/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(true)
        onSubmit(data.user)
        setTimeout(() => onClose(), 2000)
      } else {
        setError(data.message || 'Failed to create user')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="user@example.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="+234 800 000 0000"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="Enter password (min 8 characters)"
          required
          minLength={8}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          placeholder="Confirm password"
          required
          minLength={8}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">✅ User created successfully!</p>
        </div>
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
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default CreateUser