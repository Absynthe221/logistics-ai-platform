'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react'

interface Shipment {
  id: string
  barcode: string
  origin: { city: string; address: string }
  destination: { city: string; address: string }
  status: string
  createdAt: string
  estimatedDelivery: string
  value: number
  category: string
}

interface Load {
  id: string
  loadNumber: string
  origin: { city: string; address: string }
  destination: { city: string; address: string }
  status: string
  rate: number
  weight: number
  cargoType: string
}

export function UserDashboard() {
  const { data: session } = useSession()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loads, setLoads] = useState<Load[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole, setUserRole] = useState<'SHIPPER' | 'CARRIER' | 'DRIVER'>('SHIPPER')

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role as any)
    }
    fetchUserData()
  }, [session])

  const fetchUserData = async () => {
    try {
      // Fetch shipments
      const shipmentsResponse = await fetch('/api/shipments')
      if (shipmentsResponse.ok) {
        const shipmentsData = await shipmentsResponse.json()
        setShipments(shipmentsData)
      }

      // Fetch loads if carrier
      if (userRole === 'CARRIER') {
        const loadsResponse = await fetch('/api/loads')
        if (loadsResponse.ok) {
          const loadsData = await loadsResponse.json()
          setLoads(loadsData)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStats = () => {
    const totalShipments = shipments.length
    const activeShipments = shipments.filter(s => s.status === 'IN_TRANSIT').length
    const completedShipments = shipments.filter(s => s.status === 'DELIVERED').length
    const totalValue = shipments.reduce((sum, s) => sum + s.value, 0)

    return { totalShipments, activeShipments, completedShipments, totalValue }
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || 'User'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'SHIPPER' ? 'Manage your shipments and track deliveries' : 
             userRole === 'CARRIER' ? 'Find loads and manage your fleet' : 
             'Track your deliveries and update status'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalShipments}
          </div>
          <div className="text-gray-600 text-sm">Total Shipments</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.activeShipments}
          </div>
          <div className="text-gray-600 text-sm">Active Shipments</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ₦{(stats.totalValue / 1000000).toFixed(1)}M
          </div>
          <div className="text-gray-600 text-sm">Total Value</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.completedShipments}
          </div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: Package },
              { id: 'shipments', name: 'Shipments', icon: Truck },
              ...(userRole === 'CARRIER' ? [{ id: 'loads', name: 'Loads', icon: Package }] : []),
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-logistics-500 text-logistics-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link href="/send-packages" className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Shipment</span>
                </Link>
              </div>

              <div className="space-y-4">
                {shipments.slice(0, 5).map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-logistics-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-logistics-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{shipment.barcode}</div>
                        <div className="text-sm text-gray-600">
                          {shipment.origin.city} → {shipment.destination.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`status-badge ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Shipments</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search shipments..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    />
                  </div>
                  <Link href="/send-packages" className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Shipment</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono text-sm text-gray-700">{shipment.barcode}</div>
                      <span className={`status-badge ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Route</div>
                        <div className="text-sm text-gray-600">
                          {shipment.origin.city} → {shipment.destination.city}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Value</div>
                        <div className="text-sm text-gray-600">₦{shipment.value.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Category</div>
                        <div className="text-sm text-gray-600">{shipment.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(shipment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'loads' && userRole === 'CARRIER' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Available Loads</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search loads..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    />
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {loads.map((load) => (
                  <div key={load.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono text-sm text-gray-700">{load.loadNumber}</div>
                      <span className={`status-badge ${getStatusColor(load.status)}`}>
                        {load.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Route</div>
                        <div className="text-sm text-gray-600">
                          {load.origin.city} → {load.destination.city}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Rate</div>
                        <div className="text-sm text-gray-600">₦{load.rate.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Weight</div>
                        <div className="text-sm text-gray-600">{load.weight}kg</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Cargo</div>
                        <div className="text-sm text-gray-600">{load.cargoType}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Load ID: {load.id.slice(0, 8)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="btn-primary py-2 px-4 text-sm">Bid on Load</button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics & Insights</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Analytics dashboard coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
