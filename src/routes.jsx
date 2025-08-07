import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';
import Pacific from './pages/Pacific.jsx';

export const routes = [
  { path: '/', element: <Landing />, label: 'Home' },
  { path: '/noah', element: <Noah />, label: 'Noah' },
  // { path: '/pacific', element: <Pacific />, label: 'Pacific' },
];