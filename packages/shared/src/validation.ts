/**
 * Validation schemas using Zod for the Logistics Platform
 */

import { z } from 'zod'

// Basic validations
export const phoneSchema = z.string().regex(
  /^(\+234|0)?[789]\d{9}$/,
  'Invalid Nigerian phone number'
)

export const emailSchema = z.string().email('Invalid email address')

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
})

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('Nigeria'),
  postalCode: z.string().optional(),
  coordinates: coordinatesSchema.optional()
})

export const locationSchema = z.object({
  address: addressSchema,
  coordinates: coordinatesSchema,
  landmarks: z.array(z.string()).optional(),
  accessInstructions: z.string().optional()
})

// Money and financial
export const moneySchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['NGN', 'USD', 'GHS', 'XOF']).default('NGN')
})

// Shipment validations
export const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
  volume: z.number().positive().optional(),
  unit: z.enum(['kg', 'lb', 'ton']).default('kg')
})

export const cargoItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().positive(),
  hsCode: z.string().optional(),
  value: z.number().positive(),
  currency: z.string().default('NGN'),
  weight: z.number().positive(),
  dimensions: dimensionsSchema.optional(),
  fragile: z.boolean().default(false),
  hazardous: z.boolean().default(false)
})

export const routeSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  waypoints: z.array(locationSchema).optional(),
  estimatedDistance: z.number().positive(),
  estimatedDuration: z.number().positive(),
  preferredRoute: z.enum(['fastest', 'shortest', 'economic']).optional()
})

// User and company validations
export const userCreateSchema = z.object({
  email: emailSchema,
  phone: phoneSchema.optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['SHIPPER', 'CARRIER', 'DRIVER', 'FREIGHT_FORWARDER', 'ADMIN']).default('SHIPPER'),
  companyName: z.string().optional(),
  businessType: z.enum([
    'IMPORTER', 'EXPORTER', 'MANUFACTURER', 'DISTRIBUTOR', 
    'RETAILER', 'LOGISTICS_PROVIDER', 'FREIGHT_FORWARDER', 'INDIVIDUAL'
  ]).optional(),
  location: z.string().optional(),
  address: addressSchema.optional()
})

export const companyCreateSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  businessType: z.enum([
    'IMPORTER', 'EXPORTER', 'MANUFACTURER', 'DISTRIBUTOR',
    'RETAILER', 'LOGISTICS_PROVIDER', 'FREIGHT_FORWARDER'
  ]),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  address: addressSchema,
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: emailSchema,
  phone: phoneSchema
})

// Shipment validations
export const shipmentCreateSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  description: z.string().min(1, 'Description is required'),
  weight: z.number().positive().optional(),
  volume: z.number().positive().optional(),
  value: z.number().positive().optional(),
  currency: z.string().default('NGN'),
  shipmentType: z.enum(['DOMESTIC', 'INTERNATIONAL', 'IMPORT', 'EXPORT', 'TRANSIT']),
  category: z.string().optional(),
  hsCode: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  instructions: z.string().optional(),
  tags: z.array(z.string()).default([])
})

export const loadCreateSchema = z.object({
  route: routeSchema,
  maxWeight: z.number().positive(),
  maxVolume: z.number().positive(),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleId: z.string().optional(),
  departureTime: z.date().optional()
})

// Road report validations
export const roadReportSchema = z.object({
  location: locationSchema,
  reportType: z.enum([
    'TRAFFIC_JAM', 'ROAD_CLOSURE', 'ACCIDENT', 'CHECKPOINT',
    'BAD_ROAD', 'SECURITY_ISSUE', 'WEATHER', 'BRIDGE_ISSUE', 'FUEL_SCARCITY'
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(1, 'Description is required'),
  photos: z.array(z.string().url()).default([]),
  affectedRoutes: z.array(z.string()).default([]),
  estimatedDelay: z.number().int().min(0).optional()
})

// Payment validations
export const paymentCreateSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  method: z.enum(['CARD', 'BANK_TRANSFER', 'WALLET', 'CASH', 'CRYPTO']),
  provider: z.string().optional(),
  description: z.string().optional(),
  escrowRequired: z.boolean().default(false)
})

// Document validations
export const documentUploadSchema = z.object({
  documentType: z.enum([
    'COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING',
    'AIRWAY_BILL', 'CERTIFICATE_OF_ORIGIN', 'INSURANCE_CERTIFICATE',
    'CUSTOMS_DECLARATION', 'PHOTO', 'OTHER'
  ]),
  name: z.string().min(1, 'Document name is required'),
  description: z.string().optional(),
  file: z.any(), // File upload will be handled separately
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false)
})

// Customs validations
export const customsDeclarationSchema = z.object({
  declarationType: z.enum(['IMPORT', 'EXPORT', 'TRANSIT', 'TEMPORARY_ADMISSION']),
  hsCode: z.string().min(1, 'HS Code is required'),
  declaredValue: z.number().positive(),
  currency: z.string().default('NGN'),
  commercialInvoice: z.boolean().default(false),
  packingList: z.boolean().default(false),
  billOfLading: z.boolean().default(false)
})

// API query validations
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const shipmentQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
  type: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional()
})

// Barcode validation
export const barcodeSchema = z.string().regex(
  /^LNG-[A-Z]{3}-[A-Z]{3}-[A-Z0-9]{8}$/,
  'Invalid barcode format'
)

// Vehicle validation
export const vehicleSchema = z.object({
  type: z.enum(['truck', 'van', 'motorcycle', 'car']),
  capacity: z.object({
    weight: z.number().positive(),
    volume: z.number().positive()
  }),
  licensePlate: z.string().min(1, 'License plate is required'),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  fuelType: z.string().optional()
})

// Tracking event validation
export const trackingEventSchema = z.object({
  eventType: z.enum([
    'CREATED', 'PICKED_UP', 'IN_TRANSIT', 'CHECKPOINT',
    'DELAYED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'CUSTOMS_CLEARANCE'
  ]),
  status: z.string().min(1, 'Status is required'),
  location: locationSchema,
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// Export validation helper
export type ValidationSchema<T extends z.ZodType> = z.infer<T>

export const validate = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

