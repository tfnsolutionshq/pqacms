import React, { useMemo, useState, useEffect } from 'react'
import { FaLock, FaUnlock, FaWifi, FaBatteryHalf, FaSyncAlt, FaTools } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import RegisterDevice from './RegisterDevice'
import DeviceDiagnosis from './DeviceDiagnosis'
import Settings from './Settings'

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <FaLock className="text-white" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function BatteryBar({ percent }) {
  const width = Math.max(0, Math.min(100, percent))
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${width}%` }} />
    </div>
  )
}

function DeviceCard({ device, onDiagnostics, onSettings }) {
  const isLocked = device.status === 'LOCKED'
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 text-white rounded-lg flex items-center justify-center">
            {isLocked ? <FaLock /> : <FaUnlock />}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{device.id}</p>
            <p className="text-xs text-gray-500">{device.tanker}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">{device.online ? 'ONLINE' : 'OFFLINE'}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Battery</p>
          <BatteryBar percent={device.battery} />
          <p className="mt-2 text-xs text-gray-600 flex items-center gap-2"><FaBatteryHalf /> {device.battery}%</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Signal</p>
          <p className="text-sm text-gray-800 flex items-center gap-2"><FaWifi /> {device.signal}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Lock Status</p>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{device.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div>
          <p className="text-xs text-gray-500">Firmware</p>
          <p className="text-sm text-gray-800">{device.firmware}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Ping</p>
          <p className="text-sm text-gray-800">{device.lastPing}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Installed</p>
          <p className="text-sm text-gray-800">{device.installed}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={() => onDiagnostics && onDiagnostics(device)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
          <FaTools className="text-gray-700" /> Diagnostics
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
          <FaSyncAlt className="text-gray-700" /> Sync
        </button>
        <button onClick={() => onSettings && onSettings(device)} className="ml-auto px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">⚙️</button>
      </div>
    </div>
  )
}

export default function DeviceManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showRegister, setShowRegister] = useState(false)
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [devices, setDevices] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/devices', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_role')
            navigate('/')
            return
          }
          throw new Error('Failed to load devices')
        }
        
        const data = await res.json()
        setStats(data.stats || {})
        
        const formattedDevices = data.devices?.data?.map(device => ({
          id: device.device_code,
          deviceId: device.id,
          tanker: device.tanker?.tanker_number || 'N/A',
          online: device.online,
          battery: device.battery_percent,
          signal: device.signal_quality,
          status: device.lock_state === 'locked' ? 'LOCKED' : 'UNLOCKED',
          firmware: device.firmware_version,
          lastPing: device.last_sync_at ? new Date(device.last_sync_at).toLocaleString('en-GB', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Never',
          installed: device.installed_at ? new Date(device.installed_at).toLocaleDateString('en-GB') : 'N/A',
        })) || []
        
        setDevices(formattedDevices)
      } catch (err) {
        setError('Failed to load devices')
        console.error('Devices fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDevices()
  }, [])

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch = (d.id + ' ' + d.tanker).toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Locked' && d.status === 'LOCKED') ||
        (statusFilter === 'Unlocked' && d.status === 'UNLOCKED') ||
        (statusFilter === 'Offline' && !d.online)
      return matchesSearch && matchesStatus
    })
  }, [devices, search, statusFilter])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
        <p className="text-sm text-gray-500">IoT smart lock hardware monitoring and control</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Devices" value={stats.total_devices || '0'} subtitle="Registered devices" color="bg-gray-800" />
        <StatCard title="Active & Online" value={stats.active_online || '0'} subtitle="Currently online" color="bg-green-500" />
        <StatCard title="Low Battery" value={stats.low_battery || '0'} subtitle="Needs charging" color="bg-orange-500" />
        <StatCard title="Offline Devices" value={stats.offline_devices || '0'} subtitle="Requires attention" color="bg-red-500" />
      </div>

      {/* Search and filter */}
      <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Device ID or Tanker..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option>All Status</option>
          <option>Locked</option>
          <option>Unlocked</option>
          <option>Offline</option>
        </select>
        <button onClick={() => setShowRegister(true)} className="ml-auto px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Register Device</button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-gray-600 text-sm mt-6">Loading devices...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-sm mt-6">{error}</div>
      )}

      {/* Device cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && !error && filtered.length === 0 && (
          <div className="col-span-2 text-center text-gray-600 text-sm">No devices found</div>
        )}
        {filtered.map((d) => (
          <DeviceCard
            key={d.id}
            device={d}
            onDiagnostics={(dev) => { setSelectedDevice(dev); setShowDiagnosis(true) }}
            onSettings={(dev) => { setSelectedDevice(dev); setShowSettings(true) }}
          />
        ))}
      </div>

      {/* Register Device Modal */}
      <RegisterDevice
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={(payload) => {
          // For now, just log; real API integration can be added later
          console.log('Registered device payload:', payload)
        }}
      />

      {/* Device Diagnosis Modal */}
      <DeviceDiagnosis
        open={showDiagnosis}
        onClose={() => setShowDiagnosis(false)}
        device={selectedDevice}
      />

      {/* Settings Modal */}
      <Settings
        open={showSettings}
        onClose={() => setShowSettings(false)}
        device={selectedDevice}
      />
    </div>
  )
}