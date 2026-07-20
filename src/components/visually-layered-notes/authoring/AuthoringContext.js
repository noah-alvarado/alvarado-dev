import { createContext } from 'react';

// Provides { state, dispatch } for the authoring UI's draft-manifest reducer.
const AuthoringContext = createContext(null);

export default AuthoringContext;
