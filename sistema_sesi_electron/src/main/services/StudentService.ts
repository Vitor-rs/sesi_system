import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { students, studentHistory } from '../db/schema'
import type { Student } from '../../shared/types'

export class StudentService {
  static async getAll(): Promise<Student[]> {
    const db = getDb()
    const result = await db.query.students.findMany({
      orderBy: (students, { asc }) => [asc(students.name)]
    })

    // Cast result to match Shared Student interface
    return result as unknown as Student[]
  }

  static async getById(id: string): Promise<Student | undefined> {
    const db = getDb()
    const result = await db.query.students.findFirst({
      where: eq(students.id, id),
      with: {
        history: true
      }
    })
    return result as unknown as Student | undefined
  }

  static async create(data: typeof students.$inferInsert): Promise<Student> {
    const res = await getDb().insert(students).values(data).returning().get()
    return { ...res, history: [] } as unknown as Student
  }

  static async update(id: string, data: Partial<typeof students.$inferInsert>): Promise<void> {
    await getDb().update(students).set(data).where(eq(students.id, id))
  }

  static async delete(id: string): Promise<void> {
    await getDb().delete(students).where(eq(students.id, id))
  }

  static async addHistory(data: typeof studentHistory.$inferInsert): Promise<void> {
    await getDb().insert(studentHistory).values(data)
  }
}
