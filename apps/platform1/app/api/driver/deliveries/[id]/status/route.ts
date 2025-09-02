import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()
    const deliveryId = params.id

    // Verify the delivery belongs to this driver
    const delivery = await prisma.shipment.findFirst({
      where: { 
        id: deliveryId,
        carrierId: session.user.id
      }
    })

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 })
    }

    // Update shipment status
    const updatedShipment = await prisma.shipment.update({
      where: { id: deliveryId },
      data: { status: status.toUpperCase() }
    })

    // Create tracking event
    await prisma.trackingEvent.create({
      data: {
        shipmentId: deliveryId,
        eventType: 'STATUS_UPDATE',
        status: status.toUpperCase(),
        location: delivery.destination, // Current location
        description: `Status updated to ${status} by driver`,
        timestamp: new Date()
      }
    })

    return NextResponse.json(updatedShipment)
  } catch (error) {
    console.error('Error updating delivery status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
