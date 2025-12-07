import { app } from 'electron'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export type BackupProvider = 'onedrive' | 'googledrive' | 'local'

export interface BackupLocation {
  provider: BackupProvider
  path: string
  isAvailable: boolean
}

export class BackupService {
  private static getLocalBackupPath(): string {
    // Defines a hidden system folder within the user's AppData level (no admin required)
    // On Windows: C:\Users\<User>\AppData\Roaming\sistema_sesi_electron\Backups
    return join(app.getPath('userData'), 'Backups')
  }

  static async detectProviders(): Promise<BackupLocation[]> {
    const providers: BackupLocation[] = []
    const home = homedir()

    // 1. Detect OneDrive
    // Windows env var is usually reliable
    const oneDrivePath = process.env.OneDrive || join(home, 'OneDrive')
    if (existsSync(oneDrivePath)) {
      providers.push({
        provider: 'onedrive',
        path: join(oneDrivePath, 'SesiSystem_Backups'),
        isAvailable: true
      })
    }

    // 2. Detect Google Drive (and other mounted cloud drives)
    // iterate from G: to Z: to find potential Google Drive mounts
    const driveLetters = 'GHIJKLMNOPQRSTUVWXYZ'.split('')
    const potentialRoots = [
      ...driveLetters.map((l) => `${l}:\\`),
      join(home, 'Google Drive') // Legacy sync folder
    ]

    for (const root of potentialRoots) {
      if (existsSync(root)) {
        // Refined Logic:
        let validPath: string | null = null

        // Priority 1: Portuguese Subfolder
        if (existsSync(join(root, 'Meu Drive'))) {
          validPath = join(root, 'Meu Drive')
        }
        // Priority 2: English Subfolder
        else if (existsSync(join(root, 'My Drive'))) {
          validPath = join(root, 'My Drive')
        }
        // Priority 3: Root itself (if it looks like a drive, e.g. G:\)
        else if (root.length <= 4 && existsSync(root)) {
          validPath = root
        }

        if (validPath) {
          providers.push({
            provider: 'googledrive',
            path: join(validPath, 'SesiSystem_Backups'),
            isAvailable: true
          })
          // We do NOT break here anymore, because the user might have multiple drives (G, H, I)
          // We capture all of them. The UI/Backup logic will pick the first one or we can handle multiple.
          // For now, collecting them in the array is safer.
        }
      }
    }

    // 3. Local (Always available)
    providers.push({
      provider: 'local',
      path: this.getLocalBackupPath(),
      isAvailable: true
    })

    return providers
  }

  static async performBackup(customPath?: string): Promise<{ success: boolean; paths: string[] }> {
    try {
      const dbPath = join(app.getPath('userData'), 'sistema_sesi.db')
      if (!existsSync(dbPath)) {
        throw new Error('Database file not found')
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `backup-${timestamp}.db`
      const savedPaths: string[] = []

      // Determine destinations
      // Strategy: RAID-1 Style (Redundancy)
      // Always save to Local Documents (Safe default) AND Cloud/Custom if available
      const destinations = new Set<string>()

      // 1. Always add Local Documents
      destinations.add(this.getLocalBackupPath())

      // 2. Add Custom Path or Cloud if detected
      if (customPath) {
        destinations.add(customPath)
      } else {
        const providers = await this.detectProviders()
        const cloud = providers.find((p) => p.provider !== 'local' && p.isAvailable)
        if (cloud) {
          destinations.add(cloud.path)
        }
      }

      // Execute Copy
      for (const destDir of destinations) {
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true })
        }
        const destPath = join(destDir, fileName)
        copyFileSync(dbPath, destPath)
        savedPaths.push(destPath)
      }

      return { success: true, paths: savedPaths }
    } catch (error) {
      console.error('Backup failed:', error)
      throw error
    }
  }

  static getBackupsList(): Array<{ name: string; date: Date; path: string }> {
    // List backups from local document folder as primary source of truth
    const dir = this.getLocalBackupPath()
    if (!existsSync(dir)) return []

    return (
      readdirSync(dir)
        .filter((f) => f.endsWith('.db') && f.startsWith('backup-'))
        .map((f) => ({
          name: f,
          path: join(dir, f),
          date: new Date(
            f
              .replace('backup-', '')
              .replace('.db', '')
              .replace(/-/g, ':')
              .replace(/:(\d+)-(\d+)-(\d+)-LZ$/, '')
          ) // Rough parse, file stats is better
        }))
        // Better: use fs.statSync logic if precise date needed, but filename sort is usually enough
        .sort((a, b) => b.name.localeCompare(a.name))
    )
  }
}
