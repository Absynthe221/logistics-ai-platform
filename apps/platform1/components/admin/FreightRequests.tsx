'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Truck,
  Plane,
  Ship,
  AlertCircle,
  RefreshCw,
  FileText,
  DollarSign
} from 'lucide-react'

interface FreightRequest {
  id: string
  barcode: string
  shipperName: string
  shipperEmail?: string
  shipperPhone?: string
  consigneeName: string
  consigneeEmail?: string
  consigneePhone?: string
  freightType: string
  transportMode: string
  cargoDescription: string
  weight: number
  volume: number
  status: string
  createdAt: string
  adminNotified: boolean
  adminNotificationSent: string
}

export function FreightRequests() {
  const { data: session } = useSession()
  const [freightRequests, setFreightRequests] = useState<FreightRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchFreightRequests()
    }
  }, [session])

  const fetchFreightRequests = async () => {
    try {
      const response = await fetch('/api/freight')
      if (response.ok) {
        const data = await response.json()
        setFreightRequests(data.freightRequests || [])
      }
    } catch (error) {
      console.error('Error fetching freight requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchFreightRequests()
    setRefreshing(false)
  }

  const markPaymentReceived = async (freightId: string) => {
    try {
      const response = await fetch(`/api/freight/${freightId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' })
      })
      
      if (response.ok) {
        await fetchFreightRequests() // Refresh the list
        alert('Payment marked as received!')
      }
    } catch (error) {
      console.error('Error marking payment:', error)
      alert('Failed to mark payment as received')
    }
  }

  const generateInvoice = (freight: FreightRequest) => {
    // Open invoice in new window/tab
    const invoiceWindow = window.open('', '_blank')
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Shipping Invoice - ${freight.barcode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Logistics Nigeria</h1>
            <h2>Shipping Invoice</h2>
            <p>Invoice #: INV-${Date.now()}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Barcode: ${freight.barcode}</p>
          </div>
          
          <div class="section">
            <h3>Shipper Details</h3>
            <p>${freight.shipperName}</p>
            <p>Contact: ${freight.shipperName}</p>
            <p>${freight.shipperEmail}</p>
            <p>${freight.shipperPhone}</p>
          </div>
          
          <div class="section">
            <h3>Consignee Details</h3>
            <p>${freight.consigneeName}</p>
            <p>Contact: ${freight.consigneeName}</p>
            <p>${freight.consigneeEmail}</p>
            <p>${freight.consigneePhone}</p>
          </div>
          
          <div class="section">
            <h3>Freight Details</h3>
            <p>Type: ${freight.freightType}</p>
            <p>Mode: ${freight.transportMode}</p>
            <p>Cargo: ${freight.cargoDescription}</p>
            <p>Weight: ${freight.weight} kg</p>
            <p>Volume: ${freight.volume.toFixed(2)} CBM</p>
          </div>
          
          <div class="section">
            <h3>Quotation Breakdown</h3>
            <div class="row">
              <span>Freight Charges:</span>
              <span>$${freight.transportMode === 'SEA' ? '5,500' : freight.transportMode === 'AIR' ? (freight.weight * 15).toLocaleString() : (freight.weight * 2 + freight.volume * 100).toLocaleString()}</span>
            </div>
            <div class="row">
              <span>Customs Clearance:</span>
              <span>$1,700</span>
            </div>
            <div class="row">
              <span>Warehousing & Loading:</span>
              <span>₦200,000</span>
            </div>
            <div class="row">
              <span>Transportation & Docs:</span>
              <span>₦200,000</span>
            </div>
            <div class="total">
              <div class="row">
                <span>Total Amount Due:</span>
                <span>$${freight.transportMode === 'SEA' ? '7,200' : (freight.weight * 15 + 1700).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Terms and Conditions</h3>
            <p>1. Prices are quoted in USD and are subject to change without prior notice.</p>
            <p>2. Payment terms: 100% advance payment required.</p>
            <p>3. All shipments are subject to Logistics Nigeria's terms and conditions.</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
        </html>
      `)
      invoiceWindow.document.close()
    }
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'SEA': return <Ship className="w-4 h-4 text-blue-600" />
      case 'AIR': return <Plane className="w-4 h-4 text-red-600" />
      case 'LAND': return <Truck className="w-4 h-4 text-green-600" />
      default: return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING_APPROVAL': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'IN_TRANSIT': { color: 'bg-blue-100 text-blue-800', icon: Truck },
      'COMPLETED': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING_APPROVAL']
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to view freight requests.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 text-logistics-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading freight requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Freight Requests</h2>
          <p className="text-gray-600">Review and manage incoming freight requests</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {freightRequests.filter(f => f.status === 'PENDING_APPROVAL').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {freightRequests.filter(f => f.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {freightRequests.filter(f => f.status === 'IN_TRANSIT').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{freightRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Freight Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
        </div>
        
        {freightRequests.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No freight requests yet</h3>
            <p className="text-gray-600">Freight requests will appear here when users submit them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Freight Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipper → Consignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {freightRequests.map((freight) => (
                  <tr key={freight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransportIcon(freight.transportMode)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {freight.barcode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {freight.freightType} • {freight.transportMode}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{freight.shipperName}</div>
                      <div className="text-sm text-gray-500">→ {freight.consigneeName}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{freight.cargoDescription}</div>
                      <div className="text-sm text-gray-500">
                        {freight.weight}kg • {freight.volume.toFixed(2)} CBM
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(freight.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(freight.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-logistics-600 hover:text-logistics-900 mr-3" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Generate Invoice Button - Only show after payment */}
                      <button 
                        className="text-green-600 hover:text-green-900 mr-3 inline-block"
                        title="Generate Invoice"
                        onClick={() => generateInvoice(freight)}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      
                      {/* Payment Status */}
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3 inline-block"
                        title="Mark Payment Received"
                        onClick={() => markPaymentReceived(freight.id)}
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      
                      {freight.status === 'PENDING_APPROVAL' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
