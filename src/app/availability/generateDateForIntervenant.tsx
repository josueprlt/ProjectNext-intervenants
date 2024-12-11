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
