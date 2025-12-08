import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
import { join } from 'node:path'
import * as schema from './schema'

export type DbType = BetterSQLite3Database<typeof schema>

let dbInstance: DbType | null = null

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
