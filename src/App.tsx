import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import { UnderConstruction } from './components/ui/under-construction'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/linkedin" element={<UnderConstruction />} />
        <Route path="/privacy" element={<UnderConstruction />} />
        <Route path="/terms" element={<UnderConstruction />} />
        <Route path="/cookies" element={<UnderConstruction />} />
      </Routes>
    </Router>
  )
}

export default App
