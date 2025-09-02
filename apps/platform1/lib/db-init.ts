import { getPrisma } from './prisma'

let isInitialized = false

export async function ensureDatabaseInitialized() {
  if (isInitialized) return
  
  try {
    const prisma = getPrisma()
    
    // Test if database is accessible
    await prisma.$queryRaw`SELECT 1`
    
    // Check if tables exist, if not create them
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    ` as any[]
    
    if (tables.length === 0) {
      console.log('Database not initialized, running migrations...')
      // Run Prisma migrations
      const { execSync } = require('child_process')
      execSync('npx prisma db push', { stdio: 'inherit' })
      console.log('Database initialized successfully')
    }
    
    isInitialized = true
  } catch (error) {
    console.error('Database initialization failed:', error)
    // Don't throw, let the app continue with graceful degradation
  }
}
