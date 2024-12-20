interface NumberWeekProps {
    activeWeek: number;
    onWeekClick: (week: number, year: number) => void;
    activeYear: number;
    onYearChange: (year: number) => void;
    weekHasEvents: (weekNumber: number) => boolean; // Nouvelle prop pour savoir si la semaine a des événements
}

export default function NumberWeek({ activeWeek, activeYear, onWeekClick, onYearChange, weekHasEvents }: NumberWeekProps) {
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(event.target.value, 10);
        onYearChange(newYear); // Informe le parent du changement d'année
    };

    return (
        <div className="bg-gray-200 p-3 col-1 rounded-md">
            <div className="flex flex-col space-y-2 w-full max-w-xs mb-3">
                <label htmlFor="year" className="text-sm font-medium text-gray-700 pl-1">
                    Année
                </label>
                <select
                    name="year"
                    id="year"
                    value={activeYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 52 }, (_, index) => {
                    const weekNumber = index + 1;
                    const isActive = activeWeek === weekNumber;
                    const hasEvents = weekHasEvents(weekNumber); // Vérifie si la semaine a des événements
                    return (
                        <button
                            key={weekNumber}
                            onClick={() => onWeekClick(weekNumber, activeYear)}
                            className={`text-white border-none rounded px-3 py-2 ${isActive
                                ? hasEvents
                                ? "outline outline-2 outline-offset-2 outline-orangeDark bg-orangeDark hover:bg-orangeDark"
                                : "outline outline-2 outline-offset-2 outline-redHover bg-red hover:bg-red"
                                : hasEvents
                                    ? "bg-orange hover:bg-orangeDark" // Si la semaine a des événements, couleur verte
                                    : "bg-redHover hover:bg-red"
                                }`}
                        >
                            {weekNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
