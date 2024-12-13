export default function NumberWeek({ activeWeek, onWeekClick }: { activeWeek: number; onWeekClick: (week: number) => void }) {
    return (
        <div className="bg-gray-200 p-3 col-1 rounded-md">
            <div className="flex flex-col space-y-2 w-full max-w-xs mb-3">
                <label htmlFor="year" className="text-sm font-medium text-gray-700 pl-1">Année</label>
                <select name="year" id="year" className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 52 }, (_, index) => {
                    const isActive = activeWeek === index + 1;
                    return (
                        <button
                            key={index}
                            onClick={() => onWeekClick(index + 1)}
                            className={`text-white hover:bg-red border-none rounded px-3 py-2 ${isActive ? 'outline outline-2 outline-offset-2 outline-redHover bg-red' : 'bg-redHover'
                                }`}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}