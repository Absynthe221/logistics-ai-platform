'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  Calendar, 
  DollarSign,
  Clock,
  Weight,
  Package,
  Route,
  Star,
  Eye,
  ArrowRight
} from 'lucide-react'
import { BarcodeGenerator } from '@logistics/shared'

// Mock data for demonstration
const loadData = [
  {
    id: '1',
    barcode: BarcodeGenerator.generate('DOM', 'LAG'),
    origin: { city: 'Lagos', state: 'Lagos' },
    destination: { city: 'Abuja', state: 'FCT' },
    distance: 760,
    weight: 2500,
    volume: 15,
    cargoType: 'Electronics',
    pickupDate: '2024-08-31',
    deliveryDate: '2024-09-02',
    rate: 450000,
    status: 'available',
    shipper: {
      name: 'TechCorp Nigeria',
      rating: 4.8,
      shipments: 45
    },
    priority: 'normal',
    description: 'Electronic components for data center setup',
    requirements: ['Temperature controlled', 'Fragile handling'],
    aiOptimized: true,
    ltlOpportunity: true
  },
  {
    id: '2',
    barcode: BarcodeGenerator.generate('DOM', 'ABJ'),
    origin: { city: 'Abuja', state: 'FCT' },
    destination: { city: 'Kano', state: 'Kano' },
    distance: 350,
    weight: 1800,
    volume: 8,
    cargoType: 'Textiles',
    pickupDate: '2024-09-01',
    deliveryDate: '2024-09-02',
    rate: 180000,
    status: 'available',
    shipper: {
      name: 'Northern Fabrics Ltd',
      rating: 4.6,
      shipments: 23
    },
    priority: 'high',
    description: 'Traditional textiles for festival season',
    requirements: ['Dry storage', 'Quick delivery'],
    aiOptimized: false,
    ltlOpportunity: true
  },
  {
    id: '3',
    barcode: BarcodeGenerator.generate('DOM', 'PHC'),
    origin: { city: 'Port Harcourt', state: 'Rivers' },
    destination: { city: 'Lagos', state: 'Lagos' },
    distance: 510,
    weight: 3200,
    volume: 20,
    cargoType: 'Machinery',
    pickupDate: '2024-09-02',
    deliveryDate: '2024-09-04',
    rate: 680000,
    status: 'in_progress',
    shipper: {
      name: 'Industrial Equipment Co',
      rating: 4.9,
      shipments: 67
    },
    priority: 'urgent',
    description: 'Heavy machinery parts for oil & gas industry',
    requirements: ['Heavy lift equipment', 'Specialized transport'],
    aiOptimized: true,
    ltlOpportunity: false
  }
]

const filters = {
  origins: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Onitsha'],
  destinations: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'],
  cargoTypes: ['Electronics', 'Textiles', 'Machinery', 'Food & Beverage', 'General Cargo'],
  priorities: ['Low', 'Normal', 'High', 'Urgent']
}

export function LoadBoard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    priority: '',
    dateRange: ''
  })
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [sortBy, setSortBy] = useState('pickupDate')

  const filteredLoads = loadData.filter(load => {
    const matchesSearch = !searchTerm || 
      load.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.cargoType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesOrigin = !selectedFilters.origin || load.origin.city === selectedFilters.origin
    const matchesDestination = !selectedFilters.destination || load.destination.city === selectedFilters.destination
    const matchesCargoType = !selectedFilters.cargoType || load.cargoType === selectedFilters.cargoType
    const matchesPriority = !selectedFilters.priority || load.priority === selectedFilters.priority.toLowerCase()

    return matchesSearch && matchesOrigin && matchesDestination && matchesCargoType && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Load Board
        </h1>
        <p className="text-gray-600">
          Find available loads and optimize your routes with AI-powered matching
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by barcode, city, or cargo type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Origin Filter */}
          <div>
            <select
              value={selectedFilters.origin}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, origin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
            >
              <option value="">All Origins</option>
              {filters.origins.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <select
              value={selectedFilters.destination}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
            >
              <option value="">All Destinations</option>
              {filters.destinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          {/* Cargo Type Filter */}
          <div>
            <select
              value={selectedFilters.cargoType}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, cargoType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
            >
              <option value="">All Cargo Types</option>
              {filters.cargoTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedFilters.priority}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              {filters.priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Options */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-logistics-100 text-logistics-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-logistics-100 text-logistics-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Map View
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
            >
              <option value="pickupDate">Pickup Date</option>
              <option value="rate">Rate</option>
              <option value="distance">Distance</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-600">
          Showing {filteredLoads.length} loads
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Available</span>
          <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
          <span>In Progress</span>
          <div className="w-3 h-3 bg-purple-500 rounded-full ml-4"></div>
          <span>AI Optimized</span>
        </div>
      </div>

      {/* Load List */}
      <div className="space-y-4">
        {filteredLoads.map(load => (
          <div key={load.id} className="load-board-item">
            <div className="flex items-start justify-between">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {/* Barcode */}
                  <div className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded">
                    {load.barcode}
                  </div>
                  
                  {/* Status */}
                  <span className={`status-badge ${getStatusColor(load.status)}`}>
                    {load.status.replace('_', ' ')}
                  </span>
                  
                  {/* Priority */}
                  <span className={`status-badge ${getPriorityColor(load.priority)}`}>
                    {load.priority}
                  </span>
                  
                  {/* AI Optimized */}
                  {load.aiOptimized && (
                    <span className="status-badge bg-purple-100 text-purple-800">
                      AI Optimized
                    </span>
                  )}
                  
                  {/* LTL Opportunity */}
                  {load.ltlOpportunity && (
                    <span className="status-badge bg-cargo-100 text-cargo-800">
                      LTL Available
                    </span>
                  )}
                </div>

                {/* Route */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 text-logistics-600 mr-1" />
                    <span className="font-medium">{load.origin.city}, {load.origin.state}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 text-route-600 mr-1" />
                    <span className="font-medium">{load.destination.city}, {load.destination.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Route className="w-4 h-4 mr-1" />
                    <span className="text-sm">{load.distance}km</span>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-sm">{load.cargoType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Weight className="w-4 h-4 mr-2" />
                    <span className="text-sm">{load.weight}kg</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Pickup: {new Date(load.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Delivery: {new Date(load.deliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">
                  {load.description}
                </p>

                {/* Requirements */}
                {load.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {load.requirements.map((req, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                )}

                {/* Shipper Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Shipper: <strong>{load.shipper.name}</strong></span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{load.shipper.rating}</span>
                    <span className="ml-1">({load.shipper.shipments} shipments)</span>
                  </div>
                </div>
              </div>

              {/* Rate and Actions */}
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ₦{load.rate.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ₦{Math.round(load.rate / load.distance)}/km
                </div>
                
                <div className="space-y-2">
                  <button className="w-full btn-primary">
                    Bid on Load
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="btn-secondary">
          Load More Results
        </button>
      </div>
    </div>
  )
}

