import { useContext } from 'react';
import ImageToNotesContext from './ImageToNotesContext.js';

export default function useImageToNotes() {
    const context = useContext(ImageToNotesContext);
    if (!context) {
        throw new Error('useImageToNotes must be used within an ImageToNotes provider');
    }
    return context;
}
