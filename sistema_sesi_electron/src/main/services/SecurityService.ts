import { hashSync, compareSync, genSaltSync } from 'bcryptjs'
import { randomBytes } from 'node:crypto'
import { SettingsService } from './SettingsService'

export interface SecurityStatus {
  isEnabled: boolean
  hasRecoveryKit: boolean
  autoLockTimeout: number // in minutes, 0 = disabled
}

export class SecurityService {
  private static readonly SALT_ROUNDS = 10

  /**
   * Sets a new master password for the vault.
   * Enables security if not already enabled.
   */
  static async setPassword(password: string): Promise<void> {
    const salt = genSaltSync(this.SALT_ROUNDS)
    const hash = hashSync(password, salt)

    await SettingsService.set('security.enabled', 'true')
    await SettingsService.set('security.password_hash', hash)
    // Invalidate previous recovery kit if any, forcing user to generate a new one?
    // Or keep it valid? Standard practice: changing pass might require new kit.
    // For simplicity now, we keep the existing kit if valid, or let user regenerating it.
  }

  /**
   * Verifies the provided password against the stored hash.
   */
  static async verifyPassword(password: string): Promise<boolean> {
    const hash = await SettingsService.get('security.password_hash')
    if (!hash) return false
    return compareSync(password, hash)
  }

  /**
   * Disables security mode (removes password requirement).
   * Requires confirming current password first (frontend responsibility).
   */
  static async disableSecurity(): Promise<void> {
    await SettingsService.set('security.enabled', 'false')
    await SettingsService.set('security.password_hash', '')
  }

  /**
   * Generates a secure recovery code, hashes it for storage,
   * and returns the plain text code for the user to save.
   */
  static async generateRecoveryKit(): Promise<string> {
    // Generate a secure random code format: XXXX-XXXX-XXXX
    const buffer = randomBytes(9) // 9 bytes = 18 hex chars approx
    // Let's make it readable: 3 groups of 4 chars
    // We can use a custom alphanumeric set or just hex.
    // Hex is easy:
    const raw = buffer.toString('hex').toUpperCase()
    const code = `${raw.substring(0, 4)}-${raw.substring(4, 8)}-${raw.substring(8, 12)}`

    const salt = genSaltSync(this.SALT_ROUNDS)
    const hash = hashSync(code, salt)

    await SettingsService.set('security.recovery_hash', hash)
    return code
  }

  /**
   * Verifies a recovery code.
   */
  static async verifyRecoveryCode(code: string): Promise<boolean> {
    const hash = await SettingsService.get('security.recovery_hash')
    if (!hash) return false

    // Normalize code input (trim, uppercase)
    const normalized = code.trim().toUpperCase()
    return compareSync(normalized, hash)
  }

  /**
   * Updates auto-lock preferences
   */
  static async setAutoLock(timeoutMinutes: number): Promise<void> {
    await SettingsService.set('security.auto_lock_timeout', timeoutMinutes.toString())
  }

  /**
   * Gets current security status for UI
   */
  static async getStatus(): Promise<SecurityStatus> {
    const enabled = await SettingsService.get('security.enabled')
    const recoveryHash = await SettingsService.get('security.recovery_hash')
    const timeout = await SettingsService.get('security.auto_lock_timeout')

    return {
      isEnabled: enabled === 'true',
      hasRecoveryKit: !!recoveryHash,
      autoLockTimeout: timeout ? Number.parseInt(timeout, 10) : 0
    }
  }
}
