import { NextRequest, NextResponse } from 'next/server'

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

    // Temporary: Return success without database operations
    // This allows the app to function while database is being set up
    const mockUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role,
      companyName: companyName || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Account created successfully (demo mode - database setup in progress)'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
