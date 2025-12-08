export const appConfig = {
  // Window Configuration
  window: {
    width: 1200, // Default width if not maximized
    height: 800, // Default height if not maximized
    minWidth: 1024,
    minHeight: 700,
    title: 'Sistema SESI',
    startMaximized: false, // User preference: Start restored, then maximize on unlock
    autoHideMenuBar: true // Hide the default menu bar
  },

  // Development Settings
  development: {
    openDevTools: false // Set to true to open DevTools on start
  },

  // Database Configuration
  database: {
    filename: 'sistema_sesi.db',
    journalMode: 'WAL' // Write-Ahead Logging for performance
  }
} as const
