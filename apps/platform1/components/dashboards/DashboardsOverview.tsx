'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  BarChart3, 
  Truck, 
  Package, 
  Settings, 
  Users, 
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react'

const dashboards = [
  {
    id: 'admin',
    name: 'Admin Dashboard',
    description: 'System overview, user management, and analytics',
    icon: Settings,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    route: '/admin',
    roles: ['ADMIN'],
    features: [
      'System health monitoring',
      'User management',
      'Analytics & reporting',
      'System configuration'
    ]
  },
  {
    id: 'user',
    name: 'User Dashboard',
    description: 'Manage shipments, track deliveries, and view analytics',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    route: '/dashboard',
    roles: ['SHIPPER', 'CARRIER', 'DRIVER'],
    features: [
      'Shipment management',
      'Real-time tracking',
      'Performance analytics',
      'Load board access'
    ]
  },
  {
    id: 'driver',
    name: 'Driver App',
    description: 'Mobile-first interface for delivery operations',
    icon: Truck,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    route: '/driver',
    roles: ['DRIVER'],
    features: [
      'Current deliveries',
      'Status updates',
      'Route navigation',
      'Customer communication'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Performance metrics and business insights',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    route: '/analytics',
    roles: ['ADMIN', 'SHIPPER', 'CARRIER'],
    features: [
      'Revenue tracking',
      'Route optimization',
      'Performance metrics',
      'AI insights'
    ]
  },
  {
    id: 'load-board',
    name: 'Load Board',
    description: 'Freight marketplace and carrier matching',
    icon: Package,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
    route: '/load-board',
    roles: ['SHIPPER', 'CARRIER'],
    features: [
      'Available loads',
      'AI optimization',
      'LTL opportunities',
      'Real-time matching'
    ]
  },
  {
    id: 'tracking',
    name: 'Shipment Tracking',
    description: 'Real-time shipment status and location',
    icon: MapPin,
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100',
    route: '/track',
    roles: ['SHIPPER', 'CARRIER', 'DRIVER'],
    features: [
      'Live tracking',
      'Status updates',
      'Barcode scanning',
      'ETA predictions'
    ]
  }
]

export function DashboardsOverview() {
  const { data: session } = useSession()

  const canAccess = (dashboard: any) => {
    if (!session) return false
    return dashboard.roles.includes(session.user.role)
  }

  const getAccessLevel = (dashboard: any) => {
    if (!session) return 'login-required'
    if (canAccess(dashboard)) return 'accessible'
    return 'restricted'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Your Dashboards
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the right dashboard for your role and start managing your logistics operations
        </p>
      </div>

      {/* Authentication Status */}
      {!session ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <Lock className="w-8 h-8 text-yellow-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Login Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Sign in to access your role-specific dashboards
              </p>
              <Link
                href="/auth/signin"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Sign In Now</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Welcome, {session.user.name}!
              </h3>
              <p className="text-green-700">
                You're logged in as a <span className="font-semibold capitalize">{session.user.role}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboards Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => {
          const accessLevel = getAccessLevel(dashboard)
          const isAccessible = accessLevel === 'accessible'
          
          return (
            <div
              key={dashboard.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                isAccessible 
                  ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' 
                  : 'border-gray-100 opacity-75'
              }`}
            >
              {/* Header */}
              <div className={`p-6 ${dashboard.bgColor} rounded-t-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${dashboard.color} rounded-lg flex items-center justify-center`}>
                    <dashboard.icon className="w-6 h-6 text-white" />
                  </div>
                  {accessLevel === 'accessible' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : accessLevel === 'restricted' ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {dashboard.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {dashboard.description}
                </p>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {dashboard.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Access Control */}
                <div className="space-y-3">
                  {accessLevel === 'accessible' ? (
                    <Link
                      href={dashboard.route}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <span>Access Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : accessLevel === 'restricted' ? (
                    <div className="text-center py-3 text-gray-500 text-sm">
                      <Lock className="w-4 h-4 mx-auto mb-1" />
                      Role restricted
                    </div>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      <span>Login Required</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* Role Access */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Available for:</div>
                  <div className="flex flex-wrap gap-1">
                    {dashboard.roles.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session?.user?.role === role
                            ? 'bg-logistics-100 text-logistics-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      {session && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary px-6 py-3 flex items-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </Link>
            
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="btn-secondary px-6 py-3 flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            )}
            
            {session.user.role === 'DRIVER' && (
              <Link
                href="/driver"
                className="btn-secondary px-6 py-3 flex items-center space-x-2"
              >
                <Truck className="w-5 h-5" />
                <span>Driver App</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
