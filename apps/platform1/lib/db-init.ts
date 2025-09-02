import { getPrisma } from './prisma'

let isInitialized = false

export async function ensureDatabaseInitialized() {
  if (isInitialized) return
  
  try {
    const prisma = getPrisma()
    
    // Test if database is accessible
    await prisma.$queryRaw`SELECT 1`
    
    // For in-memory databases, we need to create tables manually
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing in-memory database...')
      
      // Create basic tables if they don't exist
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          phone TEXT UNIQUE,
          name TEXT NOT NULL,
          avatar TEXT,
          role TEXT DEFAULT 'SHIPPER',
          status TEXT DEFAULT 'ACTIVE',
          companyId TEXT,
          companyName TEXT,
          businessType TEXT,
          location TEXT,
          address TEXT,
          verification TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          lastLoginAt DATETIME
        )
      `
      
      console.log('In-memory database initialized successfully')
    }
    
    isInitialized = true
  } catch (error) {
    console.error('Database initialization failed:', error)
    // Don't throw, let the app continue with graceful degradation
  }
}
