import { useState } from "react";

export default function Cupboard(props) {
    const [showMore, setShowMore] = useState(props.initialShowMore ?? false);

    const { className, source, cutoffIndex, transform } = props;

    return (
        <>
            <div className={className}>
                {source
                    .slice(0, showMore ? source.length : cutoffIndex)
                    .map(transform)}
            </div>
            {source.length > cutoffIndex && (
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="cursor-pointer font-semibold dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-200 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-700/80"
                >
                    {showMore ? "Show Less" : "Show More"}
                </button>
            )}
        </>
    );
}