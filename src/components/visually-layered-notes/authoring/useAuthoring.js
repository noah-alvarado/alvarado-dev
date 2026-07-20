import { useContext } from 'react';
import AuthoringContext from './AuthoringContext.js';

export default function useAuthoring() {
    const context = useContext(AuthoringContext);
    if (!context) {
        throw new Error('useAuthoring must be used within an Authoring provider');
    }
    return context;
}
