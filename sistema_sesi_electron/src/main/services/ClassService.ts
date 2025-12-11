import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { classes, students } from '../db/schema'
import type { Class } from '../../shared/types'

export class ClassService {
  static async getAll(): Promise<Class[]> {
    const result = await getDb().select().from(classes)

    return result.map((c) => {
      const lastSpace = c.name.lastIndexOf(' ')
      const grade = lastSpace === -1 ? c.name : c.name.substring(0, lastSpace)
      const letter = lastSpace === -1 ? '' : c.name.substring(lastSpace + 1)

      return {
        ...c,
        grade,
        letter
      }
    })
  }

  static async create(data: typeof classes.$inferInsert): Promise<Class> {
    return getDb().insert(classes).values(data).returning().get() as unknown as Class
  }

  static async update(id: string, data: Partial<typeof classes.$inferInsert>): Promise<void> {
    getDb().update(classes).set(data).where(eq(classes.id, id)).run()
  }

  static async delete(id: string): Promise<void> {
    const linkedStudents = await getDb().select().from(students).where(eq(students.classId, id))
    if (linkedStudents.length > 0) {
      throw new Error('Cannot delete class with linked students.')
    }
    getDb().delete(classes).where(eq(classes.id, id)).run()
  }
}
