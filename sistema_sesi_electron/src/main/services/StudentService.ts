import { type InferSelectModel } from 'drizzle-orm'
import { getDb } from '../db/client'
import { students } from '../db/schema'

export type Student = InferSelectModel<typeof students>

export class StudentService {
  static async getAll(): Promise<Student[]> {
    // Example service method
    // In a real app, this would use a Repository pattern or direct DB access
    return getDb().select().from(students).all()
  }

  static async create(data: typeof students.$inferInsert): Promise<Student> {
    return getDb().insert(students).values(data).returning().get()
  }
}
