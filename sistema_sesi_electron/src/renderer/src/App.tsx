import React from 'react'
import { Button } from '@/components/ui/button'

import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
      <img alt="logo" className="h-24 w-24" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>

      <Button onClick={ipcHandle}>Send IPC Ping</Button>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </Button>
      </div>

      <Versions />
    </div>
  )
}

export default App
