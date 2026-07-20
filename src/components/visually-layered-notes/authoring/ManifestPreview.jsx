import { cardClass, sectionTitleClass } from './authoringStyles.js';

// Read-only view of the manifest that will be written, plus validation output.
// Errors block saving; warnings (tag mismatches, missing assets) are advisory.
export default function ManifestPreview({ validation, assetWarnings = [], manifest }) {
    const output = validation.normalized ?? manifest;
    const warnings = [...validation.warnings, ...assetWarnings];

    return (
        <section className={cardClass}>
            <div className="mb-2 flex items-center justify-between">
                <h2 className={sectionTitleClass}>Manifest</h2>
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${validation.valid
                        ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-600/10 text-red-700 dark:text-red-300'
                        }`}
                >
                    {validation.valid ? 'valid' : 'invalid'}
                </span>
            </div>

            {validation.errors.length > 0 && (
                <ul className="mb-2 list-disc space-y-1 pl-5 text-xs text-red-600 dark:text-red-400">
                    {validation.errors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            )}

            {warnings.length > 0 && (
                <ul className="mb-2 list-disc space-y-1 pl-5 text-xs text-amber-600 dark:text-amber-400">
                    {warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                    ))}
                </ul>
            )}

            <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-3 text-xs leading-relaxed text-gray-100">
                {JSON.stringify(output, null, 2)}
            </pre>
        </section>
    );
}
