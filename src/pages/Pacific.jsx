import OptimizedImage from '../components/OptimizedImage';
import PacificLogo from '../components/PacificLogo.jsx';
import { pageContentClassName } from '../styles/styles';

const pacificUrl = "https://pacific.alvarado.dev";
const rulesUrl = `${pacificUrl}/#/rules`;
const sourceUrl = "https://github.com/noah-alvarado/pacific";

const textClassName = "text-lg text-gray-800 dark:text-gray-300";
const linkClassName = "text-blue-600 dark:text-blue-400 underline";
const buttonClassName = `
    px-6 py-3 rounded-lg font-bold text-lg border-2
    transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200
`;

const features = [
    "Local games on one device, with undo, redo, and board rotation",
    "Online games against a friend over a direct peer-to-peer (WebRTC) connection, no account needed",
    "A full transcription of the original Type A and Type B rules, with figures",
    "Light and dark themes, and a layout that fits phones through desktops",
];

function Screenshot({ name, alt, caption, className = '' }) {
    return (
        <figure className={`flex flex-col gap-2 ${className}`}>
            <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-lg">
                <OptimizedImage basePath={`pacific/${name}-light`} alt={alt} className="block dark:hidden" />
                <OptimizedImage basePath={`pacific/${name}-dark`} alt={alt} className="hidden dark:block" />
            </div>
            <figcaption className="text-sm text-center text-gray-600 dark:text-gray-400">{caption}</figcaption>
        </figure>
    );
}

export default function Pacific() {
    return (
        <div className={`${pageContentClassName} px-8 gap-10`}>
            <header className="flex flex-col items-center gap-3 w-full max-w-4xl mt-4">
                <PacificLogo />
                <p className="text-sm sm:text-xl uppercase text-center text-gray-900 dark:text-gray-100 cursor-default">
                    Type A &amp; B - Board Wargame for 2 Players
                </p>
            </header>

            <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href={pacificUrl}
                        className={`${buttonClassName} border-transparent bg-[#89cff0] hover:bg-[#5fb8e6] text-[#1c1724] shadow-md`}
                    >
                        Play PACIFIC
                    </a>
                    <a
                        href={rulesUrl}
                        className={`${buttonClassName} border-current text-gray-900 dark:text-gray-100 hover:bg-gray-500/15`}
                    >
                        Game Rules
                    </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <a href={sourceUrl} className={linkClassName}>Source on GitHub</a>
                    {" · "}Licensed CC BY-NC-SA 4.0
                </p>
            </div>

            <section className="flex flex-col gap-4 max-w-prose">
                <p className={textClassName}>
                    PACIFIC is a non-scale war game for 2 players, played on a board with pieces which
                    represent naval Attack Planes, Aircraft Carriers, and Kamikazes. It was originally
                    created by the Scottish poet and artist Ian Hamilton Finlay. This is a digital
                    adaptation of that game, playable in any web browser.
                </p>

                <blockquote className="border-l-4 border-gray-400 dark:border-gray-500 pl-4 italic text-gray-700 dark:text-gray-400">
                    <p>
                        “One is prepared for surprises in [Finlay’s] work, but not, perhaps, for the advent
                        of PACIFIC... Finlay has previously designed a slate and marble chess set with
                        austerely shaped pieces resembling submarine conning towers, but that was a
                        contemporary invigoration of a traditional game... that was to erect irony upon
                        artifice, that was the traditional mode - with certain differences! - of the poet.
                        It was quite another thing to invite someone to win or lose a game with another
                        player... what had this raiding game to do with the raid on the inarticulate
                        (Eliot?) Poetry may be a superior kind of play, but can play be a superior kind of
                        poetry?”
                    </p>
                    <footer className="mt-2 not-italic text-sm">
                        — Orvell, “Poe and the Poetics of Pacific,” in <cite>Ian Hamilton Finlay Collaborations</cite>, p. 17
                    </footer>
                </blockquote>

                <ul className={`${textClassName} list-disc pl-6 flex flex-col gap-1`}>
                    {features.map((feature) => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </section>

            <section aria-label="Screenshots" className="flex flex-col gap-8 w-full max-w-5xl">
                <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_0.462fr] gap-6 items-start">
                    <Screenshot name="game" alt="A local game of PACIFIC in progress" caption="Local game" />
                    <Screenshot
                        name="mobile"
                        alt="A game of PACIFIC on a phone"
                        caption="On mobile"
                        className="max-w-[240px] w-full mx-auto sm:max-w-none"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Screenshot name="landing" alt="The PACIFIC landing page" caption="Landing page" />
                    <Screenshot name="online" alt="Hosting an online room, waiting for an opponent" caption="Online matchmaking" />
                    <Screenshot name="rules" alt="The PACIFIC rules page" caption="Rules" />
                </div>
            </section>
        </div>
    );
}
