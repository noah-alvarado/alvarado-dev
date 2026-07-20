import './styles/App.css';

import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import { routes } from './routes.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<div className="flex-1" />}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
