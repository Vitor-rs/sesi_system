import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import * as schema from './schema'

let dbInstance: ReturnType<typeof drizzle> | null = null

export function initDb(): DbType | null {
  if (dbInstance) return dbInstance

  const dbPath = join(app.getPath('userData'), 'sistema_sesi.db')
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')

  dbInstance = drizzle(sqlite, { schema })
  return dbInstance
}

export function getDb(): DbType {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return dbInstance
}

export type DbType = ReturnType<typeof drizzle>
