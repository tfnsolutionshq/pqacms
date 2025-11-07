import React, { useState } from 'react'
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa'

function ApproveRejectWaybill({ isOpen, onClose, waybill }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    setMessage('')
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Waybill approved successfully!')
      setLoading(false)
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setMessage('Please provide a rejection reason')
      return
    }
    
    setLoading(true)
    setMessage('')
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Waybill rejected successfully!')
      setLoading(false)
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Review Way Bill</h2>
            <p className="text-sm text-gray-500">Approve or reject this way bill request</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Waybill ID */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{waybill?.id || 'WB-2025-001236'}</h3>
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                <FaExclamationTriangle className="w-3 h-3" />
                PENDING APPROVAL
              </span>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Tanker & Driver</p>
                <p className="font-medium text-gray-900">{waybill?.tanker || 'TRK-5678'}</p>
                <p className="text-gray-600">{waybill?.driver || 'Ahmed Bello'}</p>
              </div>
              <div>
                <p className="text-gray-500">Product</p>
                <p className="font-medium text-gray-900">{waybill?.product || 'PMS'}</p>
                <p className="text-gray-600">{waybill?.quantity || '33,000L'}</p>
              </div>
              <div>
                <p className="text-gray-500">Route</p>
                <p className="font-medium text-gray-900">{waybill?.route || 'Kano Depot → Station E - Kano'}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium text-gray-900">{waybill?.issued || '2025-11-05 10:30'}</p>
              </div>
              <div>
                <p className="text-gray-500">Quality Cert</p>
                <p className="font-medium text-gray-900">{waybill?.cert || 'QC-2025-8904'}</p>
              </div>
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="font-medium text-gray-900">Fatima Ibrahim (Depot Manager)</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-gray-400">(Required if rejecting)</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection (e.g., incomplete documentation, quality concerns, etc.)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('approved') ? 'bg-green-50 text-green-700' : 
              message.includes('rejected') ? 'bg-red-50 text-red-700' : 
              'bg-yellow-50 text-yellow-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
            ) : (
              <span>🚫</span>
            )}
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-green-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>✓</span>
            )}
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApproveRejectWaybill