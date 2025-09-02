import { nanoid } from 'nanoid'

/**
 * Universal Barcode System for Logistics Platform
 * 
 * Format: LNG-{TYPE}-{ROUTE}-{RANDOM}
 * - LNG: Logistics Nigeria identifier
 * - TYPE: Shipment type (DOM=Domestic, INT=International, IMP=Import, EXP=Export)
 * - ROUTE: Route code (LAG=Lagos, ABJ=Abuja, KAN=Kano, PHC=Port Harcourt, etc.)
 * - RANDOM: 8-character unique identifier
 * 
 * Examples:
 * - LNG-DOM-LAG-A7K9M2N5 (Domestic shipment from Lagos)
 * - LNG-IMP-APT-B3X8Q1W7 (Import through Apapa Port)
 * - LNG-EXP-MMA-C9Z5P4R2 (Export through Murtala Mohammed Airport)
 */

export type ShipmentType = 'DOM' | 'INT' | 'IMP' | 'EXP' | 'TRN'
export type LocationCode = 
  | 'LAG' // Lagos
  | 'ABJ' // Abuja
  | 'KAN' // Kano
  | 'PHC' // Port Harcourt
  | 'ONI' // Onitsha
  | 'IBD' // Ibadan
  | 'BEN' // Benin City
  | 'MAI' // Maiduguri
  | 'JOS' // Jos
  | 'ENU' // Enugu
  | 'APT' // Apapa Port
  | 'TIN' // Tin Can Port
  | 'MMA' // Murtala Mohammed Airport
  | 'NNA' // Nnamdi Azikiwe Airport
  | 'ACC' // Accra (Ghana)
  | 'LOM' // Lomé (Togo)
  | 'COT' // Cotonou (Benin)

export interface BarcodeData {
  type: ShipmentType
  location: LocationCode
  id: string
  timestamp: Date
}

export class BarcodeGenerator {
  private static readonly PREFIX = 'LNG'
  private static readonly ID_LENGTH = 8

  /**
   * Generate a new barcode for a shipment
   */
  static generate(type: ShipmentType, location: LocationCode): string {
    const id = nanoid(this.ID_LENGTH).toUpperCase()
    return `${this.PREFIX}-${type}-${location}-${id}`
  }

  /**
   * Parse a barcode to extract its components
   */
  static parse(barcode: string): BarcodeData | null {
    const parts = barcode.split('-')
    
    if (parts.length !== 4 || parts[0] !== this.PREFIX) {
      return null
    }

    const [, type, location, id] = parts

    if (!this.isValidType(type) || !this.isValidLocation(location)) {
      return null
    }

    return {
      type: type as ShipmentType,
      location: location as LocationCode,
      id,
      timestamp: new Date()
    }
  }

  /**
   * Validate a barcode format
   */
  static validate(barcode: string): boolean {
    return this.parse(barcode) !== null
  }

  /**
   * Generate QR code data URL for a barcode
   */
  static generateQRCode(barcode: string): string {
    // In production, integrate with QR code library
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/'
    const params = new URLSearchParams({
      size: '200x200',
      data: `https://track.logistics.ng/${barcode}`,
      format: 'svg'
    })
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Get human-readable description of barcode
   */
  static describe(barcode: string): string {
    const data = this.parse(barcode)
    if (!data) return 'Invalid barcode'

    const typeNames = {
      DOM: 'Domestic',
      INT: 'International',
      IMP: 'Import',
      EXP: 'Export',
      TRN: 'Transit'
    }

    const locationNames = {
      LAG: 'Lagos',
      ABJ: 'Abuja',
      KAN: 'Kano',
      PHC: 'Port Harcourt',
      ONI: 'Onitsha',
      IBD: 'Ibadan',
      BEN: 'Benin City',
      MAI: 'Maiduguri',
      JOS: 'Jos',
      ENU: 'Enugu',
      APT: 'Apapa Port',
      TIN: 'Tin Can Port',
      MMA: 'Murtala Mohammed Airport',
      NNA: 'Nnamdi Azikiwe Airport',
      ACC: 'Accra, Ghana',
      LOM: 'Lomé, Togo',
      COT: 'Cotonou, Benin'
    }

    return `${typeNames[data.type]} shipment from ${locationNames[data.location]}`
  }

  private static isValidType(type: string): type is ShipmentType {
    return ['DOM', 'INT', 'IMP', 'EXP', 'TRN'].includes(type)
  }

  private static isValidLocation(location: string): location is LocationCode {
    return [
      'LAG', 'ABJ', 'KAN', 'PHC', 'ONI', 'IBD', 'BEN', 'MAI', 'JOS', 'ENU',
      'APT', 'TIN', 'MMA', 'NNA', 'ACC', 'LOM', 'COT'
    ].includes(location)
  }
}

/**
 * Barcode utilities for tracking and analytics
 */
export class BarcodeUtils {
  /**
   * Extract route information from barcode
   */
  static getRoute(barcode: string): { origin: LocationCode; destination?: LocationCode } | null {
    const data = BarcodeGenerator.parse(barcode)
    if (!data) return null

    return {
      origin: data.location,
      // Destination will be determined by shipment details
      destination: undefined
    }
  }

  /**
   * Generate tracking URL for a barcode
   */
  static getTrackingUrl(barcode: string): string {
    return `https://track.logistics.ng/${barcode}`
  }

  /**
   * Check if barcode is for international shipment
   */
  static isInternational(barcode: string): boolean {
    const data = BarcodeGenerator.parse(barcode)
    return data?.type === 'INT' || data?.type === 'IMP' || data?.type === 'EXP' || false
  }

  /**
   * Check if barcode is for port/airport shipment
   */
  static isPortAirport(barcode: string): boolean {
    const data = BarcodeGenerator.parse(barcode)
    return ['APT', 'TIN', 'MMA', 'NNA'].includes(data?.location || '') || false
  }

  /**
   * Get estimated route distance (placeholder - integrate with mapping service)
   */
  static getEstimatedDistance(origin: LocationCode, destination: LocationCode): number {
    // Placeholder distances in kilometers
    const distances: Record<string, number> = {
      'LAG-ABJ': 760,
      'LAG-KAN': 1200,
      'LAG-PHC': 510,
      'ABJ-KAN': 350,
      'ABJ-PHC': 490,
      'KAN-PHC': 920,
      // Add more routes as needed
    }

    const route = `${origin}-${destination}`
    const reverseRoute = `${destination}-${origin}`
    
    return distances[route] || distances[reverseRoute] || 0
  }
}

