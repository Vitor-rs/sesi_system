import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { classes, students } from '../db/schema'
import type { Class } from '../../shared/types'

export class ClassService {
  static async getAll(): Promise<Class[]> {
    return getDb().select().from(classes).all() as unknown as Class[]
  }

  static async create(data: typeof classes.$inferInsert): Promise<Class> {
    return getDb().insert(classes).values(data).returning().get() as unknown as Class
  }

  static async update(id: string, data: Partial<typeof classes.$inferInsert>): Promise<void> {
    await getDb().update(classes).set(data).where(eq(classes.id, id))
  }

  static async delete(id: string): Promise<void> {
    const linkedStudents = await getDb().select().from(students).where(eq(students.classId, id))
    if (linkedStudents.length > 0) {
      throw new Error('Cannot delete class with linked students.')
    }
    await getDb().delete(classes).where(eq(classes.id, id))
  }
}
