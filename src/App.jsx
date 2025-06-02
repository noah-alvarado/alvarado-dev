import './styles/App.css';

import { Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';

const routes = [
  { path: '/', element: <Landing /> },
  { path: '/noah', element: <Noah /> },
];

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default App
