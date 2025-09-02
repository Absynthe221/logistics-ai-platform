const isProduction = process.env.NODE_ENV === 'production'

export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || (isProduction ? '' : 'http://localhost:3001'),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || (isProduction ? '' : 'dev-secret'),
  // In production, DATABASE_URL must be provided by environment variables (e.g., Netlify settings)
  DATABASE_URL: process.env.DATABASE_URL || (isProduction ? '' : 'file:../../packages/database/dev.db')
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
