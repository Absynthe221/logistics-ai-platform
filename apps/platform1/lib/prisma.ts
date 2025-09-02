import { PrismaClient } from '@prisma/client'
import { env } from './env'

let prismaInstance: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (prismaInstance) return prismaInstance
  
  // Log database connection attempt in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Prisma connection attempt:', {
      hasDatabaseUrl: !!env.DATABASE_URL,
      urlPrefix: env.DATABASE_URL ? env.DATABASE_URL.substring(0, 20) + '...' : 'none'
    })
  }
  
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    }
  })
  return prismaInstance
}
