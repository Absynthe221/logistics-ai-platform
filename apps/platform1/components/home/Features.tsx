'use client'

import { 
  QrCode, 
  Truck, 
  MapPin, 
  Zap, 
  Shield, 
  BarChart3,
  Clock,
  DollarSign,
  Eye,
  Smartphone,
  Route,
  Users
} from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'Universal Barcode System',
    description: 'One barcode connects domestic and international shipments across Nigeria and ECOWAS',
    color: 'from-logistics-500 to-logistics-600',
    stats: '100% Trackable'
  },
  {
    icon: Truck,
    title: 'AI LTL Optimization',
    description: 'Smart load consolidation reduces costs by up to 40% with optimal route planning',
    color: 'from-cargo-500 to-cargo-600',
    stats: '40% Cost Savings'
  },
  {
    icon: MapPin,
    title: 'Real-Time Road Intelligence',
    description: 'Driver-sourced live updates on traffic, checkpoints, and road conditions',
    color: 'from-route-500 to-route-600',
    stats: '50+ Cities'
  },
  {
    icon: Shield,
    title: 'Escrow & Insurance',
    description: 'Protected payments and cargo insurance for complete peace of mind',
    color: 'from-green-500 to-green-600',
    stats: '₦500M+ Protected'
  },
  {
    icon: Eye,
    title: 'Complete Visibility',
    description: 'From pickup to delivery, track every mile with GPS precision',
    color: 'from-blue-500 to-blue-600',
    stats: '99.9% Uptime'
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Connect with verified carriers in seconds, not hours',
    color: 'from-purple-500 to-purple-600',
    stats: '<2 Min Match'
  }
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Move Cargo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop wasting time with incomplete solutions. Our integrated platform handles 
            every aspect of your logistics operations in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Stat */}
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} mr-2`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {feature.stats}
                </span>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-logistics-50 to-cargo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Platform Comparison */}
        <div className="bg-gradient-to-br from-gray-50 to-logistics-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-logistics-500 to-route-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      SME-Focused Design
                    </h4>
                    <p className="text-gray-600">
                      Built specifically for Nigerian SMEs struggling with incomplete EDI and high LTL costs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-cargo-500 to-route-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Route className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Nationwide + ECOWAS
                    </h4>
                    <p className="text-gray-600">
                      From Lagos to Accra, one platform handles all your West African logistics
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Driver Community
                    </h4>
                    <p className="text-gray-600">
                      Verified drivers providing real-time road intelligence and competitive pricing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-logistics-500 to-route-500 px-6 py-4">
                <h4 className="font-semibold text-white">Platform Comparison</h4>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Universal Barcode</span>
                    <div className="flex space-x-4">
                      <span className="text-green-600 font-medium">✓ Us</span>
                      <span className="text-red-500 font-medium">✗ Others</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">AI LTL Optimization</span>
                    <div className="flex space-x-4">
                      <span className="text-green-600 font-medium">✓ Us</span>
                      <span className="text-red-500 font-medium">✗ Others</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Road Intelligence</span>
                    <div className="flex space-x-4">
                      <span className="text-green-600 font-medium">✓ Us</span>
                      <span className="text-red-500 font-medium">✗ Others</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">ECOWAS Coverage</span>
                    <div className="flex space-x-4">
                      <span className="text-green-600 font-medium">✓ Us</span>
                      <span className="text-yellow-500 font-medium">~ Others</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">SME Pricing</span>
                    <div className="flex space-x-4">
                      <span className="text-green-600 font-medium">✓ Us</span>
                      <span className="text-red-500 font-medium">✗ Others</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

