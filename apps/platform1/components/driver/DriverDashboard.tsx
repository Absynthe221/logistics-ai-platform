'use client'

import { useState, useEffect } from 'react'
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Navigation,
  Phone,
  MessageCircle,
  Camera,
  QrCode,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Menu,
  User,
  Settings,
  LogOut
} from 'lucide-react'

interface Delivery {
  id: string
  barcode: string
  origin: { city: string; address: string }
  destination: { city: string; address: string }
  status: 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed'
  estimatedDelivery: string
  customer: { name: string; phone: string }
  cargo: { type: string; weight: string; description: string }
}

export function DriverDashboard() {
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [activeTab, setActiveTab] = useState('current')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Fetch driver's current deliveries
    fetchDriverDeliveries()
  }, [])

  const fetchDriverDeliveries = async () => {
    try {
      const response = await fetch('/api/driver/deliveries')
      if (response.ok) {
        const data = await response.json()
        setDeliveries(data)
        if (data.length > 0) {
          setCurrentDelivery(data[0]) // Set first delivery as current
        }
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    }
  }

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const response = await fetch(`/api/driver/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        fetchDriverDeliveries() // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_transit': return <Truck className="w-4 h-4" />
      case 'out_for_delivery': return <Navigation className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'delayed': return <AlertTriangle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-logistics-500 to-route-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Driver App</div>
              <div className="text-xs text-gray-500">Logistics NG</div>
            </div>
          </div>
          
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current Delivery Card */}
      {currentDelivery && (
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Delivery</h2>
              <span className={`status-badge ${getStatusColor(currentDelivery.status)} flex items-center space-x-1`}>
                {getStatusIcon(currentDelivery.status)}
                <span className="capitalize">{currentDelivery.status.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Barcode */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="font-mono text-sm text-center text-gray-700">
                {currentDelivery.barcode}
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">From</div>
                  <div className="text-sm text-gray-600">{currentDelivery.origin.city}</div>
                  <div className="text-xs text-gray-500">{currentDelivery.origin.address}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">To</div>
                  <div className="text-sm text-gray-600">{currentDelivery.destination.city}</div>
                  <div className="text-xs text-gray-500">{currentDelivery.destination.address}</div>
                </div>
              </div>
            </div>

            {/* Cargo Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Cargo Details</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Type: {currentDelivery.cargo.type}</div>
                <div>Weight: {currentDelivery.cargo.weight}</div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {currentDelivery.cargo.description}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Customer</div>
              <div className="text-sm text-gray-600">{currentDelivery.customer.name}</div>
              <div className="text-sm text-gray-600">{currentDelivery.customer.phone}</div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-primary flex items-center justify-center space-x-2 py-3">
                <Navigation className="w-4 h-4" />
                <span>Navigate</span>
              </button>
              <button className="btn-secondary flex items-center justify-center space-x-2 py-3">
                <Phone className="w-4 h-4" />
                <span>Call Customer</span>
              </button>
            </div>

            {/* Status Update */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-900 mb-2">Update Status</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateDeliveryStatus(currentDelivery.id, 'out_for_delivery')}
                  className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => updateDeliveryStatus(currentDelivery.id, 'delivered')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex">
          {[
            { id: 'current', name: 'Current', icon: Package },
            { id: 'upcoming', name: 'Upcoming', icon: Clock },
            { id: 'completed', name: 'Completed', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-logistics-600 border-b-2 border-logistics-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'current' && (
          <div className="space-y-4">
            {deliveries.filter(d => d.status === 'in_transit' || d.status === 'out_for_delivery').map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-sm text-gray-700">{delivery.barcode}</div>
                  <span className={`status-badge ${getStatusColor(delivery.status)}`}>
                    {delivery.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-2">
                  {delivery.origin.city} → {delivery.destination.city}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  ETA: {delivery.estimatedDelivery}
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 btn-primary py-2 text-sm">View Details</button>
                  <button className="flex-1 btn-secondary py-2 text-sm">Update Status</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No upcoming deliveries</p>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No completed deliveries yet</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-logistics-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-logistics-600 transition-colors">
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
