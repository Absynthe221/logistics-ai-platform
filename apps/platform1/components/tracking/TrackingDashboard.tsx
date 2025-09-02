'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Navigation,
  Eye,
  QrCode,
  Camera,
  RefreshCw,
  Phone,
  MessageCircle,
  Share2
} from 'lucide-react'
import { BarcodeGenerator } from '@logistics/shared'

// Mock tracking data
const generateTrackingData = (barcode: string) => {
  const mockEvents = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      status: 'Shipment Created',
      location: 'Lagos, Nigeria',
      coordinates: { lat: 6.5244, lng: 3.3792 },
      description: 'Shipment registered and barcode generated',
      icon: CheckCircle,
      color: 'text-green-600',
      completed: true
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'Picked Up',
      location: 'Lagos Industrial Estate',
      coordinates: { lat: 6.5833, lng: 3.3500 },
      description: 'Package collected from shipper location',
      icon: Truck,
      color: 'text-blue-600',
      completed: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'In Transit',
      location: 'Lagos-Ibadan Expressway',
      coordinates: { lat: 6.8333, lng: 3.5833 },
      description: 'Vehicle departed Lagos, en route to Abuja',
      icon: Navigation,
      color: 'text-blue-600',
      completed: true
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'Traffic Delay',
      location: 'Ogun State Checkpoint',
      coordinates: { lat: 7.1500, lng: 3.3500 },
      description: 'Minor delay due to security checkpoint - 30 minutes',
      icon: AlertTriangle,
      color: 'text-orange-600',
      completed: true
    },
    {
      id: '5',
      timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'Expected Arrival',
      location: 'Abuja Central Area',
      coordinates: { lat: 9.0579, lng: 7.4951 },
      description: 'Estimated arrival at destination',
      icon: MapPin,
      color: 'text-purple-600',
      completed: false
    }
  ]

  return {
    barcode,
    currentStatus: 'In Transit',
    progress: 75,
    estimatedDelivery: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
    origin: { city: 'Lagos', address: 'Industrial Estate, Lagos' },
    destination: { city: 'Abuja', address: 'Central Business District, Abuja' },
    distance: 760,
    events: mockEvents,
    driver: {
      name: 'Mohammed Ibrahim',
      phone: '+234-803-123-4567',
      rating: 4.8,
      vehicle: 'Truck - AAA-123-XY'
    },
    cargo: {
      type: 'Electronics',
      weight: '2,500 kg',
      value: '₦4,500,000',
      description: 'Computer equipment and accessories'
    },
    aiInsights: [
      'Route optimized for 15% fuel savings',
      'Weather conditions: Clear skies',
      'Traffic alert: Minor delays expected at Mile 2'
    ]
  }
}

export function TrackingDashboard() {
  const [searchBarcode, setSearchBarcode] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [scanMode, setScanMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !trackingData) return

    const interval = setInterval(() => {
      // In real app, this would fetch fresh data
      console.log('Refreshing tracking data...')
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, trackingData])

  const handleSearch = () => {
    if (!searchBarcode.trim()) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (BarcodeGenerator.validate(searchBarcode)) {
        setTrackingData(generateTrackingData(searchBarcode))
      } else {
        alert('Invalid barcode format')
      }
      setLoading(false)
    }, 1000)
  }

  const handleScanBarcode = () => {
    setScanMode(true)
    // In real app, this would open camera scanner
    // For demo, we'll just generate a sample barcode
    setTimeout(() => {
      const sampleBarcode = BarcodeGenerator.generate('DOM', 'LAG')
      setSearchBarcode(sampleBarcode)
      setScanMode(false)
      handleSearch()
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'in transit': return 'bg-blue-100 text-blue-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      case 'picked up': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Track Your Shipment
        </h1>
        <p className="text-gray-600">
          Enter your barcode to get real-time updates and AI-powered insights
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your tracking barcode (e.g., LNG-DOM-LAG-A7K9M2N5)"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary px-6 py-3 flex items-center"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Search className="w-5 h-5 mr-2" />
              )}
              Track
            </button>
            
            <button
              onClick={handleScanBarcode}
              disabled={scanMode}
              className="btn-secondary px-6 py-3 flex items-center"
            >
              {scanMode ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Camera className="w-5 h-5 mr-2" />
              )}
              Scan QR
            </button>
          </div>
        </div>

        {/* QR Scanner Mode */}
        {scanMode && (
          <div className="mt-6 p-8 bg-gray-50 rounded-lg text-center">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Point your camera at the QR code...
            </p>
            <div className="mt-4 w-16 h-16 border-4 border-logistics-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-8">
          {/* Status Overview */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Current Status Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`p-2 rounded-lg transition-colors ${autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className={`status-badge ${getStatusColor(trackingData.currentStatus)}`}>
                    {trackingData.currentStatus}
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  {trackingData.barcode}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {trackingData.origin.city} → {trackingData.destination.city}
                  </span>
                  <span className="ml-2 text-sm">({trackingData.distance}km)</span>
                </div>
                
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{trackingData.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${trackingData.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>ETA: {trackingData.estimatedDelivery.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Info</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900">{trackingData.driver.name}</div>
                  <div className="text-sm text-gray-600">{trackingData.driver.vehicle}</div>
                </div>
                
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(trackingData.driver.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{trackingData.driver.rating}</span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-logistics-100 text-logistics-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Cargo Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-medium text-gray-900">{trackingData.cargo.type}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="font-medium text-gray-900">{trackingData.cargo.weight}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Value</div>
                  <div className="font-medium text-gray-900">{trackingData.cargo.value}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Description</div>
                  <div className="text-sm text-gray-700">{trackingData.cargo.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-logistics-50 to-cargo-50 rounded-xl p-6 border border-logistics-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-logistics-500 to-cargo-500 rounded-full flex items-center justify-center mr-3">
                <Truck className="w-4 h-4 text-white" />
              </span>
              AI Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {trackingData.aiInsights.map((insight: string, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-700">{insight}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipment Timeline</h3>
            
            <div className="space-y-6">
              {trackingData.events.map((event: any, index: number) => (
                <div key={event.id} className="flex items-start">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    event.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <event.icon className={`w-5 h-5 ${event.completed ? event.color : 'text-gray-400'}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {event.status}
                      </h4>
                      <span className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {event.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {event.description}
                    </p>
                    <p className={`text-sm mt-1 ${event.completed ? 'text-gray-500' : 'text-gray-400'}`}>
                      📍 {event.location}
                    </p>
                  </div>
                  
                  {/* Connection Line */}
                  {index < trackingData.events.length - 1 && (
                    <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                      event.completed ? 'bg-green-200' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Map View</h3>
            <div className="bg-gradient-to-br from-logistics-50 to-route-50 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-logistics-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map with real-time vehicle location</p>
                <p className="text-sm text-gray-500 mt-2">
                  Current position: Lagos-Ibadan Expressway
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

