import Link from 'next/link'
import { ArrowRight, CheckCircle, Truck, QrCode, Zap, Shield } from 'lucide-react'

const benefits = [
  {
    icon: QrCode,
    text: 'Universal barcode for all shipments'
  },
  {
    icon: Truck,
    text: 'AI-powered carrier matching'
  },
  {
    icon: Zap,
    text: 'Real-time tracking & optimization'
  },
  {
    icon: Shield,
    text: 'Escrow protection & insurance'
  }
]

export function CTA() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA Content */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your 
              <span className="block text-yellow-300">Logistics Operations?</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Join the logistics revolution. Start shipping smarter with AI-powered optimization, 
              real-time tracking, and Nigeria's most trusted carrier network.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div 
                    key={index}
                    className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <IconComponent className="h-6 w-6 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white text-sm font-medium">{benefit.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/send-packages"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg 
                         hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 
                         flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Start Shipping Now</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/track"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg 
                         hover:bg-white hover:text-blue-600 transition-all duration-300 
                         flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Track Shipment</span>
                <QrCode className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-blue-500/50">
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>NIPOST Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>CAC Registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Insurance Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}