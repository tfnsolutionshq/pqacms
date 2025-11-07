import React, { useState, useEffect } from 'react'
import { FaQrcode, FaTimes, FaDownload, FaPrint } from 'react-icons/fa'

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value}</p>
    </div>
  )
}

function ResultRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-200">{value}</span>
    </div>
  )
}

export default function ViewQRcode({ isOpen, onClose, cert }) {
  const [certificateData, setCertificateData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !cert?.certificateId) return
    
    const fetchCertificate = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch(`https://api.pqacms.tfnsolutions.us/api/qa/certificates/${cert.certificateId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          setCertificateData(data)
        } else {
          throw new Error('Failed to load certificate')
        }
      } catch (err) {
        console.error('Certificate fetch error:', err)
        setError('Failed to load certificate details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCertificate()
  }, [isOpen, cert?.certificateId])



  if (!isOpen) return null
  // Prefer API-loaded data where available, but always fall back to the selected card data
  const apiCert = certificateData || null
  const selectedCert = cert || {}
  const certificateCode = apiCert?.certificate_code ?? selectedCert?.id
  const product = apiCert?.way_bill?.product_type ?? selectedCert?.product
  const tanker = apiCert?.way_bill?.tanker?.tanker_number ?? selectedCert?.tanker
  const batch = apiCert?.batch_number ?? selectedCert?.batch
  const depot = apiCert?.depot ?? selectedCert?.depot
  const inspector = apiCert?.inspector?.name ?? selectedCert?.inspector
  const issuedAt = apiCert?.issued_at
    ? new Date(apiCert.issued_at).toLocaleString('en-GB')
    : selectedCert?.issued
  const density =
    apiCert?.density_pass !== undefined
      ? apiCert.density_pass ? 'Pass' : 'Fail'
      : selectedCert?.results?.density
  const sulfur =
    apiCert?.sulfur_pass !== undefined
      ? apiCert.sulfur_pass ? 'Pass' : 'Fail'
      : selectedCert?.results?.sulfur
  const octane =
    apiCert?.octane_pass !== undefined
      ? apiCert.octane_pass ? 'Pass' : 'Fail'
      : selectedCert?.results?.octane
  const contamination =
    apiCert?.contamination_pass !== undefined
      ? apiCert.contamination_pass ? 'Pass' : 'Fail'
      : selectedCert?.results?.contamination

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between px-4 pt-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Quality Certificate QR Code</h3>
            <p className="text-[11px] text-gray-500">NMDPRA Quality Assurance Verification</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700 p-1.5">
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">
          {loading && (
            <div className="mt-3 text-center text-gray-600 text-sm">Loading certificate...</div>
          )}
          
          {error && (
            <div className="mt-3 text-center text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="mx-auto flex w-full max-w-[18rem] flex-col items-center">
                  <div className="w-full bg-white rounded-xl shadow-sm flex items-center justify-center py-6">
                    <FaQrcode className="text-gray-900" size={96} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-800">{certificateCode}</p>
                  <span className="mt-1.5 text-[11px] px-2 py-1 rounded-full bg-green-600 text-white">NMDPRA Certified</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem label="Product" value={product} />
                  <InfoItem label="Tanker" value={tanker} />
                  <InfoItem label="Batch Number" value={batch} />
                  <InfoItem label="Depot" value={depot} />
                  <InfoItem label="NMDPRA Inspector" value={inspector} />
                  <InfoItem label="Issued At" value={issuedAt} />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2.5">Quality Test Results</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <ResultRow label="Density" value={density} />
                  <ResultRow label="Sulfur" value={sulfur} />
                  <ResultRow label="Octane" value={octane} />
                  <ResultRow label="Contamination" value={contamination} />
                </div>
              </div>
            </>
          )}



          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">
              <FaDownload /> Download QR
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100" onClick={() => window.print()}>
              <FaPrint /> Print Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}