import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
