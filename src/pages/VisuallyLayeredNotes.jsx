import { useParams } from 'react-router-dom';
import { pageContentClassName } from '../styles/styles.js';
import useComposite, {
    useComposites,
    DEFAULT_COMPOSITE_ID,
} from '../components/visually-layered-notes/useComposite.js';
import Viewer from '../components/visually-layered-notes/Viewer.jsx';

export default function VisuallyLayeredNotes() {
    const { compositeId = DEFAULT_COMPOSITE_ID } = useParams();
    const { status, manifest } = useComposite(compositeId);
    const { composites } = useComposites();

    if (status === 'loading') {
        return (
            <div className={pageContentClassName}>
                <p className="text-gray-600 dark:text-gray-300">Loading…</p>
            </div>
        );
    }

    if (status === 'error' || !manifest) {
        return (
            <div className={pageContentClassName}>
                <p className="text-red-600 dark:text-red-400">Couldn’t load this composite.</p>
            </div>
        );
    }

    return (
        <Viewer
            key={manifest.id}
            manifest={manifest}
            compositeId={compositeId}
            composites={composites}
            showAuthorLink={import.meta.env.DEV}
        />
    );
}
