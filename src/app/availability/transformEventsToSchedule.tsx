import { DateTime } from 'luxon';

function formatEvents(events: any[]) {
    const formattedEvents: any = {
        default: [{
            days: "lundi, mardi, mercredi, jeudi, vendredi",
            from: "08:00",
            to: "18:30"
        }],
    };

    console.log(events);

    events.forEach((event) => {
        if (!event.start || !event.end) {
            return;
        }

        const start = DateTime.fromISO(event.start);
        const end = DateTime.fromISO(event.end);

        if (!start.isValid || !end.isValid) {
            return;
        }

        const weekNumber = `S${start.weekNumber}`;
        const days = start.setLocale('fr').toFormat('cccc').toLowerCase(); // Utilisation de la méthode toFormat pour récupérer les jours de la semaine en français

        const eventTime = {
            from: start.toFormat("HH:mm"),
            to: end.toFormat("HH:mm"),
        };

        // Si c'est un événement "default" et qu'il n'a pas été déplacé, on l'ajoute dans la section "default"
        if (isDefaultEvent(event)) {
            // Ne rien faire car les événements par défaut sont déjà initialisés
        } else {
            // Ajout des événements dans la semaine correspondante (S38, S40, etc.)
            if (!formattedEvents[weekNumber]) {
                formattedEvents[weekNumber] = [];
            }

            // Vérifier si un événement avec les mêmes jours et heures existe déjà
            const existingEvent = formattedEvents[weekNumber].find((e: any) => e.days === days && e.from === eventTime.from && e.to === eventTime.to);

            if (!existingEvent) {
                // Ajout de l'événement dans la semaine correspondante
                formattedEvents[weekNumber].push({
                    days: days, // Jour de la semaine
                    ...eventTime,
                });
            }
        }
    });

    return formattedEvents;
}

// Fonction pour vérifier si un événement est un événement par défaut
function isDefaultEvent(event: any) {
    const defaultDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
    const start = DateTime.fromISO(event.start);
    const end = DateTime.fromISO(event.end);

    // Vérifier si l'événement couvre toute la journée de 8h à 18h30
    const isFullDay = start.toFormat("HH:mm") === "08:00" && end.toFormat("HH:mm") === "18:30";

    // Vérifier si l'événement se produit un jour de semaine par défaut
    const isDefaultDay = defaultDays.includes(start.setLocale('fr').toFormat('cccc').toLowerCase());

    return isFullDay && isDefaultDay;
}

export default formatEvents;