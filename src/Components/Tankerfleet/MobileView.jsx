import React, { useState } from 'react'
import { Copy, AlertTriangle, MapPin, Shield, CheckCircle } from 'lucide-react'

function MobileView({ tankerId = '' }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [unlockCode, setUnlockCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [wrongLocationWarning, setWrongLocationWarning] = useState(false)

  const isValidUuid = (id) =>
    !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)

  async function handleRequestRightLocation() {
    setError('')
    setUnlockCode('')
    setIsLoading(true)
    setLoadingMessage('Verifying location')

    await new Promise((r) => setTimeout(r, 5000))

    if (!isValidUuid(tankerId)) {
      setIsLoading(false)
      setError(`Invalid tanker ID: ${tankerId || '—'}. Select a valid tanker.`)
      return
    }

    const token = localStorage.getItem('auth_token') || '19a99505-0135-49e7-bab2-81a72843ee4d|UHohC8i1MsTc1wkQxYzDv4YboW77wVXrW7lDapaU483c3e24'
    try {
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/unlock-requests', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          tanker_id: tankerId || 'd100e3c7-73b7-40f1-924c-27f00dfa6cdf'
        })
      })
      setIsLoading(false)
      if (!res.ok) {
        const text = await res.text()
        setError(text || `Request failed (HTTP ${res.status})`)
        return
      }
      const json = await res.json()
      const code = (json?.data?.unlock_code) || json?.unlock_code || json?.code || 'TF-00000'
      setUnlockCode(code)
    } catch (err) {
      setIsLoading(false)
      setError('Network or server error while requesting unlock code')
    }
  }

  async function handleRequestWrongLocation() {
    setError('')
    setUnlockCode('')
    setWrongLocationWarning(false)
    setIsLoading(true)
    setLoadingMessage('Verifying location')

    await new Promise((r) => setTimeout(r, 5000))

    const token = localStorage.getItem('auth_token')
    try {
      await fetch('https://api.pqacms.tfnsolutions.us/api/unlock-requests-wrong', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ tanker_id: tankerId })
      })
    } catch {
      // Silently ignore network errors
    }

    setIsLoading(false)
    setWrongLocationWarning(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Tanker Unlock System</h1>
            <p className="text-sm text-gray-600">Secure location-based access control</p>
            {tankerId && (
              <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 inline-block">
                ID: {tankerId.slice(0, 8)}...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={handleRequestRightLocation}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-4 px-6 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
          >
            <MapPin className="w-5 h-5" />
            Request with Correct Location
          </button>
          
          <button
            onClick={handleRequestWrongLocation}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl py-4 px-6 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
          >
            <AlertTriangle className="w-5 h-5" />
            Request with Wrong Location
          </button>
        </div>

        {/* Status Cards */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="animate-spin h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{loadingMessage}...</h3>
              <p className="text-sm text-gray-600">Please wait while we process your request</p>
            </div>
          </div>
        )}

        {unlockCode && !wrongLocationWarning && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlock Code Generated</h3>
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-bold text-green-700 tracking-wider">{unlockCode}</span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(unlockCode)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      } catch {}
                    }}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {copied && (
                <div className="text-sm text-green-600 font-medium">✓ Copied to clipboard!</div>
              )}
            </div>
          </div>
        )}

        {wrongLocationWarning && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 mb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-900 mb-3">Security Alert</h3>
              <p className="text-sm text-red-700 leading-relaxed">
                An unlock request has been triggered from an incorrect location. 
                Security personnel have been notified automatically.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-900 mb-2">Request Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileView