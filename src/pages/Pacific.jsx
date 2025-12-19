import { pageContentClassName } from '../styles/styles';

export default function Pacific() {
    return (
        <div className={`${pageContentClassName} px-8`}>
            <h1 className="text-3xl font-bold my-2 text-gray-900 dark:text-gray-100 cursor-default text-center">
                PACIFIC
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300">
                PACIFIC is a 2-player board game originally created by the Scottish artist Ian Hamilton Finlay.
                This is a digital adaptation of the game, allowing local and online play in a web browser.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300">
                SCREENSHOTS HERE
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300">
                LINK TO GAME HERE
            </p>
        </div>
    );
}