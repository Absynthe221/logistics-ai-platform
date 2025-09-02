/**
 * Shared utility functions for the Logistics Platform
 */

import { format, formatDistanceToNow, addMinutes } from 'date-fns'

/**
 * Format currency for Nigerian market
 */
export function formatCurrency(amount: number, currency = 'NGN'): string {
  const formatters = {
    NGN: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    GHS: new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }),
  }

  const formatter = formatters[currency as keyof typeof formatters] || formatters.NGN
  return formatter.format(amount)
}

/**
 * Format distance in kilometers
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  if (distance < 10) {
    return `${distance.toFixed(1)}km`
  }
  return `${Math.round(distance)}km`
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}min`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (remainingHours === 0) {
    return `${days}d`
  }
  return `${days}d ${remainingHours}h`
}

/**
 * Calculate ETA based on current time and duration
 */
export function calculateEta(durationMinutes: number): Date {
  return addMinutes(new Date(), durationMinutes)
}

/**
 * Format ETA in user-friendly format
 */
export function formatEta(eta: Date): string {
  const now = new Date()
  const diffMinutes = Math.floor((eta.getTime() - now.getTime()) / (1000 * 60))
  
  if (diffMinutes < 0) {
    return 'Overdue'
  }
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes`
  }
  
  if (diffMinutes < 1440) { // Less than 24 hours
    return format(eta, 'h:mm a')
  }
  
  return format(eta, 'MMM d, h:mm a')
}

/**
 * Generate a tracking URL for a barcode
 */
export function generateTrackingUrl(barcode: string, baseUrl = 'https://track.logistics.ng'): string {
  return `${baseUrl}/${barcode}`
}

/**
 * Calculate load utilization percentage
 */
export function calculateUtilization(current: number, maximum: number): number {
  if (maximum === 0) return 0
  return Math.min(Math.round((current / maximum) * 100), 100)
}

/**
 * Generate a simple hash for objects (for caching)
 */
export function simpleHash(obj: any): string {
  return btoa(JSON.stringify(obj)).slice(0, 8)
}

/**
 * Validate Nigerian phone number
 */
export function validateNigerianPhone(phone: string): boolean {
  // Remove spaces, dashes, and plus signs
  const cleaned = phone.replace(/[\s\-\+]/g, '')
  
  // Check for Nigerian phone patterns
  const patterns = [
    /^234[789]\d{9}$/, // +234 format
    /^0[789]\d{9}$/, // 0 prefix format
    /^[789]\d{9}$/, // Direct format
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * Format Nigerian phone number
 */
export function formatNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\+]/g, '')
  
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`
  }
  
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`
  }
  
  if (/^[789]\d{9}$/.test(cleaned)) {
    return `+234${cleaned}`
  }
  
  return phone // Return original if can't format
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Generate random tracking reference
 */
export function generateReference(prefix = 'REF'): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

