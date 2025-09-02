'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  FileText,
  Download,
  Printer,
  Mail,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  Ship,
  Plane,
  Calculator,
  Eye
} from 'lucide-react'

interface FreightData {
  id: string
  barcode: string
  shipperName: string
  shipperContact: string
  shipperEmail: string
  shipperPhone: string
  shipperAddress: string
  
  consigneeName: string
  consigneeContact: string
  consigneeEmail: string
  consigneePhone: string
  consigneeAddress: string
  
  freightType: string
  transportMode: string
  cargoDescription: string
  quantity: number
  units: string
  weight: number
  volume: number
  packagingType: string
  
  originLocation: string
  destinationLocation: string
  isInternational: boolean
  invoiceNumber: string
  invoiceValue: number
  currency: string
  
  insuranceRequired: boolean
  pickupService: boolean
  deliveryType: string
  
  pickupDate: string
  deliveryDate: string
  additionalNotes: string
  
  createdAt: string
  status: string
}

interface InvoiceCalculations {
  freightCharges: number
  customsClearance: number
  warehousingLoading: number
  transportationDocs: number
  invoiceFee: number
  insuranceFee: number
  pickupDeliveryFee: number
  subtotal: number
  taxes: number
  total: number
}

export function ShippingInvoice() {
  const { data: session } = useSession()
  const [freightData, setFreightData] = useState<FreightData | null>(null)
  const [calculations, setCalculations] = useState<InvoiceCalculations>({
    freightCharges: 0,
    customsClearance: 0,
    warehousingLoading: 0,
    transportationDocs: 0,
    invoiceFee: 0,
    insuranceFee: 0,
    pickupDeliveryFee: 0,
    subtotal: 0,
    taxes: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  useEffect(() => {
    if (session) {
      generateInvoiceNumber()
      fetchLatestFreight()
    }
  }, [session])

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    setInvoiceNumber(`INV-${year}${month}${day}-${random}`)
  }

  const fetchLatestFreight = async () => {
    try {
      const response = await fetch('/api/freight')
      if (response.ok) {
        const data = await response.json()
        if (data.freightRequests && data.freightRequests.length > 0) {
          const latest = data.freightRequests[0]
          setFreightData(latest)
          calculateInvoice(latest)
        }
      }
    } catch (error) {
      console.error('Error fetching freight data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateInvoice = (freight: FreightData) => {
    // Base freight charges based on transport mode and type
    let freightCharges = 0
    let customsClearance = 0
    let warehousingLoading = 0
    let transportationDocs = 0
    let invoiceFee = 0
    let insuranceFee = 0
    let pickupDeliveryFee = 0

    // Freight charges (USD)
    switch (freight.transportMode) {
      case 'SEA':
        freightCharges = freight.freightType === 'FCL' ? 5500 : 2800 // 40ft vs 20ft
        break
      case 'AIR':
        freightCharges = freight.weight * 15 // $15 per kg
        break
      case 'LAND':
        freightCharges = freight.weight * 2 + freight.volume * 100 // $2/kg + $100/CBM
        break
    }

    // Additional services
    if (freight.isInternational) {
      customsClearance = 1700 // USD
      warehousingLoading = 200000 // NGN
      transportationDocs = 200000 // NGN
      invoiceFee = 200 // CAD
    }

    // Insurance (if required)
    if (freight.insuranceRequired) {
      insuranceFee = freight.invoiceValue * 0.02 // 2% of declared value
    }

    // Pickup and delivery service
    if (freight.pickupService) {
      pickupDeliveryFee = 50000 // NGN
    }

    const subtotal = freightCharges + customsClearance + (warehousingLoading / 1000) + (transportationDocs / 1000) + (invoiceFee * 0.75) + insuranceFee + (pickupDeliveryFee / 1000)
    const taxes = subtotal * 0.05 // 5% tax
    const total = subtotal + taxes

    setCalculations({
      freightCharges,
      customsClearance,
      warehousingLoading,
      transportationDocs,
      invoiceFee,
      insuranceFee,
      pickupDeliveryFee,
      subtotal,
      taxes,
      total
    })
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'SEA': return <Ship className="w-5 h-5 text-blue-600" />
      case 'AIR': return <Plane className="w-5 h-5 text-red-600" />
      case 'LAND': return <Truck className="w-5 h-5 text-green-600" />
      default: return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') return `$${amount.toLocaleString()}`
    if (currency === 'NGN') return `₦${amount.toLocaleString()}`
    if (currency === 'CAD') return `C$${amount.toLocaleString()}`
    return `${amount.toLocaleString()}`
  }

  const printInvoice = () => {
    window.print()
  }

  const downloadInvoice = () => {
    // Implementation for PDF download
    alert('PDF download feature coming soon!')
  }

  const emailInvoice = () => {
    if (freightData) {
      const subject = `Shipping Invoice - ${invoiceNumber}`
      const body = `Please find attached the shipping invoice for your freight request.\n\nInvoice Number: ${invoiceNumber}\nBarcode: ${freightData.barcode}\n\nThank you for choosing our logistics services.`
      
      window.open(`mailto:${freightData.shipperEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logistics-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating invoice...</p>
      </div>
    )
  }

  if (!freightData) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Freight Data</h3>
        <p className="text-gray-600">Please submit a freight request first to generate an invoice.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      {/* Invoice Header */}
      <div className="p-8 border-b border-gray-200 print:p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-logistics-500 to-route-500 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Logistics Nigeria</h1>
                <p className="text-gray-600">AI-Powered Freight Platform</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p>123 Logistics Street, Victoria Island</p>
              <p>Lagos, Nigeria</p>
              <p>Phone: +234 1 234 5678</p>
              <p>Email: info@logistics.ng</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping Invoice</h2>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Invoice #:</span> {invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="font-medium">Barcode:</span> {freightData.barcode}</p>
              <p><span className="font-medium">Status:</span> {freightData.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="p-8 print:p-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-logistics-600" />
              Shipper Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{freightData.shipperName}</p>
              <p className="text-gray-600">{freightData.shipperContact}</p>
              <p className="text-gray-600">{freightData.shipperEmail}</p>
              <p className="text-gray-600">{freightData.shipperPhone}</p>
              <p className="text-gray-600">{JSON.parse(freightData.shipperAddress).line1}</p>
              <p className="text-gray-600">
                {JSON.parse(freightData.shipperAddress).city}, {JSON.parse(freightData.shipperAddress).state}
              </p>
              <p className="text-gray-600">{JSON.parse(freightData.shipperAddress).country}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-route-600" />
              Consignee Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{freightData.consigneeName}</p>
              <p className="text-gray-600">{freightData.consigneeContact}</p>
              <p className="text-gray-600">{freightData.consigneeEmail}</p>
              <p className="text-gray-600">{freightData.consigneePhone}</p>
              <p className="text-gray-600">{JSON.parse(freightData.consigneeAddress).line1}</p>
              <p className="text-gray-600">
                {JSON.parse(freightData.consigneeAddress).city}, {JSON.parse(freightData.consigneeAddress).state}
              </p>
              <p className="text-gray-600">{JSON.parse(freightData.consigneeAddress).country}</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-cargo-600" />
            Service Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Transport Mode:</span> 
                  <span className="ml-2 inline-flex items-center">
                    {getTransportIcon(freightData.transportMode)}
                    <span className="ml-1">{freightData.transportMode}</span>
                  </span>
                </p>
                <p><span className="font-medium">Freight Type:</span> {freightData.freightType}</p>
                <p><span className="font-medium">Cargo:</span> {freightData.cargoDescription}</p>
                <p><span className="font-medium">Quantity:</span> {freightData.quantity} {freightData.units}</p>
              </div>
              <div>
                <p><span className="font-medium">Weight:</span> {freightData.weight} kg</p>
                <p><span className="font-medium">Volume:</span> {freightData.volume.toFixed(2)} CBM</p>
                <p><span className="font-medium">Packaging:</span> {freightData.packagingType}</p>
                <p><span className="font-medium">Route:</span> {freightData.originLocation} → {freightData.destinationLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            Quotation Breakdown
          </h3>
          
          <div className="space-y-4">
            {/* Freight Charges */}
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Freight Charges ({freightData.transportMode})</p>
                <p className="text-sm text-gray-600">
                  {freightData.freightType} from {freightData.originLocation} to {freightData.destinationLocation}
                </p>
              </div>
              <p className="font-bold text-blue-600">{formatCurrency(calculations.freightCharges, 'USD')}</p>
            </div>

            {/* Additional Services */}
            {freightData.isInternational && (
              <>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Customs Clearance</p>
                    <p className="text-sm text-gray-600">Custom clearance in {freightData.destinationLocation}</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(calculations.customsClearance, 'USD')}</p>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Warehousing & Loading</p>
                    <p className="text-sm text-gray-600">Container loading in {freightData.originLocation}</p>
                  </div>
                  <p className="font-bold text-yellow-600">{formatCurrency(calculations.warehousingLoading, 'NGN')}</p>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Transportation & Documentation</p>
                    <p className="text-sm text-gray-600">Custom documentation in {freightData.originLocation}</p>
                  </div>
                  <p className="font-bold text-purple-600">{formatCurrency(calculations.transportationDocs, 'NGN')}</p>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Invoice Fee</p>
                    <p className="text-sm text-gray-600">Documentation processing</p>
                  </div>
                  <p className="font-bold text-indigo-600">{formatCurrency(calculations.invoiceFee, 'CAD')}</p>
                </div>
              </>
            )}

            {/* Optional Services */}
            {freightData.insuranceRequired && (
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Insurance</p>
                  <p className="text-sm text-gray-600">Cargo insurance coverage</p>
                </div>
                <p className="font-bold text-red-600">{formatCurrency(calculations.insuranceFee, freightData.currency)}</p>
              </div>
            )}

            {freightData.pickupService && (
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Pickup & Delivery</p>
                  <p className="text-sm text-gray-600">{freightData.deliveryType} service</p>
                </div>
                <p className="font-bold text-orange-600">{formatCurrency(calculations.pickupDeliveryFee, 'NGN')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Total Calculation */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">{formatCurrency(calculations.subtotal, 'USD')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Taxes & Duties:</span>
              <span className="font-bold">{formatCurrency(calculations.taxes, 'USD')}</span>
            </div>
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between">
                <span className="text-xl font-bold">Total Amount Due:</span>
                <span className="text-xl font-bold text-logistics-600">{formatCurrency(calculations.total, 'USD')}</span>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                Also: {formatCurrency(calculations.warehousingLoading + calculations.transportationDocs + calculations.pickupDeliveryFee, 'NGN')}
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
            <p>1. Prices are quoted in USD and are subject to change without prior notice.</p>
            <p>2. Payment terms: 100% advance payment required.</p>
            <p>3. Any additional charges incurred during the shipping process will be communicated and billed accordingly.</p>
            <p>4. All shipments are subject to Logistics Nigeria's terms and conditions of carriage.</p>
            <p>5. Insurance coverage is optional and subject to additional charges.</p>
            <p>6. Delivery dates are estimates and may vary based on customs processing and transport conditions.</p>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700">
            <p>• Please note that the quoted prices are based on the information provided and are subject to change based on actual requirements and conditions.</p>
            <p>• For any inquiries or clarifications regarding this quotation, please contact us at info@logistics.ng</p>
            <p>• This invoice is valid for 30 days from the date of issue.</p>
            {freightData.additionalNotes && (
              <p>• Additional Notes: {freightData.additionalNotes}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-2">Thank you for choosing Logistics Nigeria for your shipping needs.</p>
          <p className="text-gray-600">We look forward to serving you.</p>
          <p className="text-gray-800 font-medium mt-4">Sincerely,</p>
          <p className="text-gray-800 font-medium">Logistics Nigeria Team</p>
        </div>
      </div>

      {/* Action Buttons - Hidden on Print */}
      <div className="p-8 print:hidden border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={printInvoice}
            className="btn-primary flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          
          <button
            onClick={downloadInvoice}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={emailInvoice}
            className="btn-secondary flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Invoice</span>
          </button>
        </div>
      </div>
    </div>
  )
}
