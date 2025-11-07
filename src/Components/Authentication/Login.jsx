import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShieldAlt, FaMapMarkerAlt } from 'react-icons/fa'
import coatOfArm from '../../assets/coatofarm.png'
import truckVideo from '../../assets/truckvideo.mp4'

function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://api.pqacms.tfnsolutions.us/api/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        // Try reading error body for better message
        let msg = 'Login failed. Please check your credentials.'
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch (_) {}
        throw new Error(msg)
      }

      const data = await res.json()
      // Persist token and role
      localStorage.setItem('auth_token', data?.token || '')
      localStorage.setItem('user_role', data?.user?.role || '')

      // Redirect to 2FA
      navigate('/2fa')
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={truckVideo} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
            <img src={coatOfArm} alt="TTLSC Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-1 tracking-tight">PQAQC PRIMIS</h1>
          <p className="text-xs text-gray-600 font-medium">Petroan Quality Assurance Quality Control</p>
          <p className="text-xs text-gray-500 font-medium">Price Intelligence and Monitoring System</p>
        </div>

        {/* Security Features */}
        <div className="flex justify-center gap-4 mb-5">
          <div className="flex items-center gap-1 text-gray-600">
            <FaShieldAlt className="text-green-500 text-xs" />
            <span className="text-xs">Secure Access</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <FaMapMarkerAlt className="text-green-500 text-xs" />
            <span className="text-xs">Live Tracking</span>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
              placeholder="••••••"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-xs text-green-500 hover:text-green-600 transition-colors font-medium">
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-600 font-medium">{error}</div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-200 shadow-lg tracking-wide ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-600 hover:to-yellow-600 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-5">
          <p className="text-xs text-gray-500">TurboFlux Network Solutions Ltd © 2025</p>
        </div>
      </div>
    </div>
  )
}

export default Login