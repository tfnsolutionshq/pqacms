import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

function DashboardLayout({ children, activeMenuItem = 'dashboard' }) {
  const [currentActiveMenuItem, setCurrentActiveMenuItem] = useState(activeMenuItem)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleMenuItemClick = (menuId) => {
    setCurrentActiveMenuItem(menuId)
    
    // Close sidebar on mobile after menu item click
    if (isMobile) {
      setIsSidebarOpen(false)
    }
    
    // Navigate to the appropriate route based on menu item
    switch (menuId) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'device-manager':
        navigate('/tanker-fleet')
        break
      case 'loading-control':
        navigate('/loading-control')
        break
      case 'unlock-requests':
        navigate('/unlock-code-request')
        break
      case 'live-tracking':
        navigate('/live-tracking')
        break
      case 'alert-center':
        navigate('/alerts')
        break
      case 'user-management':
        navigate('/user-management')
        break
      case 'reports':
        // Add route when implemented
        console.log('Reports - Route not implemented yet')
        break
      default:
        console.log('Unknown menu item:', menuId)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative h-full'} ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          activeMenuItem={currentActiveMenuItem}
          onMenuItemClick={handleMenuItemClick}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="md:hidden p-4 bg-white shadow-sm">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout