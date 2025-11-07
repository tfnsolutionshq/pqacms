import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Clock, Play, Pause } from 'lucide-react'

const LiveTracking = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTracking, setIsTracking] = useState(true)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef(null)

  const mapIframes = [
    {
      src: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5545.098250604654!2d6.793878105765838!3d6.133889029612996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x104393a092314059%3A0x5e8bc5fcaf375e67!2sOnitsha%20South%20Park!3m2!1d6.1343391!2d6.7932972!4m5!1s0x104393bed6cb93b7%3A0xd75544d3750782f7!2sOnitsha%2C%20Anambra!3m2!1d6.1329419!2d6.7923994!5e0!3m2!1sen!2sng!4v1762368821738!5m2!1sen!2sng",
      location: "Onitsha South Park"
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5545.060864128192!2d6.798467165146651!3d6.137482584753915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104393bacdcbe9cb%3A0xf35d73a837a028ed!2sVinee%20Oil!5e0!3m2!1sen!2sng!4v1762368858362!5m2!1sen!2sng",
      location: "Vinee Oil"
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5544.9493455294205!2d6.82133863236441!3d6.1481892251634385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x104393a092314059%3A0x5e8bc5fcaf375e67!2sOnitsha%20South%20Park!3m2!1d6.1343391!2d6.7932972!4m5!1s0x104393bed6cb93b7%3A0xd75544d3750782f7!2sOnitsha%2C%20Anambra!3m2!1d6.1329419!2d6.7923994!5e0!3m2!1sen!2sng!4v1762368894743!5m2!1sen!2sng",
      location: "Onitsha Route"
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.911107890694!2d6.880863976436274!3d6.200525504835333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10438fdbaa2f95cd%3A0x7dbc427836017fff!2sTansian%20University!5e0!3m2!1sen!2sng!4v1762368936368!5m2!1sen!2sng",
      location: "Tansian University"
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6684.642442089441!2d7.055747494507576!3d6.219458416675387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104383ffde16a36f%3A0x2e1fa0f31309a13e!2sSolution%20Fun%20City!5e0!3m2!1sen!2sng!4v1762368976568!5m2!1sen!2sng",
      location: "Solution Fun City"
    }
  ]



  // Auto-start tracking on page load
  useEffect(() => {
    setIsTracking(true)
  }, [])

  // Auto-update position every 10 seconds when tracking
  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        if (currentIndex < mapIframes.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setIsTracking(false)
        }
      }, 10000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isTracking, currentIndex])



  const toggleTracking = () => {
    setIsTracking(!isTracking)
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading route data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Live GPS Tracking</h1>
        <p className="text-gray-600">Real-time tanker simulation tracking</p>
      </div>

      {/* Route Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Start Location</h3>
            <p className="text-lg font-semibold text-green-600">{mapIframes[0].location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">End Location</h3>
            <p className="text-lg font-semibold text-red-600">{mapIframes[mapIframes.length - 1].location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Progress</h3>
            <p className="text-lg font-semibold text-blue-600">
              {Math.round((currentIndex / (mapIframes.length - 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                <p className="text-sm text-gray-600">Real-time position tracking</p>
              </div>
            </div>
            <div className="h-96 w-full">
              <iframe 
                src={mapIframes[currentIndex].src}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
              <p className="text-sm text-gray-600">Live position data</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Location</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{mapIframes[currentIndex].location}</span>
                  </div>
                </div>
                
                {currentIndex < mapIframes.length - 1 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Next Location</h3>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{mapIframes[currentIndex + 1].location}</span>
                    </div>
                  </div>
                )}

                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-1">Current Stop</h4>
                    <p className="text-lg font-semibold">{currentIndex + 1}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-1">Total Stops</h4>
                    <p className="text-lg font-semibold">{mapIframes.length}</p>
                  </div>
                </div> */}

                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((currentIndex / (mapIframes.length - 1)) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{Math.round((currentIndex / (mapIframes.length - 1)) * 100)}% complete</p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-1">Last Update</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                {currentIndex === mapIframes.length - 1 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 font-medium text-sm">🎉 Destination Reached!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTracking