'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Truck, 
  Plane, 
  Ship, 
  Car, 
  Plus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Ruler,
  Printer,
  UserPlus
} from 'lucide-react'
import { GooglePlacesInput } from './GooglePlacesInput'

interface Address {
  id: string
  line1: string
  line2?: string
  line3?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Contact {
  fullName: string
  contactName: string
  email: string
  phone: string
  countryCode: string
}

// Logistics Classification Code (LCC) System
interface LCCCode {
  shipmentType: 'L' | 'R' | 'A' | 'S' | 'E' | 'W'  // Local, Regional, Air, Sea, Express, Warehouse
  originCode: string  // 2-3 letter code (e.g., LOS, PHC, DXB)
  destinationCode: string  // 2-3 letter code
  weightBracket: '1' | '2' | '3'  // Small, Medium, Heavy
  timeSensitivity: 'X' | 'N'  // Express, Normal
  serialNumber: string  // 3-digit serial
  fullCode: string  // Complete LCC (e.g., A-LOS-DXB-3-127X)
}

interface ShipmentForm {
  // 1. Shipper Information
  shipper: Contact & { address: Address }
  
  // 2. Consignee Information  
  consignee: Contact & { address: Address }
  
  // 3. Measurement System
  measurementSystem: 'METRIC' | 'IMPERIAL'
  
  // 4. Transport Mode
  transportMode: 'SEA' | 'AIR' | 'LAND' | 'RAIL'
  
  // 5. Sea Freight Specific
  seaShipmentType: 'FCL' | 'LCL' | 'BREAKBULK' | 'PROJECT' | ''
  containerSize: '20ft' | '40ft' | '40ft HC' | '45ft' | ''
  containerType: 'STANDARD' | 'REEFER' | 'TANK' | 'FLAT_RACK' | 'OPEN_TOP' | ''
  containerCount: number
  originPort: string
  destinationPort: string
  transshipmentRequired: boolean
  
  // 6. Air Freight Specific
  airShipmentType: 'GENERAL' | 'PERISHABLE' | 'DANGEROUS' | 'LIVE_ANIMALS' | 'EXPRESS' | ''
  originAirport: string
  destinationAirport: string
  transitRequired: boolean
  chargeableWeight: number
  
  // 7. Land Transport Specific
  landTransportType: 'TRUCK' | 'TRAIN' | 'BUS' | 'VAN' | ''
  landRouteType: 'DIRECT' | 'MULTI_STOP' | 'CROSS_BORDER' | ''
  
  // 8. Rail Transport Specific
  railServiceType: 'FREIGHT' | 'CONTAINER' | 'BULK' | 'INTERMODAL' | ''
  railCarType: 'BOX_CAR' | 'FLAT_CAR' | 'TANK_CAR' | 'REEFER_CAR' | 'HOPPER_CAR' | ''
  railCarCount: number
  railOriginStation: string
  railDestinationStation: string
  railTransitRequired: boolean
  
  // 8. Shipment Details
  freightType: 'FCL' | 'LCL' | 'LTL' | 'COURIER'
  cargoDescriptions: string[]
  quantity: number
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  volume: number
  packagingType: 'PALLET' | 'CRATE' | 'BOX' | 'LOOSE' | 'CONTAINER'
  specialHandling: string[]
  
  // 9. Origin & Destination
  originLocation: string
  destinationLocation: string
  preferredRoute: 'DIRECT' | 'MULTI_STOP' | 'CROSS_BORDER'
  incoterms: 'EXW' | 'FOB' | 'CIF' | 'DDP' | 'FCA' | 'CPT' | 'CIP' | 'DAP' | 'DPU'
  
  // 10. Customs & Documentation
  invoiceNumber: string
  invoiceValue: number
  currency: 'USD' | 'NGN' | 'EUR' | 'GBP'
  countryOfOrigin: string
  countryOfDestination: string
  hsCode: string
  
  // 11. Service Options
  insuranceRequired: boolean
  escrowPayment: boolean
  pickupService: boolean
  deliveryType: 'DOOR_TO_DOOR' | 'DOOR_TO_PORT' | 'PORT_TO_PORT'
  
  // 12. Payment & Billing
  paymentMethod: 'BANK_TRANSFER' | 'ESCROW' | 'CARD' | 'WALLET'
  billingAddress: Address
  taxNumber: string
  
  // 13. Tracking Setup
  notificationPreferences: {
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  
  // Additional fields
  estimatedDeliveryDate: string
  deliveryDate: string
  additionalNotes: string
  
  // Logistics Classification Code (LCC)
  lccCode: LCCCode
  isExpress: boolean
}

const countries = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Benin', label: 'Benin' },
  { value: 'Togo', label: 'Togo' },
  { value: 'Ivory Coast', label: 'Ivory Coast' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'China', label: 'China' }
]

const specialHandlingOptions = [
  'Fragile',
  'Perishable', 
  'Hazardous',
  'Temperature Control',
  'High Value',
  'Oversized',
  'Live Animals',
  'Pharmaceutical'
]

const paymentMethods = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Direct bank wire transfer' },
  { value: 'ESCROW', label: 'Escrow Service', description: 'Secure third-party payment holding' },
  { value: 'CARD', label: 'Credit/Debit Card', description: 'Visa, Mastercard, or local cards' },
  { value: 'WALLET', label: 'Digital Wallet', description: 'Mobile money or digital wallet' }
]

