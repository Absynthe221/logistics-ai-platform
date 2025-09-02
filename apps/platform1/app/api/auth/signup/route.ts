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

    // For now, return success without database operations
    // This allows the app to function while we debug database issues
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
      message: 'Account created successfully (demo mode)'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
