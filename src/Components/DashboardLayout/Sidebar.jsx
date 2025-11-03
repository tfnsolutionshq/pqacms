import React, { useEffect, useState } from 'react'
import { 
  FaHome, 
  FaCog, 
  FaShippingFast, 
  FaUnlock, 
  FaMapMarkerAlt, 
  FaExclamationTriangle, 
  FaFileAlt,
  FaUserShield,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa'
import coatOfArm from '../../assets/coatofarm.png'

function Sidebar({ activeMenuItem, onMenuItemClick, isMobile = false, isOpen = false, onToggle }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', role: '' })

  // Handle collapse toggle - on mobile, use the onToggle prop instead
  const handleToggle = () => {
    if (isMobile && onToggle) {
      onToggle()
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  // On mobile, always show full sidebar when open
  const shouldShowCollapsed = isMobile ? false : isCollapsed

  // Resolve user role from localStorage or /auth/me
  useEffect(() => {
    const cachedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : ''
    const initialName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : ''
    if (cachedRole) setUserInfo(prev => ({ ...prev, role: cachedRole }))
    if (initialName) setUserInfo(prev => ({ ...prev, name: initialName }))

    // Try to refresh from API for accuracy
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch('http://api.pqacms.tfnsolutions.us/api/auth/me', {
          method: 'GET',
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const json = await res.json()
        const role = json?.role || json?.user?.role || ''
        const name = json?.name || json?.user?.name || ''
        if (role) {
          setUserInfo({ name: name || userInfo.name, role })
          try {
            localStorage.setItem('user_role', role)
            if (name) localStorage.setItem('user_name', name)
          } catch (_) {}
        }
      } catch (_) {}
    })()
  }, [])

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'device-manager', label: 'Tankerfleet', icon: FaCog, badge: 'green' },
    { id: 'loading-control', label: 'Loading Control', icon: FaShippingFast },
    { id: 'unlock-requests', label: 'Unlock Requests', icon: FaUnlock, badge: 'red' },
    { id: 'live-tracking', label: 'Live Tracking', icon: FaMapMarkerAlt },
    { id: 'alert-center', label: 'Alert Center', icon: FaExclamationTriangle, badge: 'red' },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
  ]

  const isAdmin = (userInfo.role || '').toLowerCase() === 'admin'
  let menuItems = [...baseMenuItems]
  if (isAdmin) {
    menuItems.splice(1, 0, { id: 'user-management', label: 'User Management', icon: FaUserShield })
  }

  // Map backend role identifiers to human-friendly display names
  const getDisplayRole = (role) => {
    const r = (role || '').toLowerCase()
    if (r === 'partner_fleet') return 'Station Manager'
    return role
  }

  return (
    <div className={`${shouldShowCollapsed ? 'w-16' : 'w-64'} h-full bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Toggle Button - Hide on mobile */}
      {!isMobile && (
        <div className="absolute -right-3 top-6 z-10">
          <button
            onClick={handleToggle}
            className="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            {shouldShowCollapsed ? (
              <FaBars className="text-xs text-gray-600" />
            ) : (
              <FaTimes className="text-xs text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Close Button */}
      {isMobile && (
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={handleToggle}
            className="w-8 h-8 bg-gray-100 rounded-full shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <FaTimes className="text-sm text-gray-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className={`${shouldShowCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 transition-all duration-300`}>
        <div className={`flex items-center ${shouldShowCollapsed ? 'justify-center' : 'gap-3'} mb-4 transition-all duration-300`}>
          <div className={`${shouldShowCollapsed ? 'w-8 h-8' : 'w-14 h-14'} rounded-full overflow-hidden flex items-center justify-center bg-white transition-all duration-300`}>
            <img src={coatOfArm} alt="TTLSC Logo" className="w-full h-full object-contain" />
          </div>
          {!shouldShowCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="font-semibold text-gray-800 text-sm">PQACMS</h1>
              <p className="text-xs text-gray-500">Control Center</p>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        {!shouldShowCollapsed && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg transition-opacity duration-300">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{(userInfo.name || 'John Adeyemi').charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">{userInfo.name || 'John Adeyemi'}</p>
            </div>
          </div>
        )}
        
        {/* Collapsed User Profile - Just Avatar */}
        {shouldShowCollapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{(userInfo.name || 'J').charAt(0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 ${shouldShowCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeMenuItem === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuItemClick && onMenuItemClick(item.id)}
                  className={`w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={shouldShowCollapsed ? item.label : ''}
                >
                  <IconComponent className="text-base" />
                  {!shouldShowCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      
                      {/* Notification Badges */}
                      {item.badge === 'red' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                      {item.badge === 'green' && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </>
                  )}
                  
                  {/* Collapsed state badges */}
                  {shouldShowCollapsed && item.badge && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 ${item.badge === 'red' ? 'bg-red-500' : 'bg-green-500'} rounded-full border-2 border-white`}></span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className={`${shouldShowCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200 transition-all duration-300`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200`}
          title={shouldShowCollapsed ? 'Dark Mode' : ''}
        >
          {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
          {!shouldShowCollapsed && (
            <>
              <span>Dark Mode</span>
              <div className={`ml-auto w-10 h-5 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${isDarkMode ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`}></div>
              </div>
            </>
          )}
        </button>
        {/* Logout Button */}
        <button
          onClick={() => {
            try {
              localStorage.removeItem('auth_token')
              localStorage.removeItem('user_role')
              localStorage.removeItem('user_name')
            } catch (_) {}
            window.location.assign('/')
          }}
          className={`mt-2 w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200`}
          title={shouldShowCollapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt className="text-base" />
          {!shouldShowCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar