// Mock database for production when Prisma fails
interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  role: string
  companyName?: string
  createdAt: Date
}

class MockDatabase {
  private users: User[] = []
  private nextId = 1

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: `user_${this.nextId++}`,
      ...data,
      createdAt: new Date()
    }
    this.users.push(user)
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users]
  }
}

export const mockDb = new MockDatabase()
