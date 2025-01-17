import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Admin from './pages/Admin';
import Index from './pages/Index';

function App() {
  return (
    <DataProvider>
      <Router basename="/jeanne-d-arc">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;