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
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')

    let where: any = {}
    
    if (status) where.status = status
    if (role === 'SHIPPER') where.shipperId = session.user.id
    if (role === 'CARRIER') where.carrierId = session.user.id
    if (userId) where.OR = [{ shipperId: userId }, { carrierId: userId }]

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        shipper: { select: { name: true, email: true } },
        carrier: { select: { name: true, email: true } },
        company: { select: { name: true } },
        trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(shipments)
  } catch (error) {
    console.error('Error fetching shipments:', error)
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
    const { origin, destination, description, weight, volume, value, category } = body

    const shipment = await prisma.shipment.create({
      data: {
        barcode: `LNG-DOM-${origin.city.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        shipperId: session.user.id,
        origin,
        destination,
        description,
        weight: parseFloat(weight),
        volume: parseFloat(volume),
        value: parseFloat(value),
        category,
        status: 'PENDING'
      },
      include: {
        shipper: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
