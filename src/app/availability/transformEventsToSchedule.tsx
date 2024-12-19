import { DateTime } from 'luxon';

function formatEvents(events: any[]) {
    const formattedEvents: any = {
        default: [],
    };

    events.forEach((event) => {
        const start = DateTime.fromISO(event.start);
        const end = DateTime.fromISO(event.end);

        const weekNumber = `S${start.weekNumber}`;
        const days = start.weekdayLong.toLowerCase(); // Utilisation de la méthode weekdayLong pour récupérer les jours de la semaine

        const eventTime = {
            from: start.toFormat("HH:mm"),
            to: end.toFormat("HH:mm"),
        };

        // Si c'est un événement "default", on l'ajoute dans la section "default"
        if (event.title === "Default Event") {
            if (formattedEvents.default.length === 0) {
                formattedEvents.default.push({
                    days: "lundi, mardi, mercredi, jeudi, vendredi", // Les jours par défaut
                    ...eventTime,
                });
            }
        } else {            
            // Ajout des événements dans la semaine correspondante (S38, S40, etc.)
            if (!formattedEvents[weekNumber]) {
                formattedEvents[weekNumber] = [];
            }

            // Ajout de l'événement dans la semaine correspondante
            formattedEvents[weekNumber].push({
                days: days, // Jour de la semaine
                ...eventTime,
            });
        }
    });

    return formattedEvents;
}

export default formatEvents;
