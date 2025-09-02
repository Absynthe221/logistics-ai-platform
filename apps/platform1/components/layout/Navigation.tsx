'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Truck, 
  Search, 
  Package, 
  BarChart3, 
  Menu, 
  X,
  QrCode,
  MapPin,
  User,
  Bell,
  LogOut,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Truck },
  { name: 'Dashboards', href: '/dashboards', icon: BarChart3 },

  { name: 'Load Board', href: '/load-board', icon: Package },
  { name: 'Track Shipment', href: '/track', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-logistics-500 to-route-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Logistics NG</div>
              <div className="text-xs text-gray-500">AI-Powered Freight</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-logistics-600 px-3 py-2 rounded-lg hover:bg-logistics-50 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            {/* Start Shipping Button */}
            <Link
              href="/send-packages"
              className="bg-gradient-to-r from-logistics-500 to-route-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-logistics-600 hover:to-route-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shipping
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Track */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Quick track..."
                  className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {session ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-logistics-400 to-cargo-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{session.user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{session.user.role}</div>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      {session.user.role === 'DRIVER' && (
                        <Link
                          href="/driver"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Driver App</span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-600 hover:text-logistics-600 px-3 py-3 rounded-lg hover:bg-logistics-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Start Shipping Button */}
              <Link
                href="/send-packages"
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-logistics-500 to-route-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-logistics-600 hover:to-route-600 transition-all duration-200 shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Truck className="w-5 h-5" />
                <span className="font-medium">Start Shipping</span>
              </Link>
            </div>
            
            {/* Mobile Quick Track */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter barcode to track..."
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Mobile Login/User Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    <div className="font-medium">{session.user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{session.user.role}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-600 hover:text-logistics-600 px-3 py-3 rounded-lg hover:bg-logistics-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 text-gray-600 hover:text-logistics-600 px-3 py-3 rounded-lg hover:bg-logistics-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                  {session.user.role === 'DRIVER' && (
                    <Link
                      href="/driver"
                      className="flex items-center space-x-3 text-gray-600 hover:text-logistics-600 px-3 py-3 rounded-lg hover:bg-logistics-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">Driver App</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-3 text-logistics-600 hover:text-logistics-700 px-3 py-3 rounded-lg hover:bg-logistics-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

