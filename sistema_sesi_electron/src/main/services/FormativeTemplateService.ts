import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { formativeTemplates } from '../db/schema'
import type { FormativeTemplate } from '../../shared/types'

export class FormativeTemplateService {
  static async getAll(): Promise<FormativeTemplate[]> {
    const result = await getDb().query.formativeTemplates.findMany({
      with: {
        // We might want to fetch the discipline name if needed, but for now raw is fine
        // discipline: true
      }
    })
    return result as FormativeTemplate[]
  }

  static async create(data: typeof formativeTemplates.$inferInsert): Promise<FormativeTemplate> {
    return getDb().insert(formativeTemplates).values(data).returning().get() as FormativeTemplate
  }

  static async update(
    id: string,
    data: Partial<typeof formativeTemplates.$inferInsert>
  ): Promise<void> {
    getDb().update(formativeTemplates).set(data).where(eq(formativeTemplates.id, id)).run()
  }

  static async delete(id: string): Promise<void> {
    getDb().delete(formativeTemplates).where(eq(formativeTemplates.id, id)).run()
  }
}
