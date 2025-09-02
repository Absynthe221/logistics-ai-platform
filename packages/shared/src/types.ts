/**
 * Shared types for the Logistics AI Platform
 */

// Geographic & Location Types
export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode?: string
  coordinates?: Coordinates
}

export interface Location {
  address: Address
  coordinates: Coordinates
  landmarks?: string[]
  accessInstructions?: string
}

// Shipment & Load Types
export interface ShipmentDimensions {
  length: number
  width: number
  height: number
  weight: number
  volume?: number
  unit: 'kg' | 'lb' | 'ton'
}

export interface CargoItem {
  description: string
  quantity: number
  hsCode?: string
  value: number
  currency: string
  weight: number
  dimensions?: Omit<ShipmentDimensions, 'weight'>
  fragile?: boolean
  hazardous?: boolean
}

export interface Route {
  origin: Location
  destination: Location
  waypoints?: Location[]
  estimatedDistance: number
  estimatedDuration: number // in minutes
  preferredRoute?: 'fastest' | 'shortest' | 'economic'
}

// Payment & Financial Types
export interface Money {
  amount: number
  currency: string
}

export interface PricingBreakdown {
  baseFare: Money
  fuelSurcharge?: Money
  tollFees?: Money
  loadingFees?: Money
  insuranceFee?: Money
  taxes?: Money
  total: Money
}

export interface PaymentDetails {
  method: 'card' | 'bank_transfer' | 'wallet' | 'cash'
  provider?: string
  accountDetails?: Record<string, any>
  escrowRequired?: boolean
}

// Document Types
export interface DocumentInfo {
  type: string
  name: string
  url: string
  size?: number
  uploadedAt: Date
  verified?: boolean
}

export interface CustomsDocuments {
  commercialInvoice?: DocumentInfo
  packingList?: DocumentInfo
  billOfLading?: DocumentInfo
  certificateOfOrigin?: DocumentInfo
  customsDeclaration?: DocumentInfo
  other?: DocumentInfo[]
}

// AI & Analytics Types
export interface AiPrediction {
  prediction: any
  confidence: number
  model: string
  version: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface LtlOptimization extends AiPrediction {
  prediction: {
    recommendedLoads: string[] // Shipment IDs
    consolidationSavings: number
    efficiencyScore: number
    alternativeRoutes?: Route[]
  }
}

export interface EtaPrediction extends AiPrediction {
  prediction: {
    estimatedArrival: Date
    delays: Array<{
      type: string
      duration: number
      probability: number
    }>
    alternativeEtas: Date[]
  }
}

export interface HsCodeSuggestion extends AiPrediction {
  prediction: {
    hsCode: string
    description: string
    dutyRate: number
    restrictions?: string[]
    alternatives: Array<{
      code: string
      confidence: number
      description: string
    }>
  }
}

// Road Intelligence Types
export interface RoadCondition {
  type: 'traffic' | 'accident' | 'construction' | 'weather' | 'security' | 'checkpoint'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  location: Location
  affectedRoutes: string[]
  estimatedDelay: number // minutes
  reportedAt: Date
  expiresAt?: Date
  verified: boolean
  source: 'driver' | 'authority' | 'ai' | 'sensor'
}

export interface TrafficUpdate {
  routeId: string
  currentSpeed: number
  normalSpeed: number
  congestionLevel: 'light' | 'moderate' | 'heavy' | 'severe'
  incidents: RoadCondition[]
  lastUpdated: Date
}

// Notification & Communication Types
export interface NotificationChannel {
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'webhook'
  address: string
  verified: boolean
  preferences?: {
    shipmentUpdates?: boolean
    promotions?: boolean
    systemAlerts?: boolean
  }
}

export interface NotificationTemplate {
  type: string
  title: string
  message: string
  channels: NotificationChannel['type'][]
  variables?: Record<string, string>
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta?: Record<string, any>
}

export interface PaginationQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filter?: Record<string, any>
}

// Vehicle & Fleet Types
export interface Vehicle {
  id: string
  type: 'truck' | 'van' | 'motorcycle' | 'car'
  capacity: {
    weight: number
    volume: number
  }
  licensePlate: string
  make?: string
  model?: string
  year?: number
  fuelType?: string
  status: 'active' | 'maintenance' | 'inactive'
  currentLocation?: Coordinates
  driver?: {
    id: string
    name: string
    phone: string
    license: string
  }
}

// Customs & International Trade Types
export interface CustomsInfo {
  hsCode: string
  description: string
  origin: string
  declaredValue: Money
  dutyRate: number
  calculatedDuty: Money
  restrictions?: string[]
  permits?: string[]
}

export interface TradeDocuments {
  commercialInvoice: DocumentInfo
  packingList: DocumentInfo
  billOfLading?: DocumentInfo
  certificateOfOrigin?: DocumentInfo
  exportPermit?: DocumentInfo
  importLicense?: DocumentInfo
}

// System Configuration Types
export interface SystemSettings {
  business: {
    name: string
    address: Address
    contact: {
      email: string
      phone: string
    }
    registration: {
      number: string
      taxId: string
    }
  }
  features: {
    aiOptimization: boolean
    escrowPayments: boolean
    customsIntegration: boolean
    roadIntelligence: boolean
  }
  integrations: {
    paymentProviders: string[]
    mappingService: string
    notificationService: string
  }
}

