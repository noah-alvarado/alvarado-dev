import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';
import Jude from './pages/Jude.jsx';
import Pacific from './pages/Pacific.jsx';
import ImageToNotes from './pages/ImageToNotes.jsx';

export const routes = [
  { path: '/', element: <Landing />, label: 'Home' },
  { path: '/noah', element: <Noah />, label: 'Noah' },
  { path: '/jude', element: <Jude />, label: 'Jude' },
  { path: '/pacific', element: <Pacific />, label: 'Pacific' },
  { path: '/image-to-notes', element: <ImageToNotes />, hideInNav: true },
  { path: '/image-to-notes/:compositeId', element: <ImageToNotes />, hideInNav: true },
];