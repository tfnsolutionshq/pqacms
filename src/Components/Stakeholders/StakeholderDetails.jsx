import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUserTie, FaBuilding, FaStore, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruck } from 'react-icons/fa'

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <FaBuilding className="text-white" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function DepotCard({ depot }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaBuilding className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{depot.name}</p>
            <p className="text-xs text-gray-500">{depot.code}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          {depot.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaMapMarkerAlt size={12} />
          {depot.location}
        </div>
        <div className="text-sm text-gray-600">
          Stations: {depot.stations.length}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stations</p>
        {depot.stations.map((station) => (
          <div key={station.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FaStore className="text-green-600" size={12} />
              <span className="text-sm text-gray-800">{station.name}</span>
            </div>
            <span className="text-xs text-gray-500">{station.manager}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StationManagerCard({ manager }) {
  return (
    <div className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-green-600" />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="font-medium text-gray-900">{manager.name}</p>
              <p className="text-xs text-gray-500">{manager.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800">{manager.station}</p>
              <p className="text-xs text-gray-500">Station</p>
            </div>
            <div>
              <p className="text-sm text-gray-800">{manager.phone}</p>
              <p className="text-xs text-gray-500">Phone</p>
            </div>
            <div>
              <p className="text-sm text-gray-800">{manager.email}</p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
            {manager.status}
          </span>
          <button className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StakeholderDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userType } = location.state || {}

  // Mock data for station manager's drivers
  const stationData = {
    'STM-001': {
      station: {
        id: 'STA-001',
        name: 'Victoria Island Station',
        code: 'VI-STA',
        location: 'Victoria Island, Lagos',
        status: 'Active',
        depot: 'Port Harcourt Main Depot'
      },
      trips: [
        { id: 'TRP-101', date: '2024-01-16', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt Main Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-102', date: '2024-01-15', driver: 'Chidi Okafor', driverId: 'DRV-002', tanker: 'TRK-3012', fromDepot: 'Port Harcourt Main Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-103', date: '2024-01-14', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-104', date: '2024-01-13', driver: 'Chidi Okafor', driverId: 'DRV-002', tanker: 'TRK-3012', fromDepot: 'Port Harcourt Main Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-105', date: '2024-01-12', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt Main Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-106', date: '2024-01-11', driver: 'Chidi Okafor', driverId: 'DRV-002', tanker: 'TRK-3012', fromDepot: 'Port Harcourt East Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-107', date: '2024-01-10', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt Main Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-108', date: '2024-01-09', driver: 'Chidi Okafor', driverId: 'DRV-002', tanker: 'TRK-3012', fromDepot: 'Port Harcourt Main Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-109', date: '2024-01-08', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-110', date: '2024-01-07', driver: 'Chidi Okafor', driverId: 'DRV-002', tanker: 'TRK-3012', fromDepot: 'Port Harcourt Main Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-111', date: '2024-01-06', driver: 'Ahmed Hassan', driverId: 'DRV-001', tanker: 'TRK-2045', fromDepot: 'Port Harcourt Main Depot', product: 'Premium Motor Spirit', status: 'In Transit' }
      ]
    },
    'STM-002': {
      station: {
        id: 'STA-002',
        name: 'Ikeja Station',
        code: 'IKJ-STA',
        location: 'Ikeja, Lagos',
        status: 'Active',
        depot: 'Lagos Central Depot'
      },
      trips: [
        { id: 'TRP-201', date: '2024-01-16', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-202', date: '2024-01-15', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-203', date: '2024-01-14', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-204', date: '2024-01-13', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-205', date: '2024-01-12', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-206', date: '2024-01-11', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos East Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-207', date: '2024-01-10', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-208', date: '2024-01-09', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-209', date: '2024-01-08', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-210', date: '2024-01-07', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-211', date: '2024-01-06', driver: 'Fatima Abubakar', driverId: 'DRV-003', tanker: 'TRK-4567', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'In Transit' }
      ]
    },
    'STM-003': {
      station: {
        id: 'STA-003',
        name: 'Lekki Station',
        code: 'LEK-STA',
        location: 'Lekki, Lagos',
        status: 'Maintenance',
        depot: 'Lagos East Depot'
      },
      trips: [
        { id: 'TRP-301', date: '2024-01-16', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-302', date: '2024-01-15', driver: 'Kemi Adebayo', driverId: 'DRV-005', tanker: 'TRK-8901', fromDepot: 'Lagos East Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-303', date: '2024-01-14', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-304', date: '2024-01-13', driver: 'Kemi Adebayo', driverId: 'DRV-005', tanker: 'TRK-8901', fromDepot: 'Lagos East Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-305', date: '2024-01-12', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-306', date: '2024-01-11', driver: 'Kemi Adebayo', driverId: 'DRV-005', tanker: 'TRK-8901', fromDepot: 'Lagos Central Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-307', date: '2024-01-10', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-308', date: '2024-01-09', driver: 'Kemi Adebayo', driverId: 'DRV-005', tanker: 'TRK-8901', fromDepot: 'Lagos East Depot', product: 'Dual Purpose Kerosene', status: 'Completed' },
        { id: 'TRP-309', date: '2024-01-08', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos Central Depot', product: 'Premium Motor Spirit', status: 'Completed' },
        { id: 'TRP-310', date: '2024-01-07', driver: 'Kemi Adebayo', driverId: 'DRV-005', tanker: 'TRK-8901', fromDepot: 'Lagos East Depot', product: 'Automotive Gas Oil', status: 'Completed' },
        { id: 'TRP-311', date: '2024-01-06', driver: 'Emeka Nwankwo', driverId: 'DRV-004', tanker: 'TRK-7890', fromDepot: 'Lagos East Depot', product: 'Premium Motor Spirit', status: 'In Transit' }
      ]
    }
  }

  // Mock data for depot manager's hierarchy
  const depotData = {
    'DPM-001': {
      depots: [
        {
          id: 'DEP-001',
          name: 'Port Harcourt Main Depot',
          code: 'PHC-MAIN',
          location: 'Port Harcourt, Rivers State',
          status: 'Active',
          stations: [
            { id: 'STA-001', name: 'GRA Station', manager: 'Lisa Thompson' },
            { id: 'STA-002', name: 'Mile 1 Station', manager: 'Robert Garcia' },
            { id: 'STA-003', name: 'Trans Amadi Station', manager: 'Jennifer Lee' }
          ]
        },
        {
          id: 'DEP-002',
          name: 'Port Harcourt East Depot',
          code: 'PHC-EAST',
          location: 'Eleme, Rivers State',
          status: 'Active',
          stations: [
            { id: 'STA-004', name: 'Eleme Station', manager: 'David Wilson' },
            { id: 'STA-005', name: 'Onne Station', manager: 'Mary Johnson' }
          ]
        }
      ],
      stationManagers: [
        {
          id: 'STM-001',
          name: 'Lisa Thompson',
          station: 'GRA Station',
          phone: '+234 800 000 0201',
          email: 'lisa.thompson@station.com',
          status: 'Active'
        },
        {
          id: 'STM-002',
          name: 'Robert Garcia',
          station: 'Mile 1 Station',
          phone: '+234 800 000 0202',
          email: 'robert.garcia@station.com',
          status: 'Active'
        },
        {
          id: 'STM-003',
          name: 'Jennifer Lee',
          station: 'Trans Amadi Station',
          phone: '+234 800 000 0203',
          email: 'jennifer.lee@station.com',
          status: 'Active'
        },
        {
          id: 'STM-004',
          name: 'David Wilson',
          station: 'Eleme Station',
          phone: '+234 800 000 0204',
          email: 'david.wilson@station.com',
          status: 'Active'
        },
        {
          id: 'STM-005',
          name: 'Mary Johnson',
          station: 'Onne Station',
          phone: '+234 800 000 0205',
          email: 'mary.johnson@station.com',
          status: 'Active'
        }
      ],
      trucks: [
        {
          id: 'TRK-2045',
          driver: 'Ahmed Hassan',
          status: 'Active',
          location: 'GRA Station',
          trips: 45,
          lastTrip: '2024-01-15'
        },
        {
          id: 'TRK-3012',
          driver: 'Chidi Okafor',
          status: 'Active',
          location: 'Mile 1 Station',
          trips: 38,
          lastTrip: '2024-01-14'
        },
        {
          id: 'TRK-4567',
          driver: 'Fatima Abubakar',
          status: 'Maintenance',
          location: 'Trans Amadi Station',
          trips: 52,
          lastTrip: '2024-01-10'
        },
        {
          id: 'TRK-7890',
          driver: 'Emeka Nwankwo',
          status: 'Inactive',
          location: 'Eleme Station',
          trips: 23,
          lastTrip: '2024-01-08'
        },
        {
          id: 'TRK-8901',
          driver: 'Kemi Adebayo',
          status: 'Active',
          location: 'Onne Station',
          trips: 41,
          lastTrip: '2024-01-16'
        }
      ],
      drivers: [
        {
          id: 'DRV-001',
          name: 'Ahmed Hassan',
          phone: '+234 800 000 0301',
          email: 'ahmed.hassan@driver.com',
          station: 'GRA Station',
          tanker: 'TRK-2045',
          status: 'Active',
          trips: 45
        },
        {
          id: 'DRV-002',
          name: 'Chidi Okafor',
          phone: '+234 800 000 0302',
          email: 'chidi.okafor@driver.com',
          station: 'Mile 1 Station',
          tanker: 'TRK-3012',
          status: 'Active',
          trips: 38
        },
        {
          id: 'DRV-003',
          name: 'Fatima Abubakar',
          phone: '+234 800 000 0303',
          email: 'fatima.abubakar@driver.com',
          station: 'Trans Amadi Station',
          tanker: 'TRK-4567',
          status: 'Active',
          trips: 52
        },
        {
          id: 'DRV-004',
          name: 'Emeka Nwankwo',
          phone: '+234 800 000 0304',
          email: 'emeka.nwankwo@driver.com',
          station: 'Eleme Station',
          tanker: 'TRK-7890',
          status: 'Suspended',
          trips: 23
        },
        {
          id: 'DRV-005',
          name: 'Kemi Adebayo',
          phone: '+234 800 000 0305',
          email: 'kemi.adebayo@driver.com',
          station: 'Onne Station',
          tanker: 'TRK-8901',
          status: 'Active',
          trips: 41
        }
      ]
    },
    'DPM-002': {
      depots: [
        {
          id: 'DEP-003',
          name: 'Warri Central Depot',
          code: 'WRI-CENT',
          location: 'Warri, Delta State',
          status: 'Active',
          stations: [
            { id: 'STA-006', name: 'Warri Main Station', manager: 'Ahmed Bello' },
            { id: 'STA-007', name: 'Effurun Station', manager: 'Grace Okoro' }
          ]
        }
      ],
      stationManagers: [
        {
          id: 'STM-006',
          name: 'Ahmed Bello',
          station: 'Warri Main Station',
          phone: '+234 800 000 0206',
          email: 'ahmed.bello@station.com',
          status: 'Active'
        },
        {
          id: 'STM-007',
          name: 'Grace Okoro',
          station: 'Effurun Station',
          phone: '+234 800 000 0207',
          email: 'grace.okoro@station.com',
          status: 'Active'
        }
      ],
      trucks: [
        {
          id: 'TRK-5678',
          driver: 'Musa Ibrahim',
          status: 'Active',
          location: 'Warri Main Station',
          trips: 33,
          lastTrip: '2024-01-15'
        },
        {
          id: 'TRK-9012',
          driver: 'Grace Okoro',
          status: 'Active',
          location: 'Effurun Station',
          trips: 29,
          lastTrip: '2024-01-14'
        }
      ],
      drivers: [
        {
          id: 'DRV-006',
          name: 'Musa Ibrahim',
          phone: '+234 800 000 0306',
          email: 'musa.ibrahim@driver.com',
          station: 'Warri Main Station',
          tanker: 'TRK-5678',
          status: 'Active',
          trips: 33
        },
        {
          id: 'DRV-007',
          name: 'Grace Okoro',
          phone: '+234 800 000 0307',
          email: 'grace.okoro@driver.com',
          station: 'Effurun Station',
          tanker: 'TRK-9012',
          status: 'Active',
          trips: 29
        }
      ]
    },
    'DPM-003': {
      depots: [
        {
          id: 'DEP-004',
          name: 'Kaduna North Depot',
          code: 'KAD-NORTH',
          location: 'Kaduna, Kaduna State',
          status: 'Maintenance',
          stations: [
            { id: 'STA-008', name: 'Kaduna Central Station', manager: 'Ibrahim Musa' }
          ]
        }
      ],
      stationManagers: [
        {
          id: 'STM-008',
          name: 'Ibrahim Musa',
          station: 'Kaduna Central Station',
          phone: '+234 800 000 0208',
          email: 'ibrahim.musa@station.com',
          status: 'Active'
        }
      ],
      trucks: [
        {
          id: 'TRK-1234',
          driver: 'Sani Abdullahi',
          status: 'Maintenance',
          location: 'Kaduna Central Station',
          trips: 15,
          lastTrip: '2024-01-05'
        }
      ],
      drivers: [
        {
          id: 'DRV-008',
          name: 'Sani Abdullahi',
          phone: '+234 800 000 0308',
          email: 'sani.abdullahi@driver.com',
          station: 'Kaduna Central Station',
          tanker: 'TRK-1234',
          status: 'Active',
          trips: 15
        }
      ]
    }
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          <p>No user data available</p>
          <button 
            onClick={() => navigate('/user-management')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Back to Stakeholders
          </button>
        </div>
      </div>
    )
  }

  const userDepotData = depotData[user.id] || { depots: [], stationManagers: [], trucks: [] }
  const userStationData = stationData[user.id] || { station: null, drivers: [] }

  // Mock data for driver details
  const driverData = {
    'DRV-001': {
      driver: {
        id: 'DRV-001',
        name: 'Ahmed Hassan',
        zone: 'Lagos Zone',
        status: 'Active',
        totalTrips: 45
      },
      trips: [
        {
          id: 'TRP-001',
          date: '2024-01-15',
          tanker: 'TRK-2045',
          fromDepot: 'Port Harcourt Main Depot',
          toStation: 'GRA Station',
          product: 'Premium Motor Spirit',
          quantity: '33,000L',
          status: 'Completed'
        },
        {
          id: 'TRP-002',
          date: '2024-01-14',
          tanker: 'TRK-3012',
          fromDepot: 'Port Harcourt Main Depot',
          toStation: 'Mile 1 Station',
          product: 'Automotive Gas Oil',
          quantity: '33,000L',
          status: 'Completed'
        },
        {
          id: 'TRP-003',
          date: '2024-01-13',
          tanker: 'TRK-4567',
          fromDepot: 'Port Harcourt East Depot',
          toStation: 'Trans Amadi Station',
          product: 'Premium Motor Spirit',
          quantity: '33,000L',
          status: 'Completed'
        }
      ]
    },
    'DRV-002': {
      driver: {
        id: 'DRV-002',
        name: 'Chidi Okafor',
        zone: 'Abuja Zone',
        status: 'Active',
        totalTrips: 38
      },
      trips: [
        {
          id: 'TRP-004',
          date: '2024-01-15',
          tanker: 'TRK-5678',
          fromDepot: 'Warri Central Depot',
          toStation: 'Warri Main Station',
          product: 'Premium Motor Spirit',
          quantity: '33,000L',
          status: 'Completed'
        },
        {
          id: 'TRP-005',
          date: '2024-01-12',
          tanker: 'TRK-9012',
          fromDepot: 'Warri Central Depot',
          toStation: 'Effurun Station',
          product: 'Dual Purpose Kerosene',
          quantity: '33,000L',
          status: 'Completed'
        }
      ]
    },
    'DRV-003': {
      driver: {
        id: 'DRV-003',
        name: 'Fatima Abubakar',
        zone: 'Kano Zone',
        status: 'Active',
        totalTrips: 52
      },
      trips: [
        {
          id: 'TRP-006',
          date: '2024-01-16',
          tanker: 'TRK-1234',
          fromDepot: 'Kaduna North Depot',
          toStation: 'Kaduna Central Station',
          product: 'Premium Motor Spirit',
          quantity: '33,000L',
          status: 'In Transit'
        }
      ]
    },
    'DRV-004': {
      driver: {
        id: 'DRV-004',
        name: 'Emeka Nwankwo',
        zone: 'Port Harcourt Zone',
        status: 'Suspended',
        totalTrips: 23
      },
      trips: [
        {
          id: 'TRP-007',
          date: '2024-01-08',
          tanker: 'TRK-7890',
          fromDepot: 'Port Harcourt Main Depot',
          toStation: 'Eleme Station',
          product: 'Automotive Gas Oil',
          quantity: '33,000L',
          status: 'Completed'
        }
      ]
    }
  }

  const userDriverData = driverData[user.id] || { driver: null, trips: [] }

  // Render driver view
  if (userType === 'drivers') {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate('/user-management')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <FaArrowLeft />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Driver Details</h1>
            <p className="text-sm text-gray-500">View driver performance and trip history</p>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaTruck className="text-orange-600" size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FaEnvelope size={12} />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone size={12} />
                {user.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Trips" 
            value={userDriverData.trips.length} 
            subtitle="Completed deliveries" 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Status" 
            value={user.status === 'Active' ? 'Idle' : user.status === 'In Transit' ? 'On-transit' : 'Idle'} 
            subtitle="Current status" 
            color={user.status === 'Active' ? 'bg-green-500' : user.status === 'In Transit' ? 'bg-blue-500' : 'bg-gray-500'} 
          />
          <StatCard 
            title="Tankers Used" 
            value={[...new Set(userDriverData.trips.map(trip => trip.tanker))].length} 
            subtitle="Different vehicles" 
            color="bg-orange-500" 
          />
        </div>

        {/* Trip History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip History</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trip ID</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tanker</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">From Depot</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">To Station</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</div>
              </div>
            </div>
            
            {/* Trip rows */}
            {userDriverData.trips.length === 0 ? (
              <div className="text-center text-gray-600 text-sm py-8">
                No trips found for this driver
              </div>
            ) : (
              userDriverData.trips.map((trip) => (
                <div key={trip.id} className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{trip.id}</p>
                      <p className="text-xs text-gray-500">{trip.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.tanker}</p>
                      <p className="text-xs text-gray-500">Vehicle</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.fromDepot}</p>
                      <p className="text-xs text-gray-500">Origin</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.toStation}</p>
                      <p className="text-xs text-gray-500">Destination</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.product}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        trip.status === 'Completed' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : trip.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render station manager view
  if (userType === 'station_managers') {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate('/user-management')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <FaArrowLeft />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Station Manager Details</h1>
            <p className="text-sm text-gray-500">Manage station operations and drivers</p>
          </div>
        </div>

        {/* Manager Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FaEnvelope size={12} />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone size={12} />
                {user.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Station Info */}
        {userStationData.station && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaStore className="text-blue-600" size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{userStationData.station.name}</h3>
                <p className="text-sm text-gray-500">{userStationData.station.code}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                userStationData.station.status === 'Active' 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {userStationData.station.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt size={12} />
                {userStationData.station.location}
              </div>
              <div className="text-sm text-gray-600">
                Depot: {userStationData.station.depot}
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatCard 
            title="Station Status" 
            value={userStationData.station?.status || 'Unknown'} 
            subtitle="Current status" 
            color={userStationData.station?.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'} 
          />
          <StatCard 
            title="Total Trips" 
            value={userStationData.trips?.length || 0} 
            subtitle="All station trips" 
            color="bg-blue-500" 
          />
        </div>

        {/* Station Trip History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Trip History</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trip ID</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Driver</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tanker</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">From Depot</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</div>
              </div>
            </div>
            
            {/* Trip rows */}
            {!userStationData.trips || userStationData.trips.length === 0 ? (
              <div className="text-center text-gray-600 text-sm py-8">
                No trips found for this station
              </div>
            ) : (
              userStationData.trips.map((trip) => (
                <div key={trip.id} className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{trip.id}</p>
                      <p className="text-xs text-gray-500">33,000L</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.driver}</p>
                      <p className="text-xs text-gray-500">{trip.driverId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.tanker}</p>
                      <p className="text-xs text-gray-500">Vehicle</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.fromDepot}</p>
                      <p className="text-xs text-gray-500">Origin</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{trip.product}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        trip.status === 'Completed' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : trip.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/user-management')}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <FaArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Depot Manager Details</h1>
          <p className="text-sm text-gray-500">Manage depots, stations, and station managers</p>
        </div>
      </div>

      {/* Manager Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUserTie className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <FaEnvelope size={12} />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaPhone size={12} />
              {user.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard 
          title="Total Depots" 
          value={userDepotData.depots.length} 
          subtitle="Under management" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Stations" 
          value={userDepotData.depots.reduce((total, depot) => total + depot.stations.length, 0)} 
          subtitle="Across all depots" 
          color="bg-green-500" 
        />
        <StatCard 
          title="Station Managers" 
          value={userDepotData.stationManagers.length} 
          subtitle="Direct reports" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Drivers" 
          value={userDepotData.drivers?.length || 0} 
          subtitle="Assigned drivers" 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Fleet Trucks" 
          value={userDepotData.trucks.length} 
          subtitle="Total vehicles" 
          color="bg-orange-500" 
        />
      </div>

      {/* Depots Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Managed Depots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userDepotData.depots.map((depot) => (
            <DepotCard key={depot.id} depot={depot} />
          ))}
        </div>
      </div>

      {/* Station Managers Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Managers</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 border-b border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="w-8"></div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Station</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</div>
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</div>
            </div>
          </div>
          
          {/* Station Manager rows */}
          {userDepotData.stationManagers.map((manager) => (
            <StationManagerCard key={manager.id} manager={manager} />
          ))}
        </div>
      </div>

      {/* Drivers Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Drivers</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 border-b border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="w-8"></div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Station</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tanker</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trips</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</div>
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</div>
            </div>
          </div>
          
          {/* Driver rows */}
          {userDepotData.drivers?.map((driver) => (
            <div key={driver.id} className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-orange-600" size={14} />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{driver.station}</p>
                      <p className="text-xs text-gray-500">Station</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{driver.tanker}</p>
                      <p className="text-xs text-gray-500">Assigned Vehicle</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{driver.trips}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        driver.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {driver.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-600 text-sm py-8">
              No drivers assigned to this depot
            </div>
          )}
        </div>
      </div>

      {/* Fleet Trucks Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Trucks</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 border-b border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="w-8"></div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Truck ID</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Driver</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trips</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</div>
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</div>
            </div>
          </div>
          
          {/* Truck rows */}
          {userDepotData.trucks.map((truck) => (
            <div key={truck.id} className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-orange-600" size={14} />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{truck.id}</p>
                      <p className="text-xs text-gray-500">Last Trip: {truck.lastTrip}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{truck.driver}</p>
                      <p className="text-xs text-gray-500">Driver</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{truck.location}</p>
                      <p className="text-xs text-gray-500">Current Location</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{truck.trips}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        truck.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : truck.status === 'Maintenance'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {truck.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
                    Track
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}