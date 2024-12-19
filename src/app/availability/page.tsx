'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import transformScheduleToEvents from "./transformScheduleToEvents";
import formatEvents from "./transformEventsToSchedule";
import NumberWeek from "@/app/ui/numberweek";

const getDateFromWeek = (year: number, week: number) => {
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const daysOffset = (week - 1) * 7;
  return new Date(firstDayOfYear.setUTCDate(firstDayOfYear.getUTCDate() + daysOffset));
};

const getISOWeekNumber = (date: Date) => {
  const tempDate = new Date(date);
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

function isDatePassed(endDate: string): boolean {
  const currentDate = new Date();
  const parsedEndDate = new Date(endDate);
  return parsedEndDate < currentDate;
}

async function saveCalendarEvents(events: any[], email: string) {
  try {
    // Étape 1 : Organiser les événements sous forme de semaine (S38, S40, etc.)
    const eventsByWeek = {};

    events.forEach((event) => {
      const weekNumber = `S${event.weekNumber}`;
      const newEvent = {
        days: event.days,
        from: event.from,
        to: event.to,
      };

      // Regroupe les événements par semaine
      if (eventsByWeek[weekNumber]) {
        eventsByWeek[weekNumber].push(newEvent);
      } else {
        eventsByWeek[weekNumber] = [newEvent];
      }
    });

    // Étape 2 : Ajouter la section "default" si elle n'existe pas
    if (!eventsByWeek.default) {
      eventsByWeek.default = [];
    }

    // Étape 3 : Sauvegarder dans la base de données
    const response = await fetch('/api/saveCalendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: eventsByWeek, email }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Événements sauvegardés avec succès:', result);
    } else {
      console.error('Échec de la sauvegarde des événements:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des événements:', error);
  }
}


function updateEvents(existingEvents: any, newEvents: any): any {
  const updatedEvents = { ...existingEvents };

  newEvents.forEach((newEvent) => {
    const weekNumber = `S${newEvent.weekNumber}`;
    const days = newEvent.days;

    // Si l'événement existe déjà dans la semaine donnée
    if (updatedEvents[weekNumber]) {
      const weekEvents = updatedEvents[weekNumber];

      // Recherche de l'événement existant et mise à jour ou ajout
      const existingEventIndex = weekEvents.findIndex(
        (e: any) => e.days === days && e.from === newEvent.from
      );

      if (existingEventIndex >= 0) {
        // Si l'événement existe déjà, mise à jour
        weekEvents[existingEventIndex] = {
          ...weekEvents[existingEventIndex],
          to: newEvent.to,
        };
      } else {
        // Si l'événement n'existe pas, ajout
        weekEvents.push({
          days: newEvent.days,
          from: newEvent.from,
          to: newEvent.to,
        });
      }
    } else {
      // Si la semaine n'existe pas, on l'ajoute
      updatedEvents[weekNumber] = [
        {
          days: newEvent.days,
          from: newEvent.from,
          to: newEvent.to,
        },
      ];
    }
  });

  return updatedEvents;
}

function Calendar({ events, setEvents, onEventDrop, selectedYear, selectedWeek, intervenant }: {
  events: any[];
  setEvents: any;
  onEventDrop: (event: any) => void;
  selectedYear: number;
  selectedWeek: number;
  intervenant: any;
}) {
  let notDoublon = 0;
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    if (calendarRef.current && selectedYear && selectedWeek) {
      const newDate = getDateFromWeek(selectedYear, selectedWeek);
      calendarRef.current.getApi().gotoDate(newDate);
    }
  }, [selectedYear, selectedWeek]);

  useEffect(() => {
    // Initialisation des événements externes pour le drag and drop
    const externalEventsContainer = document.getElementById("external-events");

    if (externalEventsContainer) {
      new Draggable(externalEventsContainer, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          return JSON.parse(eventEl.getAttribute("data-event") || "{}");
        },
      });
    }
  }, []);

  return (
    <div className="col-start-2 col-end-5 w-full h-full">
      <div
        id="external-events"
        className="bg-gray-200 p-3 rounded-md w-full mb-2"
      >
        <div
          className="fc-event p-2 w-max bg-redHover cursor-move text-white rounded-md"
          data-event='{"title":"Disponibilité", "duration":"00:30"}'
        >
          Ajouter une nouvelle date
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        eventColor="#d84851"
        initialView="timeGridWeek"
        locale="fr"
        locales={[frLocale]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        nowIndicator={true}
        editable={true}
        droppable={true} // Permet de drop des événements externes
        events={events}
        eventReceive={(info) => {
          // Empêche FullCalendar d'ajouter l'événement automatiquement
          info.event.remove();

          const newEvent = {
            title: info.event.title,
            start: info.event.start.toISOString(),
            end: info.event.end.toISOString(),
            weekNumber: selectedWeek, // Ajouter la semaine
            days: info.event.start.toLocaleDateString('fr-FR', { weekday: 'long' }), // Extraire le jour de la semaine
          };

          // Mise à jour de l'état avec le nouvel événement
          updateEventInState(newEvent);

          // Sauvegarde après ajout de l'événement
          saveCalendarEvents(events, intervenant.email);
        }}
        eventDrop={(info) => {
          const updatedEvent = {
            title: info.event.title,
            start: info.event.start.toISOString(),
            end: info.event.end?.toISOString() || null,
            weekNumber: selectedWeek, // Ajouter la semaine
            days: info.event.start.toLocaleDateString('fr-FR', { weekday: 'long' }), // Extraire le jour de la semaine
          };

          // Mise à jour de l'état avec l'événement déplacé
          onEventDrop(updatedEvent);

          console.log("Événement déplacé :", updatedEvent);

          // Sauvegarde après déplacement de l'événement
          saveCalendarEvents(events, intervenant.email);
        }}
        eventColor="#d84851"
      />
    </div>
  );
}

