import { useContext } from 'react';
import VisuallyLayeredNotesContext from './VisuallyLayeredNotesContext.js';

export default function useVisuallyLayeredNotes() {
    const context = useContext(VisuallyLayeredNotesContext);
    if (!context) {
        throw new Error('useVisuallyLayeredNotes must be used within a VisuallyLayeredNotes provider');
    }
    return context;
}
