import './App.css';

import { Route, Routes } from 'react-router-dom';

import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/noah" element={<Noah />} />
    </Routes>
  )
}

export default App