export function SendPackagesDashboard() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<ShipmentForm>({
    // 1. Shipper Information
    shipper: {
      fullName: '',
      contactName: '',
      email: '',
      phone: '',
      countryCode: '+234',
      address: {
        id: '1',
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria'
      }
    },
    
    // 2. Consignee Information
    consignee: {
      fullName: '',
      contactName: '',
      email: '',
      phone: '',
      countryCode: '+234',
      address: {
        id: '2',
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria'
      }
    },
    
    // 3. Measurement System
    measurementSystem: 'METRIC',
    
    // 4. Transport Mode
    transportMode: 'SEA',
    
    // 5. Sea Freight Specific
    seaShipmentType: '',
    containerSize: '',
    containerType: '',
    containerCount: 1,
    originPort: '',
    destinationPort: '',
    transshipmentRequired: false,
    
    // 6. Air Freight Specific
    airShipmentType: '',
    originAirport: '',
    destinationAirport: '',
    transitRequired: false,
    chargeableWeight: 0,
    
    // 7. Land Transport Specific
    landTransportType: '',
    landRouteType: '',
    
    // 8. Rail Transport Specific
    railServiceType: '',
    railCarType: '',
    railCarCount: 1,
    railOriginStation: '',
    railDestinationStation: '',
    railTransitRequired: false,
    
    // 8. Shipment Details
    freightType: 'FCL',
    cargoDescriptions: [''],
    quantity: 1,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    volume: 0,
    packagingType: 'BOX',
    specialHandling: [],
    
    // 9. Origin & Destination
    originLocation: '',
    destinationLocation: '',
    preferredRoute: 'DIRECT',
    incoterms: 'FOB',
    
    // 10. Customs & Documentation
    invoiceNumber: '',
    invoiceValue: 0,
    currency: 'USD',
    countryOfOrigin: 'Nigeria',
    countryOfDestination: '',
    hsCode: '',
    
    // 11. Service Options
    insuranceRequired: false,
    escrowPayment: false,
    pickupService: false,
    deliveryType: 'DOOR_TO_DOOR',
    
    // 12. Payment & Billing
    paymentMethod: 'BANK_TRANSFER',
    billingAddress: {
      id: '3',
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nigeria'
    },
    taxNumber: '',
    
    // 13. Tracking Setup
    notificationPreferences: {
      email: true,
      sms: false,
      whatsapp: false
    },
    
    estimatedDeliveryDate: '',
    deliveryDate: '',
    additionalNotes: '',
    
    // Logistics Classification Code (LCC)
    lccCode: {
      shipmentType: 'L',
      originCode: '',
      destinationCode: '',
      weightBracket: '1',
      timeSensitivity: 'N',
      serialNumber: '001',
      fullCode: ''
    },
    isExpress: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: keyof ShipmentForm | string, value?: any, nestedField?: string) => {
    if (nestedField) {
      // Handle nested object updates (e.g., shipper.fullName, consignee.email)
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value
        }
      }))
    } else {
      // Handle direct field updates
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNestedInputChange = (section: keyof ShipmentForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleQuantityChange = (newQuantity: number) => {
    setFormData(prev => {
      const currentDescriptions = prev.cargoDescriptions
      const newDescriptions = [...currentDescriptions]
      
      // If quantity increased, add empty descriptions
      if (newQuantity > currentDescriptions.length) {
        for (let i = currentDescriptions.length; i < newQuantity; i++) {
          newDescriptions.push('')
        }
      }
      // If quantity decreased, remove excess descriptions
      else if (newQuantity < currentDescriptions.length) {
        newDescriptions.splice(newQuantity)
      }
      
      return {
        ...prev,
        quantity: newQuantity,
        cargoDescriptions: newDescriptions
      }
    })
  }

  const handleCargoDescriptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      cargoDescriptions: prev.cargoDescriptions.map((desc, i) => 
        i === index ? value : desc
      )
    }))
  }

  // LCC Generation Functions
  const getCityCode = (city: string): string => {
    const cityCodes: { [key: string]: string } = {
      'Lagos': 'LOS',
      'Abuja': 'ABV', 
      'Port Harcourt': 'PHC',
      'Kano': 'KAN',
      'Ibadan': 'IBA',
      'Benin': 'BEN',
      'Kaduna': 'KAD',
      'Maiduguri': 'MAI',
      'Zaria': 'ZAR',
      'Aba': 'ABA',
      'Jos': 'JOS',
      'Ilorin': 'ILO',
      'Oyo': 'OYO',
      'Enugu': 'ENU',
      'Abeokuta': 'ABK',
      'Sokoto': 'SOK',
      'Onitsha': 'ONI',
      'Warri': 'WAR',
      'Kaduna': 'KAD',
      'Akure': 'AKU',
      'Bauchi': 'BAU',
      'Katsina': 'KAT',
      'Owerri': 'OWE',
      'Gombe': 'GOM',
      'Lokoja': 'LOK',
      'Ikorodu': 'IKO',
      'Uyo': 'UYO',
      'Asaba': 'ASA',
      'Minna': 'MIN',
      'Nnewi': 'NNE',
      'Ilesa': 'ILE',
      'Ondo': 'OND',
      'Akwa': 'AKW',
      'Gusau': 'GUS',
      'Mubi': 'MUB',
      'Ikot Ekpene': 'IKO',
      'Lafia': 'LAF',
      'Yola': 'YOL',
      'Umuahia': 'UMU',
      'Awka': 'AWK',
      'Gombe': 'GOM',
      'Damaturu': 'DAM',
      'Ikire': 'IKI',
      'Nkpor': 'NKP',
      'Makurdi': 'MAK',
      'Lafia': 'LAF',
      'Kontagora': 'KON',
      'Garki': 'GAR',
      'Bida': 'BID',
      'Sapele': 'SAP',
      'Gashua': 'GAS',
      'Biu': 'BIU',
      'Kazaure': 'KAZ',
      'Idah': 'IDA',
      'Potiskum': 'POT',
      'Koko': 'KOK',
      'Shaki': 'SHA',
      'Lere': 'LER',
      'Kangiwa': 'KAN',
      'Igboho': 'IGB',
      'Effon Alaiye': 'EFF',
      'Igbara-Odo': 'IGO',
      'Ikere-Ekiti': 'IKE',
      'Ilawe-Ekiti': 'ILA',
      'Oye-Ekiti': 'OYE',
      'Ifon-Osun': 'IFO',
      'Ilesa': 'ILE',
      'Ede': 'EDE',
      'Ipetu-Ijesha': 'IPE',
      'Ilobu': 'ILO',
      'Ikirun': 'IKI',
      'Iragbiji': 'IRA',
      'Eruwa': 'ERU',
      'Ayetoro': 'AYE',
      'Iganna': 'IGA',
      'Otu': 'OTU',
      'Igbo-Ora': 'IGO',
      'Igboora': 'IGB',
      'Idere': 'IDE',
      'Lagos Island': 'LOS',
      'Victoria Island': 'VIC',
      'Ikoyi': 'IKO',
      'Surulere': 'SUR',
      'Yaba': 'YAB',
      'Mushin': 'MUS',
      'Oshodi': 'OSH',
      'Agege': 'AGE',
      'Alaba': 'ALA',
      'Badagry': 'BAD',
      'Epe': 'EPE',
      'Ibeju-Lekki': 'IBE',
      'Ifako-Ijaiye': 'IFA',
      'Ikeja': 'IKE',
      'Kosofe': 'KOS',
      'Lagos Mainland': 'LAG',
      'Mushin': 'MUS',
      'Ojo': 'OJO',
      'Ojodu': 'OJO',
      'Shomolu': 'SHO',
      'Ajeromi-Ifelodun': 'AJE',
      'Amuwo-Odofin': 'AMU',
      'Apapa': 'APA',
      'Eti-Osa': 'ETI',
      'Ikorodu': 'IKO',
      'Lagos Island': 'LOS',
      'Mushin': 'MUS',
      'Oshodi-Isolo': 'OSH',
      'Surulere': 'SUR',
      'Dubai': 'DXB',
      'London': 'LON',
      'New York': 'NYC',
      'Lagos': 'LOS',
      'Abuja': 'ABV',
      'Port Harcourt': 'PHC',
      'Kano': 'KAN',
      'Ibadan': 'IBA',
      'Benin': 'BEN',
      'Kaduna': 'KAD',
      'Maiduguri': 'MAI',
      'Zaria': 'ZAR',
      'Aba': 'ABA',
      'Jos': 'JOS',
      'Ilorin': 'ILO',
      'Oyo': 'OYO',
      'Enugu': 'ENU',
      'Abeokuta': 'ABK',
      'Sokoto': 'SOK',
      'Onitsha': 'ONI',
      'Warri': 'WAR',
      'Kaduna': 'KAD',
      'Akure': 'AKU',
      'Bauchi': 'BAU',
      'Katsina': 'KAT',
      'Owerri': 'OWE',
      'Gombe': 'GOM',
      'Lokoja': 'LOK',
      'Ikorodu': 'IKO',
      'Uyo': 'UYO',
      'Asaba': 'ASA',
      'Minna': 'MIN',
      'Nnewi': 'NNE',
      'Ilesa': 'ILE',
      'Ondo': 'OND',
      'Akwa': 'AKW',
      'Gusau': 'GUS',
      'Mubi': 'MUB',
      'Ikot Ekpene': 'IKO',
      'Lafia': 'LAF',
      'Yola': 'YOL',
      'Umuahia': 'UMU',
      'Awka': 'AWK',
      'Gombe': 'GOM',
      'Damaturu': 'DAM',
      'Ikire': 'IKI',
      'Nkpor': 'NKP',
      'Makurdi': 'MAK',
      'Lafia': 'LAF',
      'Kontagora': 'KON',
      'Garki': 'GAR',
      'Bida': 'BID',
      'Sapele': 'SAP',
      'Gashua': 'GAS',
      'Biu': 'BIU',
      'Kazaure': 'KAZ',
      'Idah': 'IDA',
      'Potiskum': 'POT',
      'Koko': 'KOK',
      'Shaki': 'SHA',
      'Lere': 'LER',
      'Kangiwa': 'KAN',
      'Igboho': 'IGB',
      'Effon Alaiye': 'EFF',
      'Igbara-Odo': 'IGO',
      'Ikere-Ekiti': 'IKE',
      'Ilawe-Ekiti': 'ILA',
      'Oye-Ekiti': 'OYE',
      'Ifon-Osun': 'IFO',
      'Ilesa': 'ILE',
      'Ede': 'EDE',
      'Ipetu-Ijesha': 'IPE',
      'Ilobu': 'ILO',
      'Ikirun': 'IKI',
      'Iragbiji': 'IRA',
      'Eruwa': 'ERU',
      'Ayetoro': 'AYE',
      'Iganna': 'IGA',
      'Otu': 'OTU',
      'Igbo-Ora': 'IGO',
      'Igboora': 'IGB',
      'Idere': 'IDE',
      'Lagos Island': 'LOS',
      'Victoria Island': 'VIC',
      'Ikoyi': 'IKO',
      'Surulere': 'SUR',
      'Yaba': 'YAB',
      'Mushin': 'MUS',
      'Oshodi': 'OSH',
      'Agege': 'AGE',
      'Alaba': 'ALA',
      'Badagry': 'BAD',
      'Epe': 'EPE',
      'Ibeju-Lekki': 'IBE',
      'Ifako-Ijaiye': 'IFA',
      'Ikeja': 'IKE',
      'Kosofe': 'KOS',
      'Lagos Mainland': 'LAG',
      'Mushin': 'MUS',
      'Ojo': 'OJO',
      'Ojodu': 'OJO',
      'Shomolu': 'SHO',
      'Ajeromi-Ifelodun': 'AJE',
      'Amuwo-Odofin': 'AMU',
      'Apapa': 'APA',
      'Eti-Osa': 'ETI',
      'Ikorodu': 'IKO',
      'Lagos Island': 'LOS',
      'Mushin': 'MUS',
      'Oshodi-Isolo': 'OSH',
      'Surulere': 'SUR',
      'Dubai': 'DXB',
      'London': 'LON',
      'New York': 'NYC'
    }
    return cityCodes[city] || city.substring(0, 3).toUpperCase()
  }

  const getWeightBracket = (weight: number, measurementSystem: 'METRIC' | 'IMPERIAL'): '1' | '2' | '3' => {
    const weightInKg = measurementSystem === 'IMPERIAL' ? weight * 0.453592 : weight
    
    if (weightInKg <= 25) return '1'  // Small
    if (weightInKg <= 100) return '2'  // Medium
    return '3'  // Heavy
  }

  const getShipmentTypeCode = (transportMode: string, originCountry: string, destinationCountry: string): 'L' | 'R' | 'A' | 'S' | 'E' | 'W' => {
    if (transportMode === 'AIR') return 'A'
    if (transportMode === 'SEA') return 'S'
    if (transportMode === 'RAIL') return 'R'  // Rail is always Regional
    if (transportMode === 'LAND') {
      if (originCountry === destinationCountry) {
        return 'L'  // Local
      } else {
        return 'R'  // Regional
      }
    }
    return 'L'  // Default to Local
  }

  const generateLCC = () => {
    const originCity = formData.shipper.address.city
    const destinationCity = formData.consignee.address.city
    const originCountry = formData.shipper.address.country
    const destinationCountry = formData.consignee.address.country
    
    const shipmentType = getShipmentTypeCode(formData.transportMode, originCountry, destinationCountry)
    const originCode = getCityCode(originCity)
    const destinationCode = getCityCode(destinationCity)
    const weightBracket = getWeightBracket(formData.weight, formData.measurementSystem)
    const timeSensitivity = formData.isExpress ? 'X' : 'N'
    const serialNumber = Math.floor(Math.random() * 900 + 100).toString() // 3-digit random number
    
    const fullCode = `${shipmentType}-${originCode}-${destinationCode}-${weightBracket}-${serialNumber}${timeSensitivity}`
    
    return {
      shipmentType,
      originCode,
      destinationCode,
      weightBracket,
      timeSensitivity,
      serialNumber,
      fullCode
    }
  }

  const handleAddressChange = (section: 'shipper' | 'consignee', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section].address,
          [field]: value
        }
      }
    }))
  }

  const handleGoogleAddressSelect = (section: 'shipper' | 'consignee', addressData: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section].address,
          line1: addressData.street,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
          country: addressData.country
        }
      }
    }))
  }

  const addAddressLine = (section: 'shipper' | 'consignee') => {
    const currentAddress = formData[section].address
    if (!currentAddress.line2) {
      handleAddressChange(section, 'line2', '')
    } else if (!currentAddress.line3) {
      handleAddressChange(section, 'line3', '')
    }
  }

  const removeAddressLine = (section: 'shipper' | 'consignee', line: 'line2' | 'line3') => {
    handleAddressChange(section, line, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Calculate volume if not already set
      const volume = formData.volume || calculateVolume()
      const barcode = generateUnifiedBarcode()
      
      const submitData = {
        ...formData,
        volume,
        unifiedBarcode: barcode
      }

      // Submit to API
      const response = await fetch('/api/freight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit freight request')
      }

      const result = await response.json()
      console.log('Freight submitted successfully:', result)

      if (result.success) {
        setShowSuccess(true)
        // Reset form
        setFormData({
          ...formData,
          cargoDescriptions: [''],
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          volume: 0,
          additionalNotes: ''
        })
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Error submitting freight:', error)
      alert('Failed to submit freight request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateVolume = () => {
    const { length, width, height } = formData.dimensions
    if (formData.measurementSystem === 'METRIC') {
      return (length * width * height) / 1000000 // Convert cm³ to m³
    } else {
      return (length * width * height) / 1728 // Convert in³ to ft³
    }
  }

  const calculateChargeableWeight = () => {
    const { length, width, height } = formData.dimensions
    let volumeWeight: number
    
    if (formData.measurementSystem === 'METRIC') {
      // For air freight: kg = (L × W × H in cm) ÷ 6000
      volumeWeight = (length * width * height) / 6000
    } else {
      // For imperial: convert to kg
      volumeWeight = (length * width * height) / 166 // lbs, then convert to kg
      volumeWeight = volumeWeight * 0.453592
    }
    
    return Math.max(formData.weight, volumeWeight)
  }

  // Auto-update chargeable weight when dimensions or weight change
  useEffect(() => {
    if (formData.transportMode === 'AIR') {
      const newChargeableWeight = calculateChargeableWeight()
      setFormData(prev => ({
        ...prev,
        chargeableWeight: newChargeableWeight
      }))
    }
  }, [formData.dimensions, formData.weight, formData.transportMode])

  // Auto-generate LCC when relevant data changes
  useEffect(() => {
    if (formData.shipper.address.city && formData.consignee.address.city && formData.transportMode && formData.weight > 0) {
      const newLCC = generateLCC()
      setFormData(prev => ({
        ...prev,
        lccCode: newLCC
      }))
    }
  }, [
    formData.shipper.address.city,
    formData.consignee.address.city,
    formData.shipper.address.country,
    formData.consignee.address.country,
    formData.transportMode,
    formData.weight,
    formData.measurementSystem,
    formData.isExpress
  ])

  const generateUnifiedBarcode = () => {
    // Use LCC code as the primary barcode, fallback to old method if LCC not ready
    if (formData.lccCode.fullCode) {
      return `LNG-${formData.lccCode.fullCode}`
    }
    
    // Fallback method
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    const mode = formData.transportMode.charAt(0)
    const type = formData.freightType.charAt(0)
    return `LNG-${mode}${type}-${timestamp}-${random}`
  }

  const generateShippingLabel = () => {
    const barcode = generateUnifiedBarcode()
    const labelWindow = window.open('', '_blank')
    
    if (labelWindow) {
      labelWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Shipping Label</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
            }
            .label-container {
              width: 4in;
              height: 6in;
              border: 2px solid #000;
              padding: 10px;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .barcode {
              font-family: monospace;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              background: #f0f0f0;
              padding: 5px;
              margin: 10px 0;
              border: 1px solid #000;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-title {
              font-weight: bold;
              text-decoration: underline;
              margin-bottom: 5px;
            }
            .field {
              margin-bottom: 3px;
            }
            .field-label {
              font-weight: bold;
              font-size: 10px;
            }
            .field-value {
              font-size: 11px;
              margin-left: 10px;
            }
            .dimensions {
              display: flex;
              justify-content: space-between;
            }
            .dimension-item {
              text-align: center;
              flex: 1;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              margin-top: 20px;
              border-top: 1px solid #000;
              padding-top: 5px;
            }
            .print-button {
              position: fixed;
              top: 10px;
              right: 10px;
              padding: 10px 20px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">Print Label</button>
          
          <div class="label-container">
            <div class="header">
              <div class="company-name">LOGISTICS NG</div>
              <div>AI-Powered Freight Platform</div>
            </div>
            
            <div class="barcode">${barcode}</div>
            
            <div class="section">
              <div class="section-title">FROM</div>
              <div class="field">
                <div class="field-label">Shipper:</div>
                <div class="field-value">${formData.shipper.fullName}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.shipper.address.line1}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.shipper.address.city}, ${formData.shipper.address.state}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.shipper.address.country}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">TO</div>
              <div class="field">
                <div class="field-label">Consignee:</div>
                <div class="field-value">${formData.consignee.fullName}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.consignee.address.line1}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.consignee.address.city}, ${formData.consignee.address.state}</div>
              </div>
              <div class="field">
                <div class="field-value">${formData.consignee.address.country}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">SHIPMENT DETAILS</div>
              <div class="field">
                <div class="field-label">Mode:</div>
                <div class="field-value">${formData.transportMode}</div>
              </div>
              <div class="field">
                <div class="field-label">Weight:</div>
                <div class="field-value">${formData.weight} ${formData.measurementSystem === 'METRIC' ? 'kg' : 'lbs'}</div>
              </div>
              <div class="field">
                <div class="field-label">Description:</div>
                <div class="field-value">${formData.cargoDescriptions.join(', ')}</div>
              </div>
            </div>
            
            <div class="footer">
              <div>Logistics Nigeria - Freight Platform</div>
              <div>Track at: logistics.ng/track</div>
            </div>
          </div>
        </body>
        </html>
      `)
      labelWindow.document.close()
    }
  }

  const calculateShippingCost = () => {
    const baseCosts = { SEA: 15000, AIR: 45000, LAND: 25000 }
    const weightMultiplier = formData.weight * 100
    const volumeMultiplier = formData.volume * 5000
    return baseCosts[formData.transportMode] + weightMultiplier + volumeMultiplier
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Universal Freight Created!</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Your Unified Barcode:</div>
            <div className="font-mono text-lg font-bold text-logistics-600 bg-white px-3 py-2 rounded border">
              {generateUnifiedBarcode()}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            This single barcode will be used across all modules: tracking, customs, invoices, and carrier marketplace.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => generateShippingLabel()}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Shipping Label
            </button>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn-primary flex-1"
            >
              Create Another Freight
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-logistics-500 to-route-500 rounded-lg flex items-center justify-center mr-3">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Universal Freight Form</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          One unified form for all your freight needs. Fill once, use everywhere.
        </p>
        
        {/* Quick Signup Option */}
        {!session && (
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-6 py-3">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">New to our platform?</span>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Free Account
            </Link>
            <span className="text-xs text-blue-600">or</span>
            <Link
              href="/auth/signin"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Shipper Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-logistics-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">1. Shipper Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Individual Name *
              </label>
              <input
                type="text"
                required
                value={formData.shipper.fullName}
                onChange={(e) => handleInputChange('shipper', e.target.value, 'fullName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="Enter company or individual name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.shipper.contactName}
                onChange={(e) => handleInputChange('shipper', e.target.value, 'contactName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.shipper.email}
                onChange={(e) => handleInputChange('shipper', e.target.value, 'email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="flex">
                <select
                  value={formData.shipper.countryCode}
                  onChange={(e) => handleInputChange('shipper', e.target.value, 'countryCode')}
                  className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent bg-gray-50"
                >
                  <option value="+234">+234 (NG)</option>
                  <option value="+233">+233 (GH)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
                <input
                  type="tel"
                  required
                  value={formData.shipper.phone}
                  onChange={(e) => handleInputChange('shipper', e.target.value, 'phone')}
                  className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
          
          {/* Shipper Address */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Shipper Address</h3>
              <button
                type="button"
                onClick={() => addAddressLine('shipper')}
                className="text-logistics-600 hover:text-logistics-700 text-sm font-medium"
              >
                + Add Address Line
              </button>
            </div>
            
            <div className="space-y-4">
              <GooglePlacesInput
                placeholder="Street address"
                onAddressSelect={(addressData) => handleGoogleAddressSelect('shipper', addressData)}
                value={formData.shipper.address.line1}
                onChange={(value) => handleAddressChange('shipper', 'line1', value)}
              />
              
              {formData.shipper.address.line2 !== undefined && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.shipper.address.line2 || ''}
                    onChange={(e) => handleAddressChange('shipper', 'line2', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Address line 2 (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddressLine('shipper', 'line2')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {formData.shipper.address.line3 !== undefined && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.shipper.address.line3 || ''}
                    onChange={(e) => handleAddressChange('shipper', 'line3', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Address line 3 (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddressLine('shipper', 'line3')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  value={formData.shipper.address.city}
                  onChange={(e) => handleAddressChange('shipper', 'city', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="City"
                />
                <input
                  type="text"
                  required
                  value={formData.shipper.address.state}
                  onChange={(e) => handleAddressChange('shipper', 'state', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="State/Province"
                />
                <input
                  type="text"
                  value={formData.shipper.address.postalCode}
                  onChange={(e) => handleAddressChange('shipper', 'postalCode', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Postal Code"
                />
              </div>
              
              <select
                required
                value={formData.shipper.address.country}
                onChange={(e) => handleAddressChange('shipper', 'country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Account Creation Prompt */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Save your information for faster shipping
                </h4>
                <p className="text-xs text-blue-700 mb-3">
                  Create a free account to save your details, track shipments, and access exclusive features.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-600">
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Save shipping addresses
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Track all shipments
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Get shipping discounts
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Consignee Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-route-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">2. Consignee Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Individual Name *
              </label>
              <input
                type="text"
                required
                value={formData.consignee.fullName}
                onChange={(e) => handleInputChange('consignee', e.target.value, 'fullName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="Enter company or individual name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.consignee.contactName}
                onChange={(e) => handleInputChange('consignee', e.target.value, 'contactName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.consignee.email}
                onChange={(e) => handleInputChange('consignee', e.target.value, 'email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="flex">
                <select
                  value={formData.consignee.countryCode}
                  onChange={(e) => handleInputChange('consignee', e.target.value, 'countryCode')}
                  className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent bg-gray-50"
                >
                  <option value="+234">+234 (NG)</option>
                  <option value="+233">+233 (GH)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
                <input
                  type="tel"
                  required
                  value={formData.consignee.phone}
                  onChange={(e) => handleInputChange('consignee', e.target.value, 'phone')}
                  className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
          
          {/* Consignee Address */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
              <button
                type="button"
                onClick={() => addAddressLine('consignee')}
                className="text-logistics-600 hover:text-logistics-700 text-sm font-medium"
              >
                + Add Address Line
              </button>
            </div>
            
            <div className="space-y-4">
              <GooglePlacesInput
                placeholder="Delivery street address"
                onAddressSelect={(addressData) => handleGoogleAddressSelect('consignee', addressData)}
                value={formData.consignee.address.line1}
                onChange={(value) => handleAddressChange('consignee', 'line1', value)}
              />
              
              {formData.consignee.address.line2 !== undefined && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.consignee.address.line2 || ''}
                    onChange={(e) => handleAddressChange('consignee', 'line2', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Address line 2 (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddressLine('consignee', 'line2')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {formData.consignee.address.line3 !== undefined && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.consignee.address.line3 || ''}
                    onChange={(e) => handleAddressChange('consignee', 'line3', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Address line 3 (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddressLine('consignee', 'line3')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  value={formData.consignee.address.city}
                  onChange={(e) => handleAddressChange('consignee', 'city', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="City"
                />
                <input
                  type="text"
                  required
                  value={formData.consignee.address.state}
                  onChange={(e) => handleAddressChange('consignee', 'state', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="State/Province"
                />
                <input
                  type="text"
                  value={formData.consignee.address.postalCode}
                  onChange={(e) => handleAddressChange('consignee', 'postalCode', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Postal Code"
                />
              </div>
              
              <select
                required
                value={formData.consignee.address.country}
                onChange={(e) => handleAddressChange('consignee', 'country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Measurement System */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Ruler className="w-6 h-6 text-cargo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">3. Measurement System</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => handleInputChange('measurementSystem', 'METRIC')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.measurementSystem === 'METRIC'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Metric System</h3>
                  <p className="text-sm text-gray-600">kg, cm, m³</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.measurementSystem === 'METRIC'
                    ? 'border-logistics-500 bg-logistics-500'
                    : 'border-gray-300'
                }`} />
              </div>
            </div>
            
            <div
              onClick={() => handleInputChange('measurementSystem', 'IMPERIAL')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.measurementSystem === 'IMPERIAL'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Imperial System</h3>
                  <p className="text-sm text-gray-600">lbs, in, ft³</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.measurementSystem === 'IMPERIAL'
                    ? 'border-logistics-500 bg-logistics-500'
                    : 'border-gray-300'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Transport Mode */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Truck className="w-6 h-6 text-route-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">4. Transport Mode</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div
              onClick={() => handleInputChange('transportMode', 'SEA')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.transportMode === 'SEA'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Ship className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-medium text-gray-900">Sea Freight</h3>
                <p className="text-sm text-gray-600 mt-1">Cost-effective for large shipments</p>
                <div className="mt-2 text-xs text-green-600 font-medium">From ₦15,000</div>
              </div>
            </div>
            
            <div
              onClick={() => handleInputChange('transportMode', 'AIR')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.transportMode === 'AIR'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Plane className="w-8 h-8 mx-auto mb-3 text-sky-600" />
                <h3 className="font-medium text-gray-900">Air Freight</h3>
                <p className="text-sm text-gray-600 mt-1">Fast delivery worldwide</p>
                <div className="mt-2 text-xs text-green-600 font-medium">From ₦45,000</div>
              </div>
            </div>
            
            <div
              onClick={() => handleInputChange('transportMode', 'LAND')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.transportMode === 'LAND'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-medium text-gray-900">Land Transport</h3>
                <p className="text-sm text-gray-600 mt-1">Reliable domestic delivery</p>
                <div className="mt-2 text-xs text-green-600 font-medium">From ₦25,000</div>
              </div>
            </div>
            
            <div
              onClick={() => handleInputChange('transportMode', 'RAIL')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.transportMode === 'RAIL'
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-medium text-gray-900">Rail Transport</h3>
                <p className="text-sm text-gray-600 mt-1">Efficient bulk cargo transport</p>
                <div className="mt-2 text-xs text-purple-600 font-medium">From ₦18,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Dynamic Transport-Specific Forms */}
        {formData.transportMode === 'SEA' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Ship className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">5. Sea Freight Details</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Type</label>
                <select
                  value={formData.seaShipmentType}
                  onChange={(e) => handleInputChange('seaShipmentType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                >
                  <option value="">Select shipment type</option>
                  <option value="FCL">Full Container Load (FCL)</option>
                  <option value="LCL">Less than Container Load (LCL)</option>
                  <option value="BREAKBULK">Breakbulk / RoRo</option>
                  <option value="PROJECT">Project Cargo</option>
                </select>
              </div>
              
              {formData.seaShipmentType === 'FCL' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Container Size</label>
                    <select
                      value={formData.containerSize}
                      onChange={(e) => handleInputChange('containerSize', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="20ft">20ft</option>
                      <option value="40ft">40ft</option>
                      <option value="40ft HC">40ft HC</option>
                      <option value="45ft">45ft</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Container Type</label>
                    <select
                      value={formData.containerType}
                      onChange={(e) => handleInputChange('containerType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="STANDARD">Standard</option>
                      <option value="REEFER">Reefer</option>
                      <option value="TANK">Tank</option>
                      <option value="FLAT_RACK">Flat Rack</option>
                      <option value="OPEN_TOP">Open Top</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Containers</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.containerCount}
                      onChange={(e) => handleInputChange('containerCount', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Port</label>
                  <select
                    value={formData.originPort}
                    onChange={(e) => handleInputChange('originPort', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select origin port</option>
                    <option value="APAPA">Apapa Port, Lagos</option>
                    <option value="TIN_CAN">Tin Can Island Port, Lagos</option>
                    <option value="ONNE">Onne Port, Rivers</option>
                    <option value="CALABAR">Calabar Port, Cross River</option>
                    <option value="WARRI">Warri Port, Delta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Port</label>
                  <input
                    type="text"
                    value={formData.destinationPort}
                    onChange={(e) => handleInputChange('destinationPort', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Enter destination port"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transshipment"
                  checked={formData.transshipmentRequired}
                  onChange={(e) => handleInputChange('transshipmentRequired', e.target.checked)}
                  className="w-4 h-4 text-logistics-600 border-gray-300 rounded focus:ring-logistics-500"
                />
                <label htmlFor="transshipment" className="ml-2 text-sm text-gray-700">
                  Transshipment Required
                </label>
              </div>
            </div>
          </div>
        )}

        {formData.transportMode === 'AIR' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Plane className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">5. Air Freight Details</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Type</label>
                <select
                  value={formData.airShipmentType}
                  onChange={(e) => handleInputChange('airShipmentType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                >
                  <option value="">Select shipment type</option>
                  <option value="GENERAL">General Cargo</option>
                  <option value="PERISHABLE">Perishable Cargo</option>
                  <option value="DANGEROUS">Dangerous Goods (DG)</option>
                  <option value="LIVE_ANIMALS">Live Animals (AVI)</option>
                  <option value="EXPRESS">Express/Parcel</option>
                </select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Airport</label>
                  <select
                    value={formData.originAirport}
                    onChange={(e) => handleInputChange('originAirport', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select origin airport</option>
                    <option value="LOS">Murtala Muhammed Airport, Lagos (LOS)</option>
                    <option value="ABV">Nnamdi Azikiwe Airport, Abuja (ABV)</option>
                    <option value="PHC">Port Harcourt Airport (PHC)</option>
                    <option value="KAN">Mallam Aminu Kano Airport (KAN)</option>
                    <option value="ILR">Ilorin Airport (ILR)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Airport</label>
                  <input
                    type="text"
                    value={formData.destinationAirport}
                    onChange={(e) => handleInputChange('destinationAirport', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Enter destination airport"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transit"
                  checked={formData.transitRequired}
                  onChange={(e) => handleInputChange('transitRequired', e.target.checked)}
                  className="w-4 h-4 text-logistics-600 border-gray-300 rounded focus:ring-logistics-500"
                />
                <label htmlFor="transit" className="ml-2 text-sm text-gray-700">
                  Transit Required
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chargeable Weight ({formData.measurementSystem === 'METRIC' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chargeableWeight}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  placeholder="Auto-calculated from weight and volume"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatically calculated as the greater of actual weight or volume weight
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.transportMode === 'LAND' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Truck className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">5. Land Transport Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type</label>
                  <select
                    value={formData.landTransportType}
                    onChange={(e) => handleInputChange('landTransportType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select transport type</option>
                    <option value="TRUCK">Truck</option>
                    <option value="TRAIN">Train</option>
                    <option value="BUS">Bus</option>
                    <option value="VAN">Van</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Route Type</label>
                  <select
                    value={formData.landRouteType}
                    onChange={(e) => handleInputChange('landRouteType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select route type</option>
                    <option value="DIRECT">Direct</option>
                    <option value="MULTI_STOP">Multi-Stop</option>
                    <option value="CROSS_BORDER">Cross-Border</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.transportMode === 'RAIL' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Truck className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">5. Rail Transport Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={formData.railServiceType}
                    onChange={(e) => handleInputChange('railServiceType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select service type</option>
                    <option value="FREIGHT">Freight</option>
                    <option value="CONTAINER">Container</option>
                    <option value="BULK">Bulk Cargo</option>
                    <option value="INTERMODAL">Intermodal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rail Car Type</label>
                  <select
                    value={formData.railCarType}
                    onChange={(e) => handleInputChange('railCarType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="">Select car type</option>
                    <option value="BOX_CAR">Box Car</option>
                    <option value="FLAT_CAR">Flat Car</option>
                    <option value="TANK_CAR">Tank Car</option>
                    <option value="REEFER_CAR">Reefer Car</option>
                    <option value="HOPPER_CAR">Hopper Car</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Cars</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.railCarCount}
                    onChange={(e) => handleInputChange('railCarCount', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="Number of rail cars"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transit Required</label>
                  <select
                    value={formData.railTransitRequired.toString()}
                    onChange={(e) => handleInputChange('railTransitRequired', e.target.value === 'true')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  >
                    <option value="false">No Transit</option>
                    <option value="true">Transit Required</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Station</label>
                  <input
                    type="text"
                    value={formData.railOriginStation}
                    onChange={(e) => handleInputChange('railOriginStation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="e.g., Lagos Central Station"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Station</label>
                  <input
                    type="text"
                    value={formData.railDestinationStation}
                    onChange={(e) => handleInputChange('railDestinationStation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                    placeholder="e.g., Kano Railway Station"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Express Service Option */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Truck className="w-6 h-6 text-logistics-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">5. Service Priority</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => handleInputChange('isExpress', false)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                !formData.isExpress
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Standard Delivery</h3>
                  <p className="text-sm text-gray-500">Regular processing time</p>
                </div>
              </div>
            </div>
            
            <div
              onClick={() => handleInputChange('isExpress', true)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.isExpress
                  ? 'border-logistics-500 bg-logistics-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Express Delivery</h3>
                  <p className="text-sm text-gray-500">Priority processing & faster delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Shipment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-cargo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">6. Shipment Details</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Freight Type *
                </label>
                <select
                  required
                  value={formData.freightType}
                  onChange={(e) => handleInputChange('freightType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                >
                  <option value="FCL">Full Container Load (FCL)</option>
                  <option value="LCL">Less than Container Load (LCL)</option>
                  <option value="LTL">Less than Truckload (LTL)</option>
                  <option value="COURIER">Courier/Express</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity/Units *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Number of units"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo Descriptions *
              </label>
              <div className="space-y-4">
                {formData.cargoDescriptions.map((description, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-logistics-100 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-sm font-medium text-logistics-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Item {index + 1} Description
                      </label>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => handleCargoDescriptionChange(index, e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent resize-none"
                        placeholder={`Describe item ${index + 1}...`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight ({formData.measurementSystem === 'METRIC' ? 'kg' : 'lbs'}) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Total weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Packaging Type *
                </label>
                <select
                  required
                  value={formData.packagingType}
                  onChange={(e) => handleInputChange('packagingType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                >
                  <option value="PALLET">Pallet</option>
                  <option value="CRATE">Crate</option>
                  <option value="BOX">Box</option>
                  <option value="LOOSE">Loose</option>
                  <option value="CONTAINER">Container</option>
                </select>
              </div>
            </div>
            
            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (L × W × H in {formData.measurementSystem === 'METRIC' ? 'cm' : 'in'}) *
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={formData.dimensions.length}
                  onChange={(e) => handleNestedInputChange('dimensions', 'length', parseFloat(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Length"
                />
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={formData.dimensions.width}
                  onChange={(e) => handleNestedInputChange('dimensions', 'width', parseFloat(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Width"
                />
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={formData.dimensions.height}
                  onChange={(e) => handleNestedInputChange('dimensions', 'height', parseFloat(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
                  placeholder="Height"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Volume ({formData.measurementSystem === 'METRIC' ? 'CBM' : 'ft³'})
              </label>
              <input
                type="number"
                step="0.001"
                value={calculateVolume().toFixed(3)}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                placeholder="Auto-calculated from dimensions"
              />
            </div>
            
            {/* Special Handling */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Handling Requirements
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {specialHandlingOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialHandling.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('specialHandling', [...formData.specialHandling, option])
                        } else {
                          handleInputChange('specialHandling', formData.specialHandling.filter(h => h !== option))
                        }
                      }}
                      className="w-4 h-4 text-logistics-600 border-gray-300 rounded focus:ring-logistics-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LCC Code Display */}
        {formData.lccCode.fullCode && (
          <div className="bg-gradient-to-r from-logistics-50 to-blue-50 rounded-xl shadow-sm border border-logistics-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-logistics-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-logistics-600 font-bold text-sm">LCC</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Logistics Classification Code</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Full LCC Code:</span>
                  <span className="text-lg font-mono font-bold text-logistics-600 bg-white px-3 py-1 rounded border">
                    {formData.lccCode.fullCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Shipment Type:</span>
                  <span className="text-sm text-gray-800">
                    {formData.lccCode.shipmentType === 'L' && 'Local'}
                    {formData.lccCode.shipmentType === 'R' && (formData.transportMode === 'RAIL' ? 'Rail' : 'Regional')}
                    {formData.lccCode.shipmentType === 'A' && 'Air Freight'}
                    {formData.lccCode.shipmentType === 'S' && 'Sea Freight'}
                    {formData.lccCode.shipmentType === 'E' && 'Express'}
                    {formData.lccCode.shipmentType === 'W' && 'Warehouse Transfer'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Route:</span>
                  <span className="text-sm text-gray-800">
                    {formData.lccCode.originCode} → {formData.lccCode.destinationCode}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Weight Bracket:</span>
                  <span className="text-sm text-gray-800">
                    {formData.lccCode.weightBracket === '1' && 'Small (≤25kg)'}
                    {formData.lccCode.weightBracket === '2' && 'Medium (25-100kg)'}
                    {formData.lccCode.weightBracket === '3' && 'Heavy (>100kg)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Priority:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    formData.lccCode.timeSensitivity === 'X' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formData.lccCode.timeSensitivity === 'X' ? 'Express' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Serial Number:</span>
                  <span className="text-sm text-gray-800 font-mono">#{formData.lccCode.serialNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Manifest Sorting:</strong> This code enables automatic sorting by shipment type → destination → weight bracket → serial number for efficient processing and tracking.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-4 text-lg flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating Freight...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Create Universal Freight
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
