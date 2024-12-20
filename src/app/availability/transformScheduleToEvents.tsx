import { DateTime } from "luxon";

interface Schedule {
    default: { days: string; from: string; to: string }[];
    [week: string]: { days: string; from: string; to: string }[];
}

interface FullCalendarEvent {
    title: string;
    start: string;
    end: string;
}

function transformScheduleToEvents(schedule: Schedule): FullCalendarEvent[] {
    const defaultSchedule = schedule.default || [];
    const weekOverrides = Object.keys(schedule).filter((key) => key !== "default");

    // Définition des semaines de vacances directement dans la fonction
    const vacationWeeks = [1, 5, 6, 7, 15, 16, 27, 28, 29, 30, 31, 32, 33, 34, 35];

    const daysMap: Record<string, number> = {
        lundi: 1,
        mardi: 2,
        mercredi: 3,
        jeudi: 4,
        vendredi: 5,
        samedi: 6,
        dimanche: 7,
    };

    const events: FullCalendarEvent[] = [];

    // Helper function to parse time and validate it
    const parseTime = (time: string) => {
        const [hour, minute] = time.split(":").map((val) => parseInt(val, 10));
        if (isNaN(hour) || isNaN(minute)) {
            throw new Error(`Invalid time format: "${time}". Expected format is "HH:mm".`);
        }
        return { hour, minute };
    };

    // Function to create events for a specific week
    const createEventsForWeek = (
        weekNumber: number,
        rules: { days: string; from: string; to: string }[],
        isDefault: boolean = false
    ) => {
        // Skip the week if it's a vacation week
        if (vacationWeeks.includes(weekNumber)) {
            return;
        }

        const currentYear = DateTime.now().year;

        // Calculate the base date for the given week number
        const baseDate = DateTime.fromObject({
            weekYear: currentYear,
            weekNumber,
            weekday: 1, // Start of the week
        });

        rules.forEach(({ days, from, to }) => {
            const dayNumbers = days.split(", ").map((day) => daysMap[day.trim()]);
            const { hour: fromHour, minute: fromMinute } = parseTime(from);
            const { hour: toHour, minute: toMinute } = parseTime(to);

            dayNumbers.forEach((day) => {
                if (!day) {
                    console.warn(`Invalid day in schedule: "${days}"`);
                    return;
                }

                const start = baseDate.set({ weekday: day, hour: fromHour, minute: fromMinute });
                const end = baseDate.set({ weekday: day, hour: toHour, minute: toMinute });

                events.push({
                    title: isDefault ? "Default Event" : `Event S${weekNumber}`,
                    start: start.toISO(),
                    end: end.toISO(),
                });
            });
        });
    };

    // Add events for explicitly defined weeks
    weekOverrides.forEach((weekKey) => {
        const weekNumber = parseInt(weekKey.replace("S", ""));
        if (isNaN(weekNumber)) {
            console.warn(`Invalid week key: "${weekKey}". Skipping.`);
            return;
        }
        createEventsForWeek(weekNumber, schedule[weekKey]);
    });

    // Add events for weeks not mentioned in the JSON
    const allWeeks = Array.from({ length: 53 }, (_, i) => i + 1); // Weeks 1 to 53
    const definedWeeks = weekOverrides.map((weekKey) => parseInt(weekKey.replace("S", "")));
    const undefinedWeeks = allWeeks.filter((week) => !definedWeeks.includes(week));

    undefinedWeeks.forEach((weekNumber) => {
        createEventsForWeek(weekNumber, defaultSchedule, true);
    });

    return events;
}

export default transformScheduleToEvents;
