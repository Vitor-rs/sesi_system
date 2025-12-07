# Sistema SESI - Electron Version

This is the desktop application version of the Sesi System, built with **Electron**, **React**, **TypeScript**, and **Vite**.

## Architecture & Best Practices

We follow a strict **Main Process Backend / Renderer Frontend** architecture to ensure security and performance.

### 1. Security (Isolation)

- **Renderer Process ("Frontend")**: Cannot access the database or Node.js APIs directly. It is sandboxed.
- **Main Process ("Backend")**: Manages the SQLite database, file system, and native resources.
- **Communication**: Done strictly via **Context Bridge** and **IPC** (Inter-Process Communication). The renderer invokes valid channels (e.g., `students:getAll`), and the Main process responds.

### 2. Performance

- **Lazy Loading**: Database connections are initialized only when needed, ensuring fast app startup.
- **Native Modules**: We use `better-sqlite3` for high-performance synchronous DB access in the Main thread (safe due to local nature).
- **Vite**: Used for instant HMR in development and optimized builds in production.

## Technology Stack

- **Runtime**: Electron 35 (LTS)
- **Frontend**: React 19, TypeScript, TailwindCSS
- **Database**: Better-SQLite3
- **ORM**: Drizzle ORM (Type-safe SQL)
- **Validation**: Zod
- **State**: Zustand

## Setup & Development

### Prerequisites

- Node.js 20+
- Visual Studio Build Tools (Windows) - required for `better-sqlite3` native compilation.

### Installation

```bash
npm install
# This will automatically run 'electron-builder install-app-deps' to compile native modules.
```

### Running Locally

```bash
npm run dev
```

> **Note**: If you encounter `TypeError` crashes, ensure your `ELECTRON_RUN_AS_NODE` environment variable is **not** set.

### Type Check & Lint

```bash
npm run typecheck
npm run lint
```

## Configuration

Core application defaults are managed in **`src/main/config.ts`**. This allows you to change behavior without hunting through logic code.

Key settings available:

- **`window`**: Startup dimensions, maximize behavior, and title.
- **`development`**: Toggle `openDevTools` to automatically show console on start.
- **`database`**: Filename and settings.

Example `config.ts`:

```typescript
export const appConfig = {
  window: {
    startMaximized: true, // App will launch full screen
    autoHideMenuBar: true,
  },
  development: {
    openDevTools: false,
  }
}
```

## Project Structure

```
├── drizzle/                # SQL Migration files
├── resources/              # Icons and static assets (Electron)
├── src/
│   ├── main/               # ELECTRON MAIN PROCESS (Backend)
│   │   ├── config.ts       # Central Configuration
│   │   ├── index.ts        # App Entry Point & Window Creation
│   │   ├── db/             # Database Client & Schema
│   │   ├── ipc/            # IPC Handlers (Routes)
│   │   └── services/       # Business Logic (Controllers)
│   ├── preload/            # Context Bridge (Security Layer)
│   └── renderer/           # REACT APP (Frontend)
│       ├── src/            # Components, Hooks, Views
│       └── index.html      # Entry HTML with CSP
└── electron.vite.config.ts # Bundler Config
```

## Building for Production

```bash
npm run build:win
```

Output will be in `dist/` or `release/` folders depending on configuration.
