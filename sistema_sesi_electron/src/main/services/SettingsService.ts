import { eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { settings } from '../db/schema'

export class SettingsService {
  static async get(key: string): Promise<string | null> {
    const result = getDb().select().from(settings).where(eq(settings.key, key)).get()
    return result ? result.value : null
  }

  static async set(key: string, value: string): Promise<void> {
    getDb()
      .insert(settings)
      .values({ key, value, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date().toISOString() }
      })
  }

  static async getAll(): Promise<Record<string, string>> {
    const entries = getDb().select().from(settings).all()
    return entries.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value
        return acc
      },
      {} as Record<string, string>
    )
  }
}
