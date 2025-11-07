import React, { useEffect, useState } from 'react'
import { 
  FaHome, 
  FaCog, 
  FaShippingFast, 
  FaUnlock, 
  FaLock,
  FaMapMarkerAlt, 
  FaExclamationTriangle, 
  FaFileAlt,
  FaUserShield,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaClipboardCheck,
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
        const res = await fetch('https://api.pqacms.tfnsolutions.us/api/auth/me', {
          method: 'GET',
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_role')
          localStorage.removeItem('user_name')
          window.location.assign('/')
          return
        }
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

  const controlCenterItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'quality-assurance', label: 'Quality Assurance', icon: FaClipboardCheck },
    { id: 'national-waybill', label: 'Waybill', icon: FaClipboardCheck },
    { id: 'loading-control', label: 'Loading Control', icon: FaShippingFast },
    { id: 'live-tracking', label: 'Live Tracking', icon: FaMapMarkerAlt },
    { id: 'unlock-requests', label: 'Unlock Requests', icon: FaUnlock, badge: 'red' },
    { id: 'alert-center', label: 'Alert Center', icon: FaExclamationTriangle, badge: 'red' },
    { id: 'events-and-audit-logs', label: 'Audit Logs', icon: FaFileAlt },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
  ]

  const systemManagementItems = [
    { id: 'depot-management', label: 'Depot', icon: FaHome },
    { id: 'station-management', label: 'Station', icon: FaMapMarkerAlt },
    { id: 'device-manager', label: 'Tanker Fleet', icon: FaCog, badge: 'green' },
    { id: 'device-management', label: 'Device Mgt', icon: FaLock },
  ]

  const isAdmin = (userInfo.role || '').toLowerCase() === 'admin'
  let menuSections = [
    { heading: 'Control Center', items: controlCenterItems },
    { heading: 'System Management', items: [...systemManagementItems, ...(isAdmin ? [{ id: 'user-management', label: 'Stakeholder', icon: FaUserShield }] : [])] }
  ]

  // Map backend role identifiers to human-friendly display names
  const getDisplayRole = (role) => {
    const r = (role || '').toLowerCase()
    if (r === 'partner_fleet') return 'Station Manager'
    return role
  }

  return (
    <div className={`${shouldShowCollapsed ? 'w-16' : 'w-64'} h-full bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
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
              <h1 className="font-semibold text-gray-800 text-sm">PQAQC PRIMIS</h1>
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

      {/* Navigation Menu - Scrollable */}
      <nav className={`flex-1 ${shouldShowCollapsed ? 'p-2' : 'p-4'} transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
        <div className="space-y-4">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.heading}>
              {/* Section Heading */}
              {!shouldShowCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  {section.heading}
                </h3>
              )}
              
              {/* Section Items */}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon
                  const isActive = activeMenuItem === item.id
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onMenuItemClick && onMenuItemClick(item.id)}
                        className={`w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                          isActive 
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={shouldShowCollapsed ? item.label : ''}
                      >
                        <IconComponent className={`text-base ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-200`} />
                        {!shouldShowCollapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            
                            {/* Notification Badges */}
                            {item.badge === 'red' && (
                              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                            )}
                            {item.badge === 'green' && (
                              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                            )}
                          </>
                        )}
                        
                        {/* Collapsed state badges */}
                        {shouldShowCollapsed && item.badge && (
                          <span className={`absolute -top-1 -right-1 w-3 h-3 ${item.badge === 'red' ? 'bg-red-500' : 'bg-green-500'} rounded-full border-2 border-white`}></span>
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {shouldShowCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer - Dark Mode Toggle & Logout */}
      <div className={`${shouldShowCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200 transition-all duration-300 flex-shrink-0`}>
        <div className="space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group`}
            title={shouldShowCollapsed ? 'Dark Mode' : ''}
          >
            {isDarkMode ? <FaSun className="text-base text-gray-600 group-hover:text-gray-900" /> : <FaMoon className="text-base text-gray-600 group-hover:text-gray-900" />}
            {!shouldShowCollapsed && (
              <>
                <span className="flex-1 text-left">Dark Mode</span>
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${isDarkMode ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`}></div>
                </div>
              </>
            )}
            {/* Tooltip for collapsed state */}
            {shouldShowCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Dark Mode
              </div>
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
            className={`w-full flex items-center ${shouldShowCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group`}
            title={shouldShowCollapsed ? 'Logout' : ''}
          >
            <FaSignOutAlt className="text-base" />
            {!shouldShowCollapsed && <span className="flex-1 text-left">Logout</span>}
            {/* Tooltip for collapsed state */}
            {shouldShowCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar