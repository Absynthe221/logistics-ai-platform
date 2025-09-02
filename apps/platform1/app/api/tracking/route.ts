import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const barcode = searchParams.get('barcode')
    const shipmentId = searchParams.get('shipmentId')

    if (!barcode && !shipmentId) {
      return NextResponse.json({ error: 'Barcode or shipment ID required' }, { status: 400 })
    }

    let where: any = {}
    if (barcode) where.barcode = barcode
    if (shipmentId) where.id = shipmentId

    const shipment = await prisma.shipment.findFirst({
      where,
      include: {
        shipper: { select: { name: true, email: true, phone: true } },
        carrier: { select: { name: true, email: true, phone: true } },
        trackingEvents: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error fetching tracking info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shipmentId, eventType, status, location, description } = body

    const trackingEvent = await prisma.trackingEvent.create({
      data: {
        shipmentId,
        eventType,
        status,
        location,
        description,
        timestamp: new Date()
      }
    })

    // Update shipment status
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status }
    })

    return NextResponse.json(trackingEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating tracking event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