export default function AvailabilityPage() {
  const [intervenant, setIntervenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();

  function updateEventInState(updatedEvent: any) {
    const updatedEvents = { ...events };

    const weekNumber = `S${updatedEvent.weekNumber}`;
    const newEvent = {
      days: updatedEvent.days,
      from: updatedEvent.from,
      to: updatedEvent.to
    };

    // Si la semaine existe déjà dans le calendrier
    if (updatedEvents[weekNumber]) {
      const weekEvents = updatedEvents[weekNumber];

      // Recherche si l'événement existe déjà pour cette journée
      const existingEventIndex = weekEvents.findIndex(
        (e: any) => e.days === newEvent.days && e.from === newEvent.from
      );

      if (existingEventIndex >= 0) {
        // Si l'événement existe, on le met à jour
        weekEvents[existingEventIndex] = newEvent;
      } else {
        // Sinon, on ajoute un nouvel événement
        weekEvents.push(newEvent);
      }
    } else {
      // Si la semaine n'existe pas, on la crée
      updatedEvents[weekNumber] = [newEvent];
    }

    // Mettre à jour l'état avec le calendrier mis à jour
    setEvents(updatedEvents);
  }


  const checkWeekHasEvents = (weekNumber: number) => {
    // Vérifiez si des événements sont présents pour la semaine donnée
    return events.some((event) => {
      const eventDate = new Date(event.start);
      const eventWeek = getISOWeekNumber(eventDate);
      return eventWeek === weekNumber && eventDate.getFullYear() === selectedYear;
    });
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verifyToken', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Token invalide');
        }

        await fetchData();
      } catch (err: any) {
        setError(err.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    verifyToken();

    const currentDate = new Date();
    setSelectedWeek(getISOWeekNumber(currentDate));
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/fetchIntervenantByKey/${key}`);
      const result = await response.json();

      if (response.ok) {
        setIntervenant(result);
        setEvents(transformScheduleToEvents(result.availability)); // Utilisation directe de availability
      } else {
        throw new Error("La clé n'est pas valide");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!key) {
    return <p>Aucune clé renseignée dans l'URL</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (isDatePassed(intervenant.enddate)) {
    return <p>La clé de cet intervenant n'est plus valide !</p>;
  }

  return (
    <div className="h-screen mx-4">
      <h1>Page Availability</h1>
      <p>Bonjour, {intervenant.firstname} {intervenant.name} !</p>
      <section className="flex flex-col md:grid md:grid-cols-4 gap-4 w-full mt-10">
        <NumberWeek
          activeWeek={selectedWeek}
          onWeekClick={(week) => setSelectedWeek(week)}
          activeYear={selectedYear}
          onYearChange={(year) => setSelectedYear(year)}
          weekHasEvents={checkWeekHasEvents}
        />
        <Calendar
          events={events}
          setEvents={setEvents}
          onEventDrop={updateEventInState}
          selectedYear={selectedYear}
          selectedWeek={selectedWeek}
          intervenant={intervenant}
        />
      </section>
    </div>
  );
}
