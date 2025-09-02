import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse the freight form data
    const freightData = await request.json()
    
    // Generate unified barcode if not provided
    if (!freightData.unifiedBarcode) {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substr(2, 5).toUpperCase()
      const mode = freightData.transportMode.charAt(0)
      const type = freightData.freightType.charAt(0)
      freightData.unifiedBarcode = `LNG-${mode}${type}-${timestamp}-${random}`
    }

    // Create the freight record in database
    const freight = await prisma.freight.create({
      data: {
        barcode: freightData.unifiedBarcode,
        shipperId: session.user.id,
        shipperName: freightData.shipper.fullName,
        shipperContact: freightData.shipper.contactName,
        shipperEmail: freightData.shipper.email,
        shipperPhone: freightData.shipper.phone,
        shipperAddress: JSON.stringify(freightData.shipper.address),
        
        consigneeName: freightData.consignee.fullName,
        consigneeContact: freightData.consignee.contactName,
        consigneeEmail: freightData.consignee.email,
        consigneePhone: freightData.consignee.phone,
        consigneeAddress: JSON.stringify(freightData.consignee.address),
        
        freightType: freightData.freightType,
        transportMode: freightData.transportMode,
        cargoDescription: freightData.cargoDescription,
        quantity: freightData.quantity,
        units: freightData.units,
        weight: freightData.weight,
        dimensions: JSON.stringify(freightData.dimensions),
        volume: freightData.volume,
        packagingType: freightData.packagingType,
        specialHandling: JSON.stringify(freightData.specialHandling),
        
        originLocation: freightData.originLocation,
        destinationLocation: freightData.destinationLocation,
        preferredRoute: freightData.preferredRoute,
        incoterms: freightData.incoterms,
        
        isInternational: freightData.isInternational,
        invoiceNumber: freightData.invoiceNumber,
        invoiceValue: freightData.invoiceValue,
        currency: freightData.currency,
        countryOfOrigin: freightData.countryOfOrigin,
        countryOfDestination: freightData.countryOfDestination,
        hsCode: freightData.hsCode,
        
        insuranceRequired: freightData.insuranceRequired,
        escrowPayment: freightData.escrowPayment,
        pickupService: freightData.pickupService,
        deliveryType: freightData.deliveryType,
        
        paymentMethod: freightData.paymentMethod,
        billingAddress: JSON.stringify(freightData.billingAddress),
        taxNumber: freightData.taxNumber,
        freightQuote: freightData.freightQuote,
        
        carrierAssignment: freightData.carrierAssignment,
        notifications: JSON.stringify(freightData.notifications),
        
        pickupDate: freightData.pickupDate ? new Date(freightData.pickupDate) : null,
        deliveryDate: freightData.deliveryDate ? new Date(freightData.deliveryDate) : null,
        additionalNotes: freightData.additionalNotes,
        
        status: 'PENDING_APPROVAL', // Admin needs to review
        adminNotified: true,
        adminNotificationSent: new Date(),
        
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create admin notification
    await prisma.adminNotification.create({
      data: {
        type: 'NEW_FREIGHT_REQUEST',
        title: 'New Freight Request Submitted',
        message: `New freight request submitted by ${freightData.shipper.fullName} for ${freightData.consignee.fullName}`,
        freightId: freight.id,
        barcode: freight.barcode,
        priority: 'HIGH',
        isRead: false,
        createdAt: new Date()
      }
    })

    // Create tracking event
    await prisma.trackingEvent.create({
      data: {
        shipmentId: freight.id, // Using freight ID as shipment ID
        eventType: 'CREATED',
        status: 'PENDING_APPROVAL',
        location: JSON.stringify({ 
          city: 'System', 
          coordinates: { lat: 0, lng: 0 } 
        }),
        description: 'Freight request submitted and pending admin approval',
        timestamp: new Date()
      }
    })

    // Send real-time notification to admin dashboard (if using WebSockets)
    // This would be implemented with Socket.io or similar in production
    
    return NextResponse.json({
      success: true,
      message: 'Freight request submitted successfully',
      freight: {
        id: freight.id,
        barcode: freight.barcode,
        status: freight.status,
        adminNotified: freight.adminNotified
      }
    })

  } catch (error) {
    console.error('Error submitting freight:', error)
    return NextResponse.json(
      { error: 'Failed to submit freight request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get freight requests (admin sees all, users see their own)
    const freightRequests = await prisma.freight.findMany({
      where: session.user.role === 'ADMIN' ? {} : { shipperId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        shipper: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ freightRequests })

  } catch (error) {
    console.error('Error fetching freight:', error)
    return NextResponse.json(
      { error: 'Failed to fetch freight requests' },
      { status: 500 }
    )
  }
}
