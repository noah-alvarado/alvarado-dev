import { lazy } from 'react';
import Landing from './pages/Landing.jsx';
import Noah from './pages/Noah.jsx';
import Jude from './pages/Jude.jsx';
import Pacific from './pages/Pacific.jsx';
import VisuallyLayeredNotes from './pages/VisuallyLayeredNotes.jsx';

const baseRoutes = [
  { path: '/', element: <Landing />, label: 'Home' },
  { path: '/noah', element: <Noah />, label: 'Noah' },
  { path: '/jude', element: <Jude />, label: 'Jude' },
  { path: '/pacific', element: <Pacific />, label: 'Pacific' },
  { path: '/visually-layered-notes', element: <VisuallyLayeredNotes />, hideInNav: true },
  { path: '/visually-layered-notes/:compositeId', element: <VisuallyLayeredNotes />, hideInNav: true },
];

// The authoring UI is a local dev tool. Gating both the lazy import and the
// route on import.meta.env.DEV lets the production build drop it entirely — the
// static route wins over :compositeId thanks to React Router's ranking.
const devRoutes = [];
if (import.meta.env.DEV) {
  const VisuallyLayeredNotesAuthor = lazy(() => import('./pages/VisuallyLayeredNotesAuthor.jsx'));
  devRoutes.push({
    path: '/visually-layered-notes/author',
    element: <VisuallyLayeredNotesAuthor />,
    hideInNav: true,
  });
}

export const routes = [...baseRoutes, ...devRoutes];