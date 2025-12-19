import OptimizedImage from '../components/OptimizedImage';
import { pageContentClassName } from '../styles/styles';

const pacificUrl = "https://noah-alvarado.github.io/pacific/";

const screenshotPaths = [
    "pacific/ss1",
    "pacific/ss2",
    "pacific/ss3",
];

export default function Pacific() {
    return (
        <div className={`${pageContentClassName} px-8 gap-6`}>
            <h1 className="text-3xl font-bold my-2 text-gray-900 dark:text-gray-100 cursor-default text-center">
                PACIFIC
            </h1>

            <p className="text-lg text-gray-800 dark:text-gray-300">
                Play PACIFIC online here: <a href={pacificUrl} className="text-blue-600 dark:text-blue-400 underline">{pacificUrl}</a>
            </p>

            <p className="text-lg text-gray-800 dark:text-gray-300 max-w-prose">
                PACIFIC is a 2-player board game originally created by the Scottish artist Ian Hamilton Finlay.
                This is a digital adaptation of the game, allowing local and online play in a web browser.
            </p>

            <div className="flex gap-4">
                {screenshotPaths.map((path, index) => (
                    <OptimizedImage
                        key={index}
                        basePath={path}
                        alt="Screenshot of the PACIFIC board game"
                    />
                ))}
            </div>
        </div>
    );
}