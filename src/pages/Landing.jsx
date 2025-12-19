import TitleCard from '../components/TitleCard.jsx';
import { pageContentClassName } from '../styles/styles.js';

export default function Landing() {
    return (
        <div
            className={`
                ${pageContentClassName}
                justify-center
                gap-8
                bg-[#fdf6e3] dark:bg-gray-900
            `}
        >
            <div className="flex flex-wrap items-center justify-center gap-6">
                <TitleCard
                    href="/noah"
                    ariaLabel="Go to Noah's site"
                    target="_self"
                    image="noah/biking-headshot"
                    imageAlt="Noah"
                    title="Noah"
                    subtitle="Sioux Falls, SD"
                />
                <TitleCard
                    href="/pacific"
                    ariaLabel="Go to the PACIFIC site"
                    target="_self"
                    image="pacific/spread"
                    imageAlt="PACIFIC Board Game"
                    title="PACIFIC"
                    subtitle="Digital Board Game Adaptation"
                />
            </div>
        </div>
    );
}
