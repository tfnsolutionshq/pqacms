import React, { useState, useEffect } from 'react'
import { FaTimes, FaQrcode } from 'react-icons/fa'

export default function IssueNewWayBill({ isOpen, onClose, onIssue }) {
  const [form, setForm] = useState({
    tanker_id: '',
    driver_id: '',
    origin: '',
    destination: '',
    product_type: '',
    quantity_liters: 33000,
    quality_certificate: '',
    eta_minutes: 30
  })
  const [tankers, setTankers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        
        // Fetch tankers
        const tankersRes = await fetch('https://api.pqacms.tfnsolutions.us/api/tankers', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (tankersRes.ok) {
          const tankersData = await tankersRes.json()
          const tankersList = Array.isArray(tankersData) ? tankersData : tankersData?.data || []
          setTankers(tankersList)
          
          // Extract unique drivers from tankers data
          const driversMap = new Map()
          tankersList.forEach(tanker => {
            if (tanker.driver && tanker.driver.id && tanker.driver.name) {
              driversMap.set(tanker.driver.id, {
                id: tanker.driver.id,
                name: tanker.driver.name
              })
            }
          })
          
          setDrivers(Array.from(driversMap.values()))
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    
    fetchData()
  }, [isOpen])

  const update = (key) => (e) => {
    const value = key === 'quantity_liters' || key === 'eta_minutes' ? parseInt(e.target.value) || 0 : e.target.value
    setForm({ ...form, [key]: value })
  }

  const handleIssue = async () => {
    setError('')
    setLoading(true)
    
    try {
      const token = localStorage.getItem('auth_token')
      // Validate required fields
      if (!form.tanker_id || !form.driver_id || !form.origin || !form.destination || !form.product_type) {
        throw new Error('Please fill in all required fields')
      }
      
      const payload = {
        tanker_id: form.tanker_id,
        driver_id: form.driver_id,
        origin: form.origin,
        destination: form.destination,
        product_type: form.product_type,
        quantity_liters: form.quantity_liters,
        quality_certificate: form.quality_certificate || null,
        issued_at: new Date().toISOString(),
        eta_minutes: form.eta_minutes
      }
      
      console.log('Sending payload:', payload)
      
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/way-bills', {
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
        throw new Error(data?.message || 'Failed to create waybill')
      }
      
      const result = await res.json()
      console.log('Created waybill:', result)
      
      if (onIssue) onIssue(result)
      onClose && onClose()
    } catch (err) {
      setError(err.message || 'Failed to create waybill')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="px-6 pt-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Issue New Way Bill</h2>
                <p className="text-xs text-gray-500 mt-1">Create electronic way bill for petroleum product movement</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Tanker Registration</label>
                <select value={form.tanker_id} onChange={update('tanker_id')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">Select tanker</option>
                  {tankers.map(tanker => (
                    <option key={tanker.id} value={tanker.id}>{tanker.tanker_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Driver</label>
                <select value={form.driver_id} onChange={update('driver_id')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900">
                  <option value="" className="text-gray-500">Select driver</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id} className="text-gray-900">{driver.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Origin Depot</label>
                <select value={form.origin} onChange={update('origin')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">Select origin</option>
                  <option>Lagos Depot</option>
                  <option>Abuja Depot</option>
                  <option>Port Harcourt Depot</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Destination</label>
                <select value={form.destination} onChange={update('destination')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">Select destination</option>
                  <option>Station A - Lagos</option>
                  <option>Station B - Abuja</option>
                  <option>Station C - PH</option>
                  <option>Station D - Ikeja</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Product Type</label>
                <select value={form.product_type} onChange={update('product_type')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">Select product</option>
                  <option value="PMS">PMS</option>
                  <option value="AGO">AGO</option>
                  <option value="DPK">DPK</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Quantity (Liters)</label>
                <input type="number" value={form.quantity_liters} onChange={update('quantity_liters')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Quality Certificate</label>
                <input value={form.quality_certificate} onChange={update('quality_certificate')} placeholder="QC-2025-XXXX" className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">ETA (Minutes)</label>
                <input type="number" value={form.eta_minutes} onChange={update('eta_minutes')} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
              </div>
            </div>
          </div>

          {error && (
            <div className="px-6 pb-2">
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-100" onClick={onClose} disabled={loading}>Cancel</button>
            <button 
              className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
              onClick={handleIssue}
              disabled={loading}
            >
              <FaQrcode /> {loading ? 'Creating...' : 'Issue & Generate QR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}