import React, { useMemo, useState, useEffect } from 'react'
import { FaClipboardCheck, FaQrcode, FaDownload } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import ViewQRcode from './ViewQRcode'
import IssueCertificate from './IssueCertificate'

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <FaClipboardCheck className="text-white" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function Badge({ text, tone = 'green' }) {
  const palette =
    tone === 'green'
      ? 'bg-green-50 text-green-700 border-green-200'
      : tone === 'red'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-blue-50 text-blue-700 border-blue-200'
  return <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${palette}`}>{text}</span>
}

function ResultPill({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}:</span>
      <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">{value}</span>
    </div>
  )
}

function CertificationCard({ cert, onViewQR }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 text-white rounded-lg flex items-center justify-center">
            <FaClipboardCheck />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{cert.id}</p>
            <p className="text-xs text-gray-500">{cert.tanker}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge text={cert.status} tone={cert.status === 'ACTIVE' ? 'blue' : 'green'} />
          <Badge
            text={
              <>
                <FaQrcode className="inline-block" /> {cert.qrActive ? 'QR Active' : 'QR Inactive'}
              </>
            }
            tone="blue"
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div>
          <div className="mb-3">
            <p className="text-xs text-gray-500">Product</p>
            <p className="text-sm text-gray-800">{cert.product}</p>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500">Depot</p>
            <p className="text-sm text-gray-800">{cert.depot}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Inspector</p>
            <p className="text-sm text-gray-800">{cert.inspector}</p>
          </div>
        </div>
        <div>
          <div className="mb-3">
            <p className="text-xs text-gray-500">Batch</p>
            <p className="text-sm text-gray-800">{cert.batch}</p>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500">Linked to</p>
            <p className="text-sm text-gray-800">{cert.linked}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Issued</p>
            <p className="text-sm text-gray-800">{cert.issued}</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Test Results:</p>
        <div className="grid grid-cols-2 gap-3">
          <ResultPill label="Density" value={cert.results.density} />
          <ResultPill label="Octane" value={cert.results.octane} />
          <ResultPill label="Sulfur" value={cert.results.sulfur} />
          <ResultPill label="Contamination" value={cert.results.contamination} />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        {cert.status === 'COMPLETED' && (
          <button onClick={() => onViewQR && onViewQR(cert)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
            <FaQrcode className="text-gray-700" /> View QR
          </button>
        )}
        <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
          <FaDownload className="text-gray-700" /> Download
        </button>
      </div>
    </div>
  )
}

export default function QualityAssurance() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [qrOpen, setQrOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)
  const [issueOpen, setIssueOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [stats, setStats] = useState({})
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchQAData = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/qa/certificates', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
          throw new Error('Failed to load quality assurance data')
        }
        
        const data = await res.json()
        console.log('QA API Response:', data)
          
          setStats(data.stats || {})
          
          const formattedCerts = data.certificates?.data?.map(cert => ({
            id: cert.certificate_code,
            certificateId: cert.id,
            tanker: cert.tanker?.tanker_number || 'N/A',
            status: cert.status === 'completed' ? 'COMPLETED' : 'ACTIVE',
            qrActive: true,
            product: cert.product_type || 'N/A',
            depot: cert.depot,
            inspector: cert.inspector?.name || 'N/A',
            batch: cert.batch_number,
            linked: cert.tanker?.tanker_number || 'N/A',
            issued: new Date(cert.issued_at).toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            results: {
              density: cert.density_pass ? 'Pass' : 'Fail',
              octane: cert.octane_pass ? 'Pass' : 'Fail',
              sulfur: cert.sulfur_pass ? 'Pass' : 'Fail',
              contamination: cert.contamination_pass ? 'Pass' : 'Fail'
            }
          })) || []
          
          setCertificates(formattedCerts)
      } catch (err) {
        setError('Failed to load quality assurance data')
        console.error('QA fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchQAData()
  }, [refreshTrigger])

  const handleVerifyCertificate = async () => {
    if (!verifyCode.trim()) return
    
    setVerifyLoading(true)
    setVerifyResult(null)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/qa/verify/${verifyCode.trim()}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        const data = await res.json()
        setVerifyResult({ success: true, data })
      } else {
        setVerifyResult({ success: false, message: 'Certificate not found or invalid' })
      }
    } catch (err) {
      console.error('Certificate verify error:', err)
      setVerifyResult({ success: false, message: 'Verification failed' })
    } finally {
      setVerifyLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchesSearch = (c.id + ' ' + c.tanker + ' ' + c.batch).toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'All Status' || statusFilter.toUpperCase() === c.status
      return matchesSearch && matchesStatus
    })
  }, [certificates, search, statusFilter])

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Quality Assurance</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">NMDPRA Certified</span>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setIssueOpen(true)} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Issue Certificate</button>
          <button onClick={() => setVerifyOpen(true)} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Verify Certificate</button>
        </div>
      </div>
      <p className="text-sm text-gray-500">Product quality certification with QR code verification</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <StatCard 
          title="Certificates Issued" 
          value={stats.certificates_issued_total || '0'} 
          subtitle={`${stats.certificates_issued_today || 0} today`} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Active Certifications" 
          value={stats.active_certifications || '0'} 
          subtitle="Currently in transit" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Quality Pass Rate" 
          value={`${stats.quality_pass_rate_percent || 0}%`} 
          subtitle={`${stats.quality_pass_rate_delta_percent > 0 ? '+' : ''}${stats.quality_pass_rate_delta_percent || 0}% change`} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Failed Tests" 
          value={stats.failed_tests || '0'} 
          subtitle="Products rejected" 
          color="bg-red-500" 
        />
      </div>

      {/* Search and filter */}
      <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Certificate ID, Tanker, or Batch Number..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option>All Status</option>
          <option>ACTIVE</option>
          <option>COMPLETED</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-gray-600 text-sm mt-6">Loading certificates...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-sm mt-6">{error}</div>
      )}

      {/* Certification cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && !error && filtered.length === 0 && (
          <div className="col-span-2 text-center text-gray-600 text-sm">No certificates found</div>
        )}
        {filtered.map((c) => (
          <CertificationCard
            key={c.id}
            cert={c}
            onViewQR={(cert) => {
              setSelectedCert(cert)
              setQrOpen(true)
            }}
          />
        ))}
      </div>

      <ViewQRcode
        isOpen={qrOpen}
        cert={selectedCert}
        onClose={() => setQrOpen(false)}
      />

      <IssueCertificate
        isOpen={issueOpen}
        onClose={() => setIssueOpen(false)}
        onIssue={(result) => {
          console.log('Created certificate:', result)
          setRefreshTrigger(prev => prev + 1)
          setIssueOpen(false)
        }}
      />

      {/* Verify Certificate Modal */}
      {verifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setVerifyOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Verify Certificate</h3>
                <p className="text-sm text-gray-500">Enter certificate code to verify authenticity</p>
              </div>
              <button onClick={() => setVerifyOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Code</label>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter certificate code (e.g., QC-2025-8901)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {verifyResult && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  verifyResult.success 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className="text-sm">
                    {verifyResult.success 
                      ? `Certificate verified: ${verifyResult.data?.certificate_code || 'Valid'}`
                      : verifyResult.message
                    }
                  </span>
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setVerifyOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyCertificate}
                  disabled={verifyLoading || !verifyCode.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg text-white ${
                    verifyLoading || !verifyCode.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}