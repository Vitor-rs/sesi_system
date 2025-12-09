import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { disciplines } from '../db/schema'
import type { Discipline } from '../../shared/types'

export class DisciplineService {
  static async getAll(): Promise<Discipline[]> {
    const result = await getDb().select().from(disciplines)
    return result as Discipline[]
  }

  static async create(data: typeof disciplines.$inferInsert): Promise<Discipline> {
    return getDb().insert(disciplines).values(data).returning().get() as Discipline
  }

  static async update(id: string, data: Partial<typeof disciplines.$inferInsert>): Promise<void> {
    getDb().update(disciplines).set(data).where(eq(disciplines.id, id)).run()
  }

  static async delete(id: string): Promise<void> {
    // Validates before creatingn keys before delete (classDisciplines)
    // For now, let sqlite cascade handle it or fail if restricted
    getDb().delete(disciplines).where(eq(disciplines.id, id)).run()
  }
}
