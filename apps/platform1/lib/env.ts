export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-in-production',
  DATABASE_URL: process.env.DATABASE_URL || 'file:/Users/som/logistics-ai-platform/packages/database/dev.db'
}
