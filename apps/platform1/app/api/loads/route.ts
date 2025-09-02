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
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    const cargoType = searchParams.get('cargoType')
    const status = searchParams.get('status') || 'available'

    let where: any = { status }
    
    if (origin) where.origin = { path: ['city'], equals: origin }
    if (destination) where.destination = { path: ['city'], equals: destination }
    if (cargoType) where.cargoType = cargoType

    const loads = await prisma.load.findMany({
      where,
      include: {
        shipper: { select: { name: true, email: true, rating: true } },
        origin: true,
        destination: true,
        _count: { select: { bids: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(loads)
  } catch (error) {
    console.error('Error fetching loads:', error)
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
    const { origin, destination, description, weight, volume, rate, pickupDate, deliveryDate, requirements } = body

    const load = await prisma.load.create({
      data: {
        loadNumber: `LD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        shipperId: session.user.id,
        origin,
        destination,
        description,
        weight: parseFloat(weight),
        volume: parseFloat(volume),
        rate: parseFloat(rate),
        pickupDate: new Date(pickupDate),
        deliveryDate: new Date(deliveryDate),
        requirements,
        status: 'available'
      },
      include: {
        shipper: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json(load, { status: 201 })
  } catch (error) {
    console.error('Error creating load:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
