import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Modal({ open, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative bg-white w-[92%] max-w-lg rounded-xl shadow-xl border border-gray-100 max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default function Settings({ open, onClose, device }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('config')
  const [timeout, setTimeoutVal] = useState('30 minutes')
  const [gpsFreq, setGpsFreq] = useState('Every 5 minutes')
  const [tamper, setTamper] = useState(true)
  const [lowBattery, setLowBattery] = useState(true)
  const [remoteLock, setRemoteLock] = useState(true)
  const [fwUpdate, setFwUpdate] = useState('Automatic')
  const [showReassign, setShowReassign] = useState(false)
  const [selectedTanker, setSelectedTanker] = useState('')
  const [tankers, setTankers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lockState, setLockState] = useState('locked')
  const [onlineStatus, setOnlineStatus] = useState(true)
  const [deviceStatus, setDeviceStatus] = useState('active')

  useEffect(() => {
    if (open && device) {
      setLockState(device.status === 'LOCKED' ? 'locked' : 'unlocked')
      setOnlineStatus(device.online)
      setDeviceStatus('active')
      
      const storedTankers = localStorage.getItem('tankers_simple')
      if (storedTankers) {
        try {
          setTankers(JSON.parse(storedTankers))
        } catch (e) {
          console.error('Failed to parse stored tankers:', e)
        }
      }
    }
  }, [open, device])

  const saveConfig = () => {
    const payload = { timeout, gpsFreq, tamper, lowBattery, remoteLock, fwUpdate }
    console.log('Saving configuration for', device?.id, payload)
    onClose && onClose()
  }

  const handleReassignDevice = async () => {
    if (!selectedTanker) {
      setError('Please select a tanker')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/devices/${device?.deviceId || device?.id}/reassign`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tanker_id: selectedTanker }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_role')
          navigate('/')
          return
        }
        let msg = 'Failed to reassign device'
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch (_) {}
        throw new Error(msg)
      }

      setSuccess('Device reassigned successfully!')
      setShowReassign(false)
      setTimeout(() => {
        setSuccess('')
        onClose && onClose()
      }, 1500)
      
    } catch (err) {
      console.error('Device reassignment error:', err)
      setError(err.message || 'Failed to reassign device')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDevice = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const payload = {
        lock_state: lockState,
        online: onlineStatus,
        status: deviceStatus
      }

      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/devices/${device?.deviceId || device?.id}`, {
        method: 'PATCH',
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
        let msg = 'Failed to update device'
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch (_) {}
        throw new Error(msg)
      }

      setSuccess('Device updated successfully!')
      setTimeout(() => {
        setSuccess('')
      }, 2000)
      
    } catch (err) {
      console.error('Device update error:', err)
      setError(err.message || 'Failed to update device')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async () => {
    setDeviceStatus('inactive')
    await handleUpdateDevice()
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  )

  return (
    <Modal open={open}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Device Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <p className="text-xs text-gray-500 mb-4">Configure and manage {device?.id}</p>

        {/* Tabs */}
        <div className="bg-gray-100 rounded-full p-1 flex mb-4">
          <button
            className={`flex-1 px-4 py-2 text-sm rounded-full ${activeTab === 'config' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('config')}
          >
             Device Config
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm rounded-full ${activeTab === 'management' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('management')}
          >
             Device Management
          </button>
        </div>

        {activeTab === 'config' ? (
          <div className="space-y-4">
            {/* Auto-Lock Timeout */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Auto-Lock Timeout (minutes)</p>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200" value={timeout} onChange={(e) => setTimeoutVal(e.target.value)}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>

            {/* GPS Update Frequency */}
            <div>
              <p className="text-xs text-gray-600 mb-1">GPS Update Frequency</p>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200" value={gpsFreq} onChange={(e) => setGpsFreq(e.target.value)}>
                <option>Every 1 minute</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
              </select>
            </div>

            {/* Tamper Alerts */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-800">Tamper Alerts</p>
                <p className="text-xs text-gray-500">Notify on unauthorized access attempts</p>
              </div>
              <Toggle checked={tamper} onChange={setTamper} />
            </div>

            {/* Low Battery Alerts */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-800">Low Battery Alerts</p>
                <p className="text-xs text-gray-500">Alert when battery below 20%</p>
              </div>
              <Toggle checked={lowBattery} onChange={setLowBattery} />
            </div>

            {/* Remote Lock/Unlock */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-800">Remote Lock/Unlock</p>
                <p className="text-xs text-gray-500">Allow remote control via platform</p>
              </div>
              <Toggle checked={remoteLock} onChange={setRemoteLock} />
            </div>

            {/* Firmware Updates */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Firmware Updates</p>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200" value={fwUpdate} onChange={(e) => setFwUpdate(e.target.value)}>
                <option>Automatic</option>
                <option>Manual</option>
                <option>Scheduled</option>
              </select>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">Cancel</button>
              <button onClick={saveConfig} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">Save Configuration</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Assignment */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Assignment</p>
                <p className="text-sm text-gray-800">{device?.tanker || 'TRK-XXXX'}</p>
                <p className="text-xs text-gray-500">Installed: {device?.installed || '—'}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Manufacturer</p>
                <p className="text-sm text-gray-800">SecureLock Pro</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Firmware</p>
                <p className="text-sm text-gray-800">{device?.firmware || 'v2.4.1'}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Battery</p>
                <p className="text-sm text-gray-800">{device?.battery ?? '—'}%</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Signal</p>
                <p className="text-sm text-gray-800">{device?.signal || '—'}</p>
              </div>
            </div>

            {/* Device Status Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm text-gray-800">Lock State</p>
                  <p className="text-xs text-gray-500">Current lock status</p>
                </div>
                <select 
                  value={lockState} 
                  onChange={(e) => setLockState(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-md"
                >
                  <option value="locked">Locked</option>
                  <option value="unlocked">Unlocked</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm text-gray-800">Online Status</p>
                  <p className="text-xs text-gray-500">Device connectivity</p>
                </div>
                <Toggle checked={onlineStatus} onChange={setOnlineStatus} />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm text-gray-800">Device Status</p>
                  <p className="text-xs text-gray-500">Active or inactive</p>
                </div>
                <select 
                  value={deviceStatus} 
                  onChange={(e) => setDeviceStatus(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Update Device Button */}
            <button 
              onClick={handleUpdateDevice}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
            >
              {loading ? 'Updating...' : 'Update Device Status'}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowReassign(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                ↻ Reassign Device
              </button>
              <button 
                onClick={handleDeactivate}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 disabled:bg-red-25"
              >
                ✖ Deactivate
              </button>
            </div>

            {/* Reassign Modal */}
            {showReassign && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-80 max-w-sm">
                  <h3 className="text-lg font-semibold mb-4">Reassign Device</h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">Select Tanker</label>
                    <select 
                      value={selectedTanker} 
                      onChange={(e) => setSelectedTanker(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select tanker</option>
                      {tankers.map((tanker) => (
                        <option key={tanker.id} value={tanker.id}>
                          {tanker.tanker_number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowReassign(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReassignDevice}
                      disabled={loading || !selectedTanker}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:bg-green-300"
                    >
                      {loading ? 'Reassigning...' : 'Reassign'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Note */}
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
              <p>
                Note: Deactivating a device will unassign it from its current tanker. The device can then be reassigned
                to another tanker or kept inactive.
              </p>
            </div>

            <div className="flex items-center">
              <button onClick={onClose} className="ml-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">Close</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}