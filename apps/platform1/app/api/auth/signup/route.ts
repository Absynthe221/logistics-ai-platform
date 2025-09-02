import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { ensureDatabaseInitialized } from '@/lib/db-init'
import { mockDb } from '@/lib/mock-db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, role, companyName } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try Prisma first, fallback to mock database
    let user
    try {
      await ensureDatabaseInitialized()
      const prisma = getPrisma()

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role,
          status: 'ACTIVE',
          companyName: companyName || null
        }
      })
    } catch (prismaError) {
      console.log('Prisma failed, using mock database:', prismaError)
      
      // Check if user already exists in mock DB
      const existingUser = await mockDb.findUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user in mock DB
      user = await mockDb.createUser({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        companyName: companyName || null
      })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Account created successfully'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
