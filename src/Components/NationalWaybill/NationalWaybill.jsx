import React, { useMemo, useState, useEffect } from 'react'
import { FaFileAlt, FaSearch, FaEye, FaFilePdf, FaPrint, FaClock, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import IssueNewWayBill from './IssueNewWayBill'
import WayBillDetails from './WayBillDetails'
import ApproveRejectWaybill from './ApproveRejectWaybill'

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <FaFileAlt className="text-white" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function Badge({ text, tone = 'gray' }) {
  const palette =
    tone === 'green'
      ? 'bg-green-50 text-green-700 border-green-200'
      : tone === 'orange'
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : tone === 'blue'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-gray-50 text-gray-700 border-gray-200'
  return <span className={`text-xs px-2 py-1 rounded-full border ${palette}`}>{text}</span>
}

function WaybillItem({ wb, onView }) {
  const tone = wb.status === 'COMPLETED' ? 'green' : wb.status === 'IN TRANSIT' ? 'blue' : wb.status === 'CANCELLED' ? 'red' : 'orange'
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 bg-green-600 text-white rounded-lg flex items-center justify-center">
          <FaFileAlt />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{wb.id}</p>
            <span className="text-xs text-gray-400">QR</span>
            <Badge text={wb.status} tone={tone} />
          </div>
          <p className="mt-1 text-xs text-gray-600">Tanker: <span className="text-gray-800">{wb.tanker}</span> • {wb.driver}</p>
          <p className="mt-1 text-xs text-gray-600">Route: <span className="text-gray-800">{wb.route}</span></p>
          <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-4">
            <span>Issued: {wb.issued}</span>
            <span className="flex items-center gap-1"><FaClock /> ETA: {wb.eta}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">Product: <span className="text-gray-800">{wb.product}</span></p>
        <p className="text-xs text-gray-500">Quality Cert: <span className="text-gray-800">{wb.cert}</span></p>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => onView && onView(wb)} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center gap-1"><FaEye /> View</button>
          <button className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center gap-1"><FaFilePdf /> PDF</button>
          <button className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center gap-1"><FaPrint /> Print</button>
        </div>
      </div>
    </div>
  )
}

