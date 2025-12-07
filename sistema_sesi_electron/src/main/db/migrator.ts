import { app } from 'electron'
import { join } from 'path'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { getDb } from './client'

export function runMigrations(): void {
  const db = getDb()

  // In dev: root/drizzle
  // In prod: resources/drizzle (need to configure electron-builder)
  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, 'drizzle')
    : join(app.getAppPath(), 'drizzle')

  console.log(`[Migrations] Running migrations from: ${migrationsFolder}`)

  try {
    migrate(db, { migrationsFolder })
    console.log('[Migrations] Success.')
  } catch (error) {
    console.error('[Migrations] Failed:', error)
    // Don't crash app, but log error.
  }
}
