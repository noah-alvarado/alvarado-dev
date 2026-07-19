import { createContext } from 'react';

// Provides { manifest, state, dispatch } to the Visually Layered Notes component tree.
const VisuallyLayeredNotesContext = createContext(null);

export default VisuallyLayeredNotesContext;
