import { Link } from 'react-router-dom';
import { pageContentClassName } from '../styles/styles.js';

export default function Jude() {
  return (
    <div className={pageContentClassName}>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Jude Alvarado</h1>
        <p className="text-gray-800 dark:text-gray-300">This is Jude's page.</p>
        <Link
          to="/visually-layered-notes"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
        >
          Open Visually Layered Notes →
        </Link>
      </main>
    </div>
  );
}
