import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getPrisma } from '@/lib/prisma'
import { ensureDatabaseInitialized } from '@/lib/db-init'
import { mockDb } from '@/lib/mock-db'
import bcrypt from 'bcryptjs'



const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // Needed behind proxies/CDNs (e.g., Netlify) so NextAuth trusts the host header
  trustHost: true,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth warn:', code)
    },
    debug(code, metadata) {
      console.debug('NextAuth debug:', code, metadata)
    }
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          let user
          try {
            await ensureDatabaseInitialized()
            const prisma = getPrisma()
            user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })
          } catch (prismaError) {
            console.log('Prisma failed, using mock database for auth:', prismaError)
            user = await mockDb.findUserByEmail(credentials.email)
          }

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.companyId = token.companyId
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },

})

export { handler as GET, handler as POST }
