'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, X } from 'lucide-react'

interface GooglePlacesInputProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect: (address: AddressData) => void
  placeholder: string
  label: string
  required?: boolean
  className?: string
}

interface AddressData {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  terms: Array<{
    value: string
    offset: number
  }>
}

interface ParsedAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export function GooglePlacesInput({
  value,
  onChange,
  onAddressSelect,
  placeholder,
  label,
  required = false,
  className = ''
}: GooglePlacesInputProps) {
  const [suggestions, setSuggestions] = useState<AddressData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Mock Google Places API for development
  const mockGooglePlacesAPI = async (input: string): Promise<AddressData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockSuggestions: AddressData[] = [
      {
        place_id: '1',
        description: `${input}, Lagos, Lagos State, Nigeria`,
        structured_formatting: {
          main_text: input,
          secondary_text: 'Lagos, Lagos State, Nigeria'
        },
        terms: [
          { value: input, offset: 0 },
          { value: 'Lagos', offset: input.length + 2 },
          { value: 'Lagos State', offset: input.length + 8 },
          { value: 'Nigeria', offset: input.length + 20 }
        ]
      },
      {
        place_id: '2',
        description: `${input} Street, Victoria Island, Lagos, Nigeria`,
        structured_formatting: {
          main_text: `${input} Street`,
          secondary_text: 'Victoria Island, Lagos, Nigeria'
        },
        terms: [
          { value: `${input} Street`, offset: 0 },
          { value: 'Victoria Island', offset: input.length + 8 },
          { value: 'Lagos', offset: input.length + 24 },
          { value: 'Nigeria', offset: input.length + 31 }
        ]
      },
      {
        place_id: '3',
        description: `${input} Avenue, Ikeja, Lagos State, Nigeria`,
        structured_formatting: {
          main_text: `${input} Avenue`,
          secondary_text: 'Ikeja, Lagos State, Nigeria'
        },
        terms: [
          { value: `${input} Avenue`, offset: 0 },
          { value: 'Ikeja', offset: input.length + 8 },
          { value: 'Lagos State', offset: input.length + 15 },
          { value: 'Nigeria', offset: input.length + 27 }
        ]
      }
    ]
    
    return mockSuggestions.filter(suggestion => 
      suggestion.description.toLowerCase().includes(input.toLowerCase())
    )
  }

  const searchAddresses = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      // In production, replace this with actual Google Places API
      const results = await mockGooglePlacesAPI(input)
      setSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching addresses:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (input: string) => {
    onChange(input)
    searchAddresses(input)
  }

  const handleSuggestionClick = (suggestion: AddressData) => {
    onChange(suggestion.description)
    setShowSuggestions(false)
    
    // Parse the address and extract components
    const parsedAddress = parseAddress(suggestion)
    onAddressSelect(parsedAddress)
  }

  const parseAddress = (suggestion: AddressData): ParsedAddress => {
    // Simple address parsing - in production, use Google's structured data
    const description = suggestion.description
    const parts = description.split(', ')
    
    let street = parts[0] || ''
    let city = ''
    let state = ''
    let postalCode = ''
    let country = 'Nigeria' // Default to Nigeria
    
    if (parts.length >= 2) {
      city = parts[1] || ''
    }
    
    if (parts.length >= 3) {
      if (parts[2].includes('State')) {
        state = parts[2]
        if (parts.length >= 4) {
          country = parts[3] || 'Nigeria'
        }
      } else {
        country = parts[2] || 'Nigeria'
      }
    }
    
    // Extract postal code if present (usually 5-6 digits)
    const postalCodeMatch = description.match(/\b\d{5,6}\b/)
    if (postalCodeMatch) {
      postalCode = postalCodeMatch[0]
    }
    
    return {
      street,
      city,
      state,
      postalCode,
      country
    }
  }

  const clearInput = () => {
    onChange('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logistics-500 focus:border-transparent"
          autoComplete="off"
        />
        
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-logistics-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching addresses...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.structured_formatting.main_text}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No addresses found</p>
            </div>
          )}
        </div>
      )}

      {/* Google Places API Notice */}
      <div className="mt-2 text-xs text-gray-500">
        <span className="inline-flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          Powered by Google Places API
        </span>
      </div>
    </div>
  )
}
