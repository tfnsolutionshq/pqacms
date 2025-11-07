import React, { useState, useEffect } from 'react'
import { FaTimes, FaQrcode } from 'react-icons/fa'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      {children}
    </div>
  )
}

export default function IssueCertificate({ isOpen, onClose, onIssue }) {
  const [form, setForm] = useState({
    tanker_id: '',
    batch_number: '',
    depot: '',
    product_type: '',
    density_pass: true,
    sulfur_pass: true,
    octane_pass: true,
    contamination_pass: true,
  })
  const [tankers, setTankers] = useState([])
  const [depots, setDepots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    
    const fetchTankers = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/tankers', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          setTankers(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch tankers:', err)
      }
    }
    
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
      }
    }
    
    fetchTankers()
    fetchDepots()
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('auth_token')
      const payload = {
        tanker_id: form.tanker_id,
        batch_number: form.batch_number,
        depot: form.depot,
        product_type: form.product_type,
        density_pass: form.density_pass,
        sulfur_pass: form.sulfur_pass,
        octane_pass: form.octane_pass,
        contamination_pass: form.contamination_pass
      }
      
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/qa/certificates', {
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
        throw new Error(data?.message || 'Failed to create certificate')
      }
      
      const result = await res.json()
      console.log('Created certificate:', result)
      
      onIssue && onIssue(result)
      onClose && onClose()
    } catch (err) {
      setError(err.message || 'Failed to create certificate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Issue Quality Certificate</h3>
            <p className="text-[11px] text-gray-500">Create NMDPRA quality certification with QR code</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 p-1.5"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-4 pb-4">
          {/* Form grid */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tanker">
              <select
                value={form.tanker_id}
                onChange={(e) => setForm({ ...form, tanker_id: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select tanker</option>
                {tankers.map(tanker => (
                  <option key={tanker.id} value={tanker.id}>
                    {tanker.tanker_number}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Batch Number">
              <input
                value={form.batch_number}
                onChange={(e) => setForm({ ...form, batch_number: e.target.value })}
                placeholder="BATCH-2025-XXXX"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </Field>

            <Field label="Product Type">
              <select
                value={form.product_type}
                onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select product</option>
                <option value="LPG">LPG (Liquefied Petroleum Gas)</option>
                <option value="PMS">Gasoline (Petrol, PMS)</option>
                <option value="AGO">Diesel (AGO)</option>
                <option value="Kerosene">Kerosene</option>
                <option value="Jet Fuel">Jet Fuel</option>
                <option value="HPFO">HPFO (High Pour Fuel Oil)</option>
                <option value="LPFO">LPFO (Low Pour Fuel Oil)</option>
                <option value="Naphtha">Naphtha</option>
                <option value="Bitumen">Bitumen (Asphalt)</option>
                <option value="Lubricants">Lubricants</option>
                <option value="Petroleum Coke">Petroleum Coke</option>
                <option value="Fuel Oil">Fuel Oil</option>
              </select>
            </Field>

            <Field label="Depot">
              <select
                value={form.depot}
                onChange={(e) => setForm({ ...form, depot: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select depot</option>
                {depots.map(depot => (
                  <option key={depot.id} value={depot.name}>
                    {depot.name}
                  </option>
                ))}
              </select>
            </Field>


          </div>

          {/* Results */}
          <p className="mt-5 text-sm font-medium text-gray-900">Quality Test Results</p>
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              ['Density', 'density_pass'],
              ['Sulfur Content', 'sulfur_pass'],
              ['Octane/Cetane', 'octane_pass'],
              ['Contamination', 'contamination_pass'],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <span className="text-sm text-gray-700">{label}</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    form[key] 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {form[key] ? 'Pass' : 'Fail'}
                </button>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          {/* Footer */}
          <div className="mt-5 flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                loading 
                  ? 'bg-green-400 cursor-not-allowed text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <FaQrcode /> {loading ? 'Creating...' : 'Issue & Generate QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}