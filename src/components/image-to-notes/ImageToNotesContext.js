import { createContext } from 'react';

// Provides { manifest, state, dispatch } to the Image-to-Notes component tree.
const ImageToNotesContext = createContext(null);

export default ImageToNotesContext;
