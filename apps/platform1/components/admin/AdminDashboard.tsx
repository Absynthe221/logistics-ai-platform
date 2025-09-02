'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  BarChart3,
  Settings,
  UserPlus,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react'
import { FreightRequests } from './FreightRequests'

interface SystemStats {
  totalUsers: number
  activeShipments: number
  totalRevenue: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
  recentAlerts: Array<{
    id: string
    type: 'error' | 'warning' | 'info'
    message: string
    timestamp: string
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeShipments: 0,
    totalRevenue: 0,
    systemHealth: 'excellent',
    recentAlerts: []
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Fetch admin dashboard data
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />
      case 'good': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'critical': return <XCircle className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          System overview and management for logistics platform
        </p>
      </div>

      {/* System Health Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getHealthColor(stats.systemHealth)}`}>
              {getHealthIcon(stats.systemHealth)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <p className="text-sm text-gray-600 capitalize">{stats.systemHealth}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm">Active Users</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.activeShipments.toLocaleString()}
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
            ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-gray-600 text-sm">Total Revenue</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            98.5%
          </div>
          <div className="text-gray-600 text-sm">Uptime</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'freight', name: 'Freight Requests', icon: FileText },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'shipments', name: 'Shipments', icon: Package },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'settings', name: 'Settings', icon: Settings }
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
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                      { action: 'Shipment delivered', time: '15 minutes ago', type: 'shipment' },
                      { action: 'Payment processed', time: '1 hour ago', type: 'payment' },
                      { action: 'System backup completed', time: '2 hours ago', type: 'system' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-logistics-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.action}</div>
                          <div className="text-xs text-gray-500">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Alerts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
                  <div className="space-y-3">
                    {stats.recentAlerts.length > 0 ? (
                      stats.recentAlerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg ${
                          alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                          alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`w-4 h-4 ${
                              alert.type === 'error' ? 'text-red-600' :
                              alert.type === 'warning' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                            <span className="text-sm font-medium text-gray-900">{alert.message}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p>No active alerts</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'freight' && (
            <div>
              <FreightRequests />
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button className="btn-primary flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">User management interface coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipment Overview</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Shipment management interface coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Analytics</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Advanced analytics dashboard coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">System configuration interface coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
