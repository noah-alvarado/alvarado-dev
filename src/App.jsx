import './App.css';

import { Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/noah" element={<Noah />} />
      </Routes>
    </>
  )
}4

export default App