export default function NationalWaybill() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [issueOpen, setIssueOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  const [waybills, setWaybills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewBill, setReviewBill] = useState(null)

  useEffect(() => {
    const fetchWaybills = async () => {
      setError('')
      setLoading(true)
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/way-bills', {
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
          let msg = 'Failed to load waybills.'
          try {
            const data = await res.json()
            if (data?.message) msg = data.message
          } catch (_) {}
          throw new Error(msg)
        }
        
        const response = await res.json()
        console.log('API Response:', response)
        
        const formattedWaybills = response.data.map(wb => ({
          id: wb.waybill_code,
          waybillId: wb.id, // Add the actual UUID for API calls
          tanker: wb.tanker?.tanker_number || 'N/A',
          driver: wb.driver?.name || 'N/A',
          status: wb.status === 'in_transit' ? 'IN TRANSIT' : wb.status === 'completed' ? 'COMPLETED' : wb.status === 'cancelled' ? 'CANCELLED' : 'PENDING',
          product: wb.product_type,
          cert: wb.quality_certificate,
          route: `${wb.origin} → ${wb.destination}`,
          issued: new Date(wb.issued_at).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          eta: wb.eta_minutes ? `${wb.eta_minutes} mins` : 'N/A',
          quantity: wb.quantity_liters
        }))
        
        console.log('Formatted Waybills:', formattedWaybills)
        setWaybills(formattedWaybills)
      } catch (err) {
        setError(err.message || 'Unexpected error occurred')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWaybills()
  }, [refreshTrigger])

  const filtered = useMemo(() => {
    return waybills.filter((w) => {
      const s = (w.id + ' ' + w.tanker + ' ' + w.driver + ' ' + w.product).toLowerCase()
      const matchesSearch = s.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All Status' || statusFilter === w.status
      return matchesSearch && matchesStatus
    })
  }, [waybills, search, statusFilter])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">National Way Bill System</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
          <FaCheckCircle /> PRIMIS UNIFIED WAYBILL SYSTEM
        </span>
        <button
          className="ml-auto px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          onClick={() => setIssueOpen(true)}
        >
          Issue Way Bill
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-1">Single national electronic way bill for petroleum distribution</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <StatCard title="Active Way Bills" value="1,247" subtitle="+23 today" color="bg-green-500" />
        <StatCard title="Completed Today" value="89" subtitle="+12% vs yesterday" color="bg-green-600" />
        <StatCard title="In Transit" value="342" subtitle="Real-time tracking" color="bg-orange-500" />
        <StatCard title="Compliance Rate" value="98.7%" subtitle="+0.3% this week" color="bg-purple-500" />
      </div>

      {/* Search */}
      <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <FaSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Way Bill ID, Tanker, or Driver..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option>All Status</option>
          <option>PENDING</option>
          <option>IN TRANSIT</option>
          <option>COMPLETED</option>
          <option>CANCELLED</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-gray-600 text-sm mt-6">Loading waybills...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-sm mt-6">{error}</div>
      )}

      {/* Mock Data Section */}
      <div className="mt-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-green-600 text-white rounded-lg flex items-center justify-center">
              <FaFileAlt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">WB-2025-003</p>
                <span className="text-xs text-gray-400">QR</span>
                <Badge text="PENDING" tone="orange" />
              </div>
              <p className="mt-1 text-xs text-gray-600">Tanker: <span className="text-gray-800">TRK-1874</span> • Michael Okafor</p>
              <p className="mt-1 text-xs text-gray-600">Route: <span className="text-gray-800">Warri Depot → Benin Station</span></p>
              <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-4">
                <span>Issued: 15/01/2025, 10:45</span>
                <span className="flex items-center gap-1"><FaClock /> ETA: 90 mins</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Product: <span className="text-gray-800">DPK</span></p>
            <p className="text-xs text-gray-500">Quality Cert: <span className="text-gray-800">QC-2025-003</span></p>
            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={() => {
                  setReviewBill({
                    id: 'WB-2025-003',
                    tanker: 'TRK-1874',
                    driver: 'Michael Okafor',
                    product: 'DPK',
                    quantity: '30,000L',
                    route: 'Warri Depot → Benin Station',
                    issued: '15/01/2025, 10:45',
                    cert: 'QC-2025-003'
                  })
                  setReviewOpen(true)
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
              >
                Review
              </button>
              <button className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center gap-1"><FaEye /> View</button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-gray-600 text-sm">No waybills found</div>
        )}
        {filtered.map((w) => (
          <WaybillItem key={w.id} wb={w} onView={(wb) => { setSelectedBill(wb); setDetailsOpen(true) }} />
        ))}
      </div>

      {/* Issue Way Bill Modal */}
      <IssueNewWayBill
        isOpen={issueOpen}
        onClose={() => setIssueOpen(false)}
        onIssue={(result) => {
          console.log('Created waybill:', result)
          setRefreshTrigger(prev => prev + 1) // Refresh the list
        }}
      />

      {/* Way Bill Details Modal */}
      <WayBillDetails
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        bill={selectedBill}
        onChangeStatus={(newStatus) => {
          // Update local state and refresh the list
          setSelectedBill((b) => (b ? { ...b, status: newStatus } : b))
          setRefreshTrigger(prev => prev + 1)
        }}
      />

      {/* Approve/Reject Waybill Modal */}
      <ApproveRejectWaybill
        isOpen={reviewOpen}
        onClose={() => {
          setReviewOpen(false)
          setReviewBill(null)
        }}
        waybill={reviewBill}
      />
    </div>
  )
} 