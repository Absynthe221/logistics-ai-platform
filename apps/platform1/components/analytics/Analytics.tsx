'use client'

import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react'

const metrics = [
  {
    title: 'Total Shipments',
    value: '1,247',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'from-logistics-500 to-logistics-600'
  },
  {
    title: 'Revenue',
    value: '₦2.5M',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Active Carriers',
    value: '120',
    change: '+15.3%',
    trend: 'up',
    icon: Truck,
    color: 'from-cargo-500 to-cargo-600'
  },
  {
    title: 'Avg Delivery Time',
    value: '2.3 days',
    change: '-0.5 days',
    trend: 'up',
    icon: Clock,
    color: 'from-blue-500 to-blue-600'
  }
]

const routeAnalytics = [
  { route: 'Lagos → Abuja', shipments: 345, revenue: '₦890K', avgTime: '8.5h' },
  { route: 'Abuja → Kano', shipments: 234, revenue: '₦567K', avgTime: '6.2h' },
  { route: 'Lagos → Port Harcourt', shipments: 189, revenue: '₦445K', avgTime: '9.1h' },
  { route: 'Kano → Lagos', shipments: 156, revenue: '₦378K', avgTime: '12.3h' },
  { route: 'Lagos → Ibadan', shipments: 123, revenue: '₦289K', avgTime: '2.8h' }
]

const aiInsights = [
  {
    title: 'LTL Optimization Savings',
    value: '₦450K',
    description: 'Saved through AI-powered load consolidation this month',
    icon: Zap,
    color: 'text-purple-600'
  },
  {
    title: 'Route Efficiency',
    value: '87%',
    description: 'Average route efficiency improvement with AI optimization',
    icon: Target,
    color: 'text-green-600'
  },
  {
    title: 'Predictive Accuracy',
    value: '94%',
    description: 'ETA prediction accuracy using our AI models',
    icon: Activity,
    color: 'text-blue-600'
  }
]

export function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time insights and AI-powered analytics for your logistics operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-gray-600 text-sm">
              {metric.title}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Shipment Volume Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Monthly Shipment Volume
          </h3>
          
          {/* Simple Chart Visualization */}
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => {
              const value = Math.floor(Math.random() * 100) + 20
              return (
                <div key={month} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600">{month}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-logistics-500 to-cargo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-900 font-medium">
                    {Math.floor(value * 12)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Revenue by Cargo Type
          </h3>
          
          <div className="space-y-4">
            {[
              { type: 'Electronics', percentage: 35, revenue: '₦875K' },
              { type: 'Textiles', percentage: 25, revenue: '₦625K' },
              { type: 'Machinery', percentage: 20, revenue: '₦500K' },
              { type: 'Food & Beverage', percentage: 15, revenue: '₦375K' },
              { type: 'Others', percentage: 5, revenue: '₦125K' }
            ].map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-20 text-sm text-gray-600">{item.type}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-logistics-500' :
                          index === 1 ? 'bg-cargo-500' :
                          index === 2 ? 'bg-route-500' :
                          index === 3 ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">
                    {item.percentage}%
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-900 font-medium text-right">
                  {item.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-logistics-50 to-cargo-50 rounded-xl p-6 border border-logistics-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-logistics-500 to-cargo-500 rounded-full flex items-center justify-center mr-3">
            <Zap className="w-4 h-4 text-white" />
          </span>
          AI-Powered Insights
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <insight.icon className={`w-6 h-6 ${insight.color} mr-3`} />
                <div className="text-2xl font-bold text-gray-900">
                  {insight.value}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {insight.title}
              </h4>
              <p className="text-sm text-gray-600">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Routes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Top Performing Routes
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Route</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Shipments</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Avg Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {routeAnalytics.map((route, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{route.route}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{route.shipments}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{route.revenue}</td>
                  <td className="py-4 px-4 text-gray-900">{route.avgTime}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-logistics-500 to-cargo-500 h-2 rounded-full"
                          style={{ width: `${85 + index * 2}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{85 + index * 2}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

