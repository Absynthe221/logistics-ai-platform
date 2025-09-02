import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let where: any = { carrierId: session.user.id }
    if (status) where.status = status

    const deliveries = await prisma.shipment.findMany({
      where,
      include: {
        shipper: { select: { name: true, phone: true } },
        origin: true,
        destination: true,
        trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to driver-friendly format
    const driverDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      barcode: delivery.barcode,
      origin: delivery.origin,
      destination: delivery.destination,
      status: delivery.status.toLowerCase(),
      estimatedDelivery: delivery.estimatedDelivery?.toISOString() || '',
      customer: {
        name: delivery.shipper.name,
        phone: delivery.shipper.phone || ''
      },
      cargo: {
        type: delivery.category || 'General Cargo',
        weight: `${delivery.weight || 0}kg`,
        description: delivery.description
      }
    }))

    return NextResponse.json(driverDeliveries)
  } catch (error) {
    console.error('Error fetching driver deliveries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
