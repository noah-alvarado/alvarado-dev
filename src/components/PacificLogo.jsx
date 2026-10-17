import copyright from './pacific-logo/copyright.png';
import logo from './pacific-logo/logo.png';
import plane from './pacific-logo/plane.png';
import ship from './pacific-logo/ship.png';

// Crops share a height, so widths proportional to their pixel widths keep them aligned.
export function PacificWordmark({ className = '' }) {
    return (
        <span className={`flex items-start ${className}`}>
            <img src={logo} alt="PACIFIC" className="w-[96.97%] h-auto" />
            <img src={copyright} alt="" className="w-[3.03%] h-auto dark:invert" />
        </span>
    );
}

// Ship | wordmark | plane, sized relative to each other as on the original rules sheet.
export default function PacificLogo() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[53fr_100fr_44fr] items-center gap-6 w-full">
            <img src={ship} alt="" className="hidden sm:block w-full h-auto dark:invert" />
            <h1 className="m-0">
                <PacificWordmark />
            </h1>
            <img src={plane} alt="" className="hidden sm:block w-full h-auto dark:invert" />
        </div>
    );
}
