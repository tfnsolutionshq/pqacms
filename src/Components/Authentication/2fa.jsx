import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShieldAlt, FaTimes } from 'react-icons/fa'
import authBg from '../../assets/Authentication/tanker.jpg'

function TwoFactor() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Accept any 6-digit code and redirect to dashboard
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      navigate('/dashboard')
    }
  }

  const handleBackToLogin = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})`, filter: 'blur(1px)', opacity: 0.8 }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <FaTimes className="text-lg" />
        </button>

        {/* Shield Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">Two-Factor Authentication</h1>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>

        {/* 2FA Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Code Input Boxes */}
          <div className="flex justify-center gap-2 mb-5">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50"
                maxLength="1"
              />
            ))}
          </div>

          {/* Help Text */}
          <div className="text-center mb-5">
            <p className="text-xs text-gray-600 mb-1">Don't have access to your authenticator app?</p>
            <a href="#" className="text-xs text-green-500 hover:text-green-600 transition-colors font-medium">
              Contact Administrator
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 text-xs rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-semibold py-2 px-4 text-xs rounded-lg hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 tracking-wide"
            >
              Verify & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TwoFactor