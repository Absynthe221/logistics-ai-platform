const isProduction = process.env.NODE_ENV === 'production'

export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || (isProduction ? 'https://logisticsai.netlify.app' : 'http://localhost:3001'),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || (isProduction ? 'your-production-secret-key-change-this' : 'dev-secret'),
  // Use in-memory SQLite for production if no DATABASE_URL is provided
  DATABASE_URL: process.env.DATABASE_URL || (isProduction ? 'file:./tmp/prod.db' : 'file:../../packages/database/dev.db')
}

// Log environment status in production for debugging
if (isProduction) {
  console.log('Production env check:', {
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlType: process.env.DATABASE_URL ? 'provided' : 'missing'
  })
}
