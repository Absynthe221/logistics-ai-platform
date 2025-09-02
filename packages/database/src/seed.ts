import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@logistics.ng' },
    update: {},
    create: {
      email: 'admin@logistics.ng',
                      password: '$2a$10$TlhJgnr6leUCuESObIvruexI0q05N.adpYsVBOpx1rPfPE4OouQVe', // password: admin123
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  // Create shipper user
  const shipperUser = await prisma.user.upsert({
    where: { email: 'shipper@logistics.ng' },
    update: {},
    create: {
      email: 'shipper@logistics.ng',
                      password: '$2a$10$TlhJgnr6leUCuESObIvruexI0q05N.adpYsVBOpx1rPfPE4OouQVe', // password: admin123
      name: 'John Shipper',
      role: 'SHIPPER',
      status: 'ACTIVE',
      companyName: 'TechCorp Nigeria'
    }
  })

  // Create carrier user
  const carrierUser = await prisma.user.upsert({
    where: { email: 'carrier@logistics.ng' },
    update: {},
    create: {
      email: 'carrier@logistics.ng',
                      password: '$2a$10$TlhJgnr6leUCuESObIvruexI0q05N.adpYsVBOpx1rPfPE4OouQVe', // password: admin123
      name: 'Mohammed Carrier',
      role: 'CARRIER',
      status: 'ACTIVE',
      companyName: 'FastTrack Logistics'
    }
  })

  // Create driver user
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@logistics.ng' },
    update: {},
    create: {
      email: 'driver@logistics.ng',
                      password: '$2a$10$TlhJgnr6leUCuESObIvruexI0q05N.adpYsVBOpx1rPfPE4OouQVe', // password: admin123
      name: 'Ibrahim Driver',
      role: 'DRIVER',
      status: 'ACTIVE'
    }
  })

  // Create sample shipment
  const shipment = await prisma.shipment.upsert({
    where: { barcode: 'LNG-DOM-LAG-A7K9M2N5' },
    update: {},
    create: {
      barcode: 'LNG-DOM-LAG-A7K9M2N5',
      shipperId: shipperUser.id,
      carrierId: carrierUser.id,
      origin: JSON.stringify({ city: 'Lagos', state: 'Lagos', address: 'Industrial Estate, Lagos' }),
      destination: JSON.stringify({ city: 'Abuja', state: 'FCT', address: 'Central Business District, Abuja' }),
      description: 'Electronic components for data center setup',
      weight: 2500,
      volume: 15,
      value: 4500000,
      category: 'Electronics',
      shipmentType: 'DOMESTIC',
      status: 'IN_TRANSIT',
      priority: 'HIGH',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      currency: 'NGN'
    }
  })

  // Create sample load
  const load = await prisma.load.upsert({
    where: { loadNumber: 'LD-1733097600000-ABCD' },
    update: {},
    create: {
      loadNumber: 'LD-1733097600000-ABCD',
      shipperId: shipperUser.id,
      origin: JSON.stringify({ city: 'Lagos', state: 'Lagos' }),
      destination: JSON.stringify({ city: 'Abuja', state: 'FCT' }),
      maxWeight: 5000,
      maxVolume: 30,
      rate: 450000,
      weight: 2500,
      volume: 15,
      cargoType: 'Electronics',
      description: 'Electronic components for data center setup',
      requirements: JSON.stringify(['Temperature controlled', 'Fragile handling']),
      status: 'AVAILABLE',
      vehicleType: 'Truck',
      aiOptimized: true,
      ltlOpportunity: true
    }
  })

  // Create tracking event
  await prisma.trackingEvent.create({
    data: {
      shipmentId: shipment.id,
      eventType: 'IN_TRANSIT',
      status: 'IN_TRANSIT',
      location: JSON.stringify({ city: 'Lagos-Ibadan Expressway', coordinates: { lat: 6.8333, lng: 3.5833 } }),
      description: 'Vehicle departed Lagos, en route to Abuja',
      timestamp: new Date()
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('👥 Users created:', { admin: adminUser.email, shipper: shipperUser.email, carrier: carrierUser.email, driver: driverUser.email })
  console.log('📦 Sample shipment created:', shipment.barcode)
  console.log('🚛 Sample load created:', load.loadNumber)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
