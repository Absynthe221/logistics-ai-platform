import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get system statistics
    const [
      totalUsers,
      activeShipments,
      totalRevenue,
      recentAlerts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.shipment.count({ where: { status: 'IN_TRANSIT' } }),
      prisma.shipment.aggregate({
        _sum: { value: true },
        where: { status: 'DELIVERED' }
      }),
      prisma.trackingEvent.findMany({
        where: { 
          eventType: 'EXCEPTION',
          timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        },
        take: 5,
        orderBy: { timestamp: 'desc' }
      })
    ])

    // Calculate system health based on various metrics
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent'
    
    if (recentAlerts.length > 10) {
      systemHealth = 'critical'
    } else if (recentAlerts.length > 5) {
      systemHealth = 'warning'
    } else if (recentAlerts.length > 2) {
      systemHealth = 'good'
    }

    const stats = {
      totalUsers,
      activeShipments,
      totalRevenue: totalRevenue._sum.value || 0,
      systemHealth,
      recentAlerts: recentAlerts.map(alert => ({
        id: alert.id,
        type: 'warning' as const,
        message: `Tracking exception: ${alert.description}`,
        timestamp: alert.timestamp.toISOString()
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
