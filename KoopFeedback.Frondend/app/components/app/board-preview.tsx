import {StickyNote} from "~/components/custom/stick-note";
import {useTranslation} from "~/context/translation";
import type {Column} from "../../../types/translations";


export function BoardPreview() {
    const {translations} = useTranslation();

    const COLUMNS: Column[] = translations?.mainPage.columns ?? []
    return (
        <div
            aria-hidden="true"
            className="grid max-w-xl grid-cols-3 gap-4 rounded-3xl border border-[#E2E6F2] bg-white p-5"
        >
            {COLUMNS.map((column) => (
                <div key={column.title} className="flex flex-col gap-3">
                    <div className={`text-xs font-bold uppercase tracking-widest ${column.labelClass}`}>
                        {column.title}
                    </div>
                    {column.notes.map((note) => (
                        <StickyNote key={note.text} tone={column.tone} tilt={note.tilt}>
                            {note.text}
                        </StickyNote>
                    ))}
                </div>
            ))}
        </div>
    );
}