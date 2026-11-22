import type {ReactNode} from "react";
import {type StickyTone, TONES} from "../../../types/feedback/sticky-note";


type Props = {
    tone: StickyTone;
    tilt?: number;
    children: ReactNode;
};

export function StickyNote({tone, tilt = 0, children}: Props) {
    return (
        <div
            className={`${TONES[tone]} rounded-xl p-3.5 text-sm leading-snug text-[#14162B] shadow-[0_6px_14px_rgba(20,22,43,0.10)]`}
            style={{transform: `rotate(${tilt}deg)`}}
        >
            {children}
        </div>
    );
}