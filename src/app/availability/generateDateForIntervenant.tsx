import { parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function generateDateForIntervenant(data, startDate, endDate) {
    const fullCalendarEvents = [];
    const daysMap = {
        "dimanche": 0,
        "lundi": 1,
        "mardi": 2,
        "mercredi": 3,
        "jeudi": 4,
        "vendredi": 5,
        "samedi": 6
    };

    // Fonction pour calculer dynamiquement les périodes de vacances
    function getVacationPeriods(year) {
        return [
            {
                start: new Date(`${year}-02-10`), // Vacances d'hiver (début février)
                end: new Date(`${year}-02-25`)   // Fin février
            },
            {
                start: new Date(`${year}-04-06`), // Vacances de printemps (début avril)
                end: new Date(`${year}-04-21`)   // Fin avril
            },
            {
                start: new Date(`${year}-07-06`), // Vacances d'été (début juillet)
                end: new Date(`${year}-09-01`)   // Fin août
            },
            {
                start: new Date(`${year}-10-19`), // Vacances de la Toussaint (fin octobre)
                end: new Date(`${year}-11-04`)   // Début novembre
            },
            {
                start: new Date(`${year}-12-21`), // Vacances de Noël (fin décembre)
                end: new Date(`${year + 1}-01-06`) // Début janvier de l'année suivante
            }
        ];
    }

    // Vérifie si une date tombe dans une période de vacances
    function isDateInVacation(date) {
        const year = date.getFullYear();
        const vacationPeriods = getVacationPeriods(year);
        return vacationPeriods.some(vacation => {
            return date >= vacation.start && date <= vacation.end;
        });
    }

    // Fonction pour ajouter des heures à une date
    function setTimeToDate(date, time) {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }

    // Fonction pour obtenir la première date d'une semaine donnée (ISO 8601)
    function getStartDateOfWeek(weekNumber, year) {
        const januaryFirst = new Date(year, 0, 1);
        const daysOffset = (weekNumber - 1) * 7;
        const dayOfWeek = januaryFirst.getDay();
        const isoWeekStartOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8; // Ajustement ISO (lundi comme 1er jour)
        return new Date(januaryFirst.setDate(januaryFirst.getDate() - isoWeekStartOffset + daysOffset));
    }

    // Générer les événements pour une période donnée
    function processPeriod(periodData, periodStart, periodEnd) {
        for (let d = new Date(periodStart); d <= periodEnd; d.setDate(d.getDate() + 1)) {
            if (isDateInVacation(d)) continue; // Ignorer les dates en vacances
            const dayIndex = d.getDay();
            const dayName = Object.keys(daysMap).find(key => daysMap[key] === dayIndex);

            periodData.forEach(dispo => {
                if (dispo.days.split(", ").includes(dayName)) {
                    const startTime = setTimeToDate(d, dispo.from);
                    const endTime = setTimeToDate(d, dispo.to);
                    fullCalendarEvents.push({
                        title: `Disponibilité (${dayName})`,
                        start: startTime.toISOString(),
                        end: endTime.toISOString()
                    });
                }
            });
        }
    }

    // Processus principal
    const defaultPeriod = data.default || [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Traiter la période par défaut
    processPeriod(defaultPeriod, start, end);

    // Traiter les autres périodes spécifiques
    Object.keys(data).forEach(periodKey => {
        if (periodKey !== "default") {
            const periodData = data[periodKey];
            const match = periodKey.match(/^S(\d+)$/);
            if (match) {
                const weekNumber = parseInt(match[1], 10);
                const year = start.getFullYear();

                // Calculer la plage de dates pour cette semaine spécifique
                const periodStart = getStartDateOfWeek(weekNumber, year);
                const periodEnd = new Date(periodStart);
                periodEnd.setDate(periodStart.getDate() + 6); // Une semaine dure 7 jours

                // S'assurer que les dates sont dans les limites de la plage donnée
                if (periodStart < start) periodStart.setTime(start.getTime());
                if (periodEnd > end) periodEnd.setTime(end.getTime());

                // Appeler le traitement pour cette période
                processPeriod(periodData, periodStart, periodEnd);
            }
        }
    });

    return fullCalendarEvents;
}



export function formatEvents(events) {
    const formattedEvents = {};

    events.forEach(event => {
        const start = parseISO(event.start);
        const end = parseISO(event.end);
        const dayName = format(start, 'EEEE', { locale: fr }).toLowerCase();
        const weekNumber = `S${format(start, 'w')}`;

        const eventData = {
            days: dayName,
            from: format(start, 'HH:mm'),
            to: format(end, 'HH:mm')
        };

        if (!formattedEvents[weekNumber]) {
            formattedEvents[weekNumber] = [];
        }

        // Check if the same day already exists in the week
        const existingEvent = formattedEvents[weekNumber].find(e => e.days === dayName);
        if (existingEvent) {
            // Merge time ranges if they overlap or are adjacent
            const existingStart = parseISO(`${format(start, 'yyyy-MM-dd')}T${existingEvent.from}`);
            const existingEnd = parseISO(`${format(start, 'yyyy-MM-dd')}T${existingEvent.to}`);

            if (start <= existingEnd && end >= existingStart) {
                existingEvent.from = format(Math.min(existingStart, start), 'HH:mm');
                existingEvent.to = format(Math.max(existingEnd, end), 'HH:mm');
            } else {
                formattedEvents[weekNumber].push(eventData);
            }
        } else {
            formattedEvents[weekNumber].push(eventData);
        }
    });

    // Combine days with the same time ranges
    for (const week in formattedEvents) {
        const combinedEvents = {};
        formattedEvents[week].forEach(event => {
            const timeRange = `${event.from}-${event.to}`;
            if (!combinedEvents[timeRange]) {
                combinedEvents[timeRange] = [];
            }
            combinedEvents[timeRange].push(event.days);
        });

        formattedEvents[week] = Object.entries(combinedEvents).map(([timeRange, days]) => {
            const [from, to] = timeRange.split('-');
            return {
                days: days.join(', '),
                from,
                to
            };
        });
    }

    return formattedEvents;
}