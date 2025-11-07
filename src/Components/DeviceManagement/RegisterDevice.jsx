import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Modal({ open, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-xl border border-gray-100 max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default function RegisterDevice({ open, onClose, onRegistered }) {
  const navigate = useNavigate()
  const [deviceCode, setDeviceCode] = useState('')
  const [tankerId, setTankerId] = useState('')
  const [manufacturer, setManufacturer] = useState('SecureLock Pro')
  const [firmware, setFirmware] = useState('v2.4.1')
  const [installedAt, setInstalledAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tankers, setTankers] = useState([])

  useEffect(() => {
    if (open) {
      const storedTankers = localStorage.getItem('tankers_simple')
      if (storedTankers) {
        try {
          setTankers(JSON.parse(storedTankers))
        } catch (e) {
          console.error('Failed to parse stored tankers:', e)
        }
      }
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!deviceCode.trim()) {
      setError('Please enter a Device Code')
      return
    }
    
    setSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const payload = {
        device_code: deviceCode.trim(),
        tanker_id: tankerId || null,
        manufacturer: manufacturer || null,
        firmware_version: firmware || null,
        installed_at: installedAt ? new Date(installedAt).toISOString() : null
      }

      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/devices', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_role')
          navigate('/')
          return
        }
        let msg = 'Failed to register device'
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch (_) {}
        throw new Error(msg)
      }

      const result = await res.json()
      setSuccess('Device registered successfully!')
      onRegistered && onRegistered(result)
      
      setTimeout(() => {
        setDeviceCode('')
        setTankerId('')
        setManufacturer('SecureLock Pro')
        setFirmware('v2.4.1')
        setInstalledAt('')
        setSuccess('')
        onClose && onClose()
      }, 1500)
      
    } catch (err) {
      setError(err.message || 'Failed to register device')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Register Smart Lock Device</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <p className="text-xs text-gray-500 mb-4">Add new IoT lock device to the system</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-700 mb-1">Device Code *</label>
          <input
            className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200"
            placeholder="DEV-LOC-XXXX"
            value={deviceCode}
            onChange={(e) => setDeviceCode(e.target.value)}
            required
          />

          <label className="block text-sm text-gray-700 mb-1">Assign to Tanker</label>
          <select
            className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200"
            value={tankerId}
            onChange={(e) => setTankerId(e.target.value)}
          >
            <option value="">Select tanker (optional)</option>
            {tankers.map((tanker) => (
              <option key={tanker.id} value={tanker.id}>
                {tanker.tanker_number}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-700 mb-1">Manufacturer</label>
          <select
            className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          >
            <option>SecureLock Pro</option>
            <option>LockMaster</option>
            <option>SafeTech</option>
          </select>

          <label className="block text-sm text-gray-700 mb-1">Firmware Version</label>
          <input
            className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200"
            placeholder="v2.4.1"
            value={firmware}
            onChange={(e) => setFirmware(e.target.value)}
          />

          <label className="block text-sm text-gray-700 mb-1">Installation Date</label>
          <input
            type="date"
            className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200"
            value={installedAt}
            onChange={(e) => setInstalledAt(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">
              {submitting ? 'Registering...' : 'Register Device'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}