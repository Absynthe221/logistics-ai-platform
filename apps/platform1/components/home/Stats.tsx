'use client'

import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  MapPin,
  Truck,
  Users,
  Package,
  Shield
} from 'lucide-react'

const stats = [
  {
    icon: DollarSign,
    value: '₦2.5M+',
    label: 'Freight Value Moved',
    subtext: 'Total cargo value processed',
    color: 'from-green-500 to-green-600',
    growth: '+150%'
  },
  {
    icon: Package,
    value: '1,250+',
    label: 'Shipments Delivered',
    subtext: 'Successfully completed',
    color: 'from-logistics-500 to-logistics-600',
    growth: '+89%'
  },
  {
    icon: Truck,
    value: '120+',
    label: 'Active Carriers',
    subtext: 'Verified logistics partners',
    color: 'from-cargo-500 to-cargo-600',
    growth: '+67%'
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Cities Connected',
    subtext: 'Across Nigeria & ECOWAS',
    color: 'from-route-500 to-route-600',
    growth: '+200%'
  },
  {
    icon: Clock,
    value: '40%',
    label: 'Time Saved',
    subtext: 'Average reduction in logistics time',
    color: 'from-blue-500 to-blue-600',
    growth: 'Consistent'
  },
  {
    icon: Shield,
    value: '99.8%',
    label: 'Success Rate',
    subtext: 'On-time deliveries',
    color: 'from-purple-500 to-purple-600',
    growth: 'Industry Leading'
  }
]

const milestones = [
  {
    month: 'Jan 2024',
    title: 'Platform Launch',
    description: 'Started with Lagos-Abuja corridor',
    shipments: 45,
    carriers: 8
  },
  {
    month: 'Mar 2024',
    title: 'ECOWAS Expansion',
    description: 'Extended to Ghana and Togo',
    shipments: 180,
    carriers: 25
  },
  {
    month: 'Jun 2024',
    title: 'AI Integration',
    description: 'Launched LTL optimization',
    shipments: 520,
    carriers: 65
  },
  {
    month: 'Aug 2024',
    title: 'Current Scale',
    description: 'Nationwide coverage achieved',
    shipments: 1250,
    carriers: 120
  }
]

export function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Powering Nigeria's Logistics Revolution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real numbers from real businesses. See how we're transforming freight 
            logistics across West Africa.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-6`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Value */}
              <div className="mb-2">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="ml-2 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.growth}
                </span>
              </div>
              
              {/* Label */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {stat.label}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.subtext}
              </p>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Growth Timeline */}
        <div className="bg-gradient-to-br from-logistics-50 to-cargo-50 rounded-2xl p-8 lg:p-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Our Growth Journey
            </h3>
            <p className="text-lg text-gray-600">
              From local startup to ECOWAS logistics leader in just 8 months
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-logistics-300 via-cargo-300 to-route-300 hidden lg:block"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="w-12 h-12 bg-gradient-to-r from-logistics-500 to-cargo-500 rounded-full flex items-center justify-center text-white font-bold mb-6 relative z-10">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-logistics-600 mb-2">
                      {milestone.month}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {milestone.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {milestone.shipments}
                        </div>
                        <div className="text-xs text-gray-600">Shipments</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {milestone.carriers}
                        </div>
                        <div className="text-xs text-gray-600">Carriers</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Metrics */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              Real Impact on Nigerian Businesses
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    40% Cost Reduction
                  </h4>
                  <p className="text-gray-600">
                    AI-powered LTL optimization saves SMEs an average of ₦400,000 monthly on shipping costs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-6">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    3 Hours Saved Daily
                  </h4>
                  <p className="text-gray-600">
                    Automated carrier matching and documentation eliminates manual logistics coordination
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    95% Customer Satisfaction
                  </h4>
                  <p className="text-gray-600">
                    Real-time visibility and predictable delivery times improve customer relationships
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chart Placeholder */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-6">Monthly Growth Trend</h4>
            
            {/* Simplified Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shipment Volume</span>
                <span className="text-sm font-medium text-green-600">+89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-logistics-500 to-route-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Carrier Network</span>
                <span className="text-sm font-medium text-green-600">+67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-cargo-500 to-logistics-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Geographic Coverage</span>
                <span className="text-sm font-medium text-green-600">+200%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-route-500 to-cargo-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-logistics-50 to-cargo-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Next milestone:</strong> 2,500 shipments and 200 carriers by Dec 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

