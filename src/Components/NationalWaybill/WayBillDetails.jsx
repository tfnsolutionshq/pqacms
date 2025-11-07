import React, { useState, useEffect } from 'react'
import { FaTimes, FaQrcode, FaDownload, FaPrint } from 'react-icons/fa'

export default function WayBillDetails({ isOpen, onClose, bill, onChangeStatus }) {
  const [status, setStatus] = useState(bill?.status || 'PENDING')
  const [etaMinutes, setEtaMinutes] = useState(30)
  const [waybillData, setWaybillData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !bill?.waybillId) return
    
    const fetchWaybill = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/way-bills/${bill.waybillId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          setWaybillData(data)
          setEtaMinutes(data.eta_minutes || 30)
          const statusMap = {
            'pending': 'PENDING',
            'in_transit': 'IN TRANSIT', 
            'completed': 'COMPLETED',
            'cancelled': 'CANCELLED'
          }
          setStatus(statusMap[data.status] || 'PENDING')
        }
      } catch (err) {
        setError('Failed to load waybill details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchWaybill()
  }, [isOpen, bill?.waybillId])

  if (!isOpen) return null

  const handleUpdate = async () => {
    setUpdating(true)
    setError('')
    
    try {
      const token = localStorage.getItem('auth_token')
      const statusMap = {
        'PENDING': 'pending',
        'IN TRANSIT': 'in_transit',
        'COMPLETED': 'completed', 
        'CANCELLED': 'cancelled'
      }
      
      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/way-bills/${bill.waybillId}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: statusMap[status],
          eta_minutes: etaMinutes
        })
      })
      
      if (res.ok) {
        onChangeStatus && onChangeStatus(status)
      } else {
        throw new Error('Failed to update waybill')
      }
    } catch (err) {
      setError(err.message || 'Failed to update waybill')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Small popup */}
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
          {/* Header */}
          <div className="px-5 pt-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Way Bill Details</h2>
                <p className="text-[11px] text-gray-500 mt-1">Complete way bill information with QR code</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="px-4 pt-3 overflow-y-auto max-h-[70vh]">
            {/* QR Code - smaller on mobile */}
            <div className="border border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center py-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
                <FaQrcode className="text-blue-500 text-3xl sm:text-4xl" />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">QR Code for {bill?.id}</p>
            </div>
            
            {/* Details grid - responsive */}
            <div className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">WAY BILL ID</p>
                  <p className="text-gray-800 font-medium">{waybillData?.waybill_code || bill?.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">STATUS</p>
                  <span className="inline-block px-2 py-1 text-[10px] rounded-full bg-orange-50 text-orange-700 border border-orange-200">{status}</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">TANKER</p>
                  <p className="text-gray-800">{waybillData?.tanker?.tanker_number || bill?.tanker}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">DRIVER</p>
                  <p className="text-gray-800">{waybillData?.driver?.name || bill?.driver}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">PRODUCT</p>
                  <p className="text-gray-800">{waybillData?.product_type || bill?.product} • {waybillData?.quantity_liters ? `${waybillData.quantity_liters}L` : bill?.quantity || '33,000L'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">CERTIFICATE</p>
                  <p className="text-gray-800">{waybillData?.quality_certificate || bill?.cert}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">ORIGIN</p>
                  <p className="text-gray-800">{waybillData?.origin || bill?.route?.split('→')[0]?.trim()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">DESTINATION</p>
                  <p className="text-gray-800">{waybillData?.destination || bill?.route?.split('→')[1]?.trim()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">ISSUE DATE</p>
                  <p className="text-gray-800">{waybillData?.issued_at ? new Date(waybillData.issued_at).toLocaleString('en-GB') : bill?.issued}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">ETA</p>
                  <p className="text-gray-800">{waybillData?.eta_minutes ? `${waybillData.eta_minutes} mins` : bill?.eta}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="pt-2">
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{error}</div>
              </div>
            )}

            {/* Update status and ETA */}
            <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-600">Update Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={updating || loading}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN TRANSIT">IN TRANSIT</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600">ETA (Minutes)</label>
                <input 
                  type="number"
                  min="0"
                  max="10000"
                  value={etaMinutes}
                  onChange={(e) => setEtaMinutes(parseInt(e.target.value) || 0)}
                  disabled={updating || loading}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
                />
              </div>
              
              <button
                onClick={handleUpdate}
                disabled={updating || loading}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  updating || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {updating ? 'Updating...' : 'Update Waybill'}
              </button>
            </div>
          </div>



          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center gap-2">
              <FaDownload /> Download
            </button>
            <button className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center gap-2">
              <FaPrint /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}