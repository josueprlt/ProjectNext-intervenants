"use client"

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import transformScheduleToEvents from './transformScheduleToEvents';
import formatEvents from './transformEventsToSchedule';
import frLocale from '@fullcalendar/core/locales/fr';
import NumberWeek from "@/app/ui/numberweek";

function getISOWeekNumber(date: Date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

function getDateFromWeek(year: number, week: number) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}

function Calendar({ events, setEvents, selectedYear, selectedWeek, intervenant }: {
  events: any[];
  setEvents: any;
  selectedYear: number;
  selectedWeek: number;
  intervenant: any;
}) {
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

  const saveCalendarEvents = async (updatedEvents: any[]) => {
    const formattedEvents = formatEvents(updatedEvents);
    console.log('Saving events:', formattedEvents);
    try {
      const response = await fetch('/api/saveCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: intervenant.email, events: formattedEvents }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save events:', errorText);
        throw new Error('Failed to save events');
      }

      const result = await response.json();
      console.log('Events saved successfully:', result);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const handleEventAdd = (info: any) => {
    if (!info.event.start || !info.event.end) {
      console.error('Invalid event date:', info.event);
      return;
    }

    const newEvent = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      weekNumber: selectedWeek,
      days: info.event.start.toLocaleDateString('fr-FR', { weekday: 'long' }),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveCalendarEvents(updatedEvents);
  };

  const handleEventChange = (info: any) => {
    if (!info.event.start || !info.event.end) {
      console.error('Invalid event date:', info.event);
      return;
    }

    const updatedEvent = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end?.toISOString() || null,
      weekNumber: selectedWeek,
      days: info.event.start.toLocaleDateString('fr-FR', { weekday: 'long' }),
    };

    const updatedEvents = events.map(event =>
      event.id === info.event.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    saveCalendarEvents(updatedEvents);
  };

  const handleEventRemove = (info: any) => {
    const updatedEvents = events.filter(event => event.id !== info.event.id);
    setEvents(updatedEvents);
    saveCalendarEvents(updatedEvents);
  };

  const handleEventResize = (info: any) => {
    if (!info.event.start || !info.event.end) {
      console.error('Invalid event date:', info.event);
      return;
    }

    const updatedEvent = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end?.toISOString() || null,
      weekNumber: selectedWeek,
      days: info.event.start.toLocaleDateString('fr-FR', { weekday: 'long' }),
    };

    const updatedEvents = events.map(event =>
      event.id === info.event.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    saveCalendarEvents(updatedEvents);
  };

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
        eventReceive={handleEventAdd}
        eventDrop={handleEventChange}
        eventRemove={handleEventRemove}
        eventResize={handleEventResize} // Ajout du gestionnaire pour l'événement eventResize
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

  const checkWeekHasEvents = (weekNumber: number) => {
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

  return (

    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
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
              selectedYear={selectedYear}
              selectedWeek={selectedWeek}
              intervenant={intervenant}
            />
          </section>
        </div>
      )}
    </div>
  );
}