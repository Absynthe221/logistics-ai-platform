'use client'

import { 
  Upload, 
  Search, 
  Truck, 
  MapPin, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Create Shipment',
    description: 'Upload cargo details and get instant barcode. AI suggests optimal packaging and routing.',
    details: ['Instant barcode generation', 'AI route optimization', 'Automatic documentation'],
    color: 'from-logistics-500 to-logistics-600'
  },
  {
    number: 2,
    icon: Search,
    title: 'Find Carriers',
    description: 'Our AI matches you with verified carriers based on route, capacity, and price.',
    details: ['Verified carrier network', 'Real-time pricing', 'Instant quotes'],
    color: 'from-cargo-500 to-cargo-600'
  },
  {
    number: 3,
    icon: Truck,
    title: 'Track & Optimize',
    description: 'Monitor real-time location with road intelligence. Get live updates from drivers.',
    details: ['GPS tracking', 'Road condition alerts', 'ETA predictions'],
    color: 'from-route-500 to-route-600'
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Secure Delivery',
    description: 'Confirm delivery with digital proof. Automatic payment release from escrow.',
    details: ['Digital proof of delivery', 'Automatic payments', 'Customer feedback'],
    color: 'from-green-500 to-green-600'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-logistics-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From cargo to delivery in 4 simple steps. Our AI handles the complexity, 
            you focus on your business.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-logistics-200 via-cargo-200 via-route-200 to-green-200"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                  {/* Step Number */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 relative z-10`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color} mr-3`}></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 z-20">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Ready to Streamline Your Logistics?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of SMEs already saving time and money with our AI-powered platform.
            No setup fees, no long-term contracts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-lg px-8 py-4 flex items-center">
              Start Your First Shipment
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <div className="flex items-center text-gray-600">
              <div className="flex -space-x-1 mr-3">
                <div className="w-8 h-8 bg-logistics-100 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-cargo-100 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-route-100 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                  +50
                </div>
              </div>
              <span className="text-sm">SMEs trust our platform</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-logistics-500 to-cargo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Live Tracking</h4>
            <p className="text-gray-600 text-sm">
              Real-time GPS tracking with road intelligence updates from our driver network
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-cargo-500 to-route-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Optimization</h4>
            <p className="text-gray-600 text-sm">
              Smart load consolidation and route optimization saves up to 40% on shipping costs
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-route-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
            <p className="text-gray-600 text-sm">
              Escrow protection ensures safe transactions for both shippers and carriers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

