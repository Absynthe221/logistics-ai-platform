'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  QrCode, 
  MapPin, 
  Zap, 
  ArrowRight,
  Play,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react'
import { BarcodeGenerator } from '@logistics/shared'

export function Hero() {
  const [sampleBarcode] = useState(() => 
    BarcodeGenerator.generate('DOM', 'LAG')
  )

  return (
    <div className="relative bg-gradient-to-br from-logistics-50 via-white to-cargo-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-logistics-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cargo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-route-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-logistics-100 text-logistics-700 rounded-full text-sm font-medium mb-6">
              <Truck className="w-4 h-4 mr-2" />
              🇳🇬 Nigeria's First AI-Powered Freight Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">One Barcode,</span><br />
              <span className="text-gray-900">One Dashboard,</span><br />
              <span className="gradient-text">Complete Visibility</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Stop losing money on incomplete EDI and high LTL costs. Our AI-powered platform 
              connects shippers and carriers across Nigeria with real-time tracking and route optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/send-packages" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                Start Shipping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link href="/auth/signin" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-logistics-300 transition-colors">
                Login to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <BarChart3 className="w-6 h-6 text-logistics-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">₦2.5M+</span>
                </div>
                <p className="text-sm text-gray-600">Freight Value Moved</p>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <MapPin className="w-6 h-6 text-route-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">50+</span>
                </div>
                <p className="text-sm text-gray-600">Cities Connected</p>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Clock className="w-6 h-6 text-cargo-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">40%</span>
                </div>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Live Barcode Demo */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Live Tracking Demo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Scan or track with your universal barcode
                  </p>
                </div>
                
                {/* Sample Barcode */}
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="font-mono text-2xl font-bold text-gray-900 mb-4 tracking-wider">
                    {sampleBarcode}
                  </div>
                  <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {BarcodeGenerator.describe(sampleBarcode)}
                  </p>
                </div>
                
                {/* Status Demo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-logistics-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-logistics-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Picked up from Lagos</span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-cargo-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-cargo-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-900">In transit to Abuja</span>
                    </div>
                    <span className="text-xs text-gray-500">ETA: 8 hours</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-500">Pending delivery</span>
                    </div>
                    <span className="text-xs text-gray-400">Tomorrow</span>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="bg-gradient-to-r from-route-50 to-logistics-50 rounded-lg p-4 border border-route-200">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-route-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        AI Optimization Active
                      </p>
                      <p className="text-xs text-gray-600">
                        Route optimized for 15% fuel savings. No traffic delays detected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-route-400 to-route-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cargo-400 to-cargo-600 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white truck-animation" />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm mb-6">
            Trusted by SMEs and enterprises across Nigeria
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-600 font-medium">
              Lagos Importers Ltd
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-600 font-medium">
              Kano Distributors
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-600 font-medium">
              Abuja Logistics Co
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-600 font-medium">
              PHC Freight Inc
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

