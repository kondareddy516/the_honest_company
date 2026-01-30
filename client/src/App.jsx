import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div className="App">
       <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>} />
       </Routes>
    </div>
  )
}

export default App
