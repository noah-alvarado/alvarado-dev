import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';
import Jude from './pages/Jude.jsx';
import Pacific from './pages/Pacific.jsx';
import VisuallyLayeredNotes from './pages/VisuallyLayeredNotes.jsx';

export const routes = [
  { path: '/', element: <Landing />, label: 'Home' },
  { path: '/noah', element: <Noah />, label: 'Noah' },
  { path: '/jude', element: <Jude />, label: 'Jude' },
  { path: '/pacific', element: <Pacific />, label: 'Pacific' },
  { path: '/visually-layered-notes', element: <VisuallyLayeredNotes />, hideInNav: true },
  { path: '/visually-layered-notes/:compositeId', element: <VisuallyLayeredNotes />, hideInNav: true },
];