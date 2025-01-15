import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SongProvider } from './context/SongContext';
import Admin from './pages/Admin';
import Index from './pages/Index';

function App() {
  return (
    <SongProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </SongProvider>
  );
}

export default App;