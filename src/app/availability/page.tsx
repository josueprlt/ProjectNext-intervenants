'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import generateDateForIntervenant from "./generateDateForIntervenant";
import NumberWeek from "@/app/ui/numberweek";
import next from 'next';

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

function Calendar({ events, onEventDrop, selectedYear, selectedWeek }: {
  events: any[];
  onEventDrop: (event: any) => void;
  selectedYear: number;
  selectedWeek: number;
}) {
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    if (calendarRef.current && selectedYear && selectedWeek) {
      const newDate = getDateFromWeek(selectedYear, selectedWeek);
      calendarRef.current.getApi().gotoDate(newDate);
    }
  }, [selectedYear, selectedWeek]);

  return (
    <div className="col-start-2 col-end-5 w-full h-full">
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
        droppable={true}
        events={events}
        eventDrop={(info) => {
          const updatedEvent = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start.toISOString(),
            end: info.event.end?.toISOString() || null,
          };
          onEventDrop(updatedEvent);
        }}
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
      } else {
        throw new Error("La clé n'est pas valide");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateEventInState = (updatedEvent: any) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  useEffect(() => {
    const currentDate = new Date();
    if (intervenant) {
      let disponibilities = intervenant.availability;

      let previousYearDate = new Date(currentDate);
      previousYearDate.setFullYear(currentDate.getFullYear() - 2);
      let nextYearDate = new Date(currentDate);
      nextYearDate.setFullYear(currentDate.getFullYear() + 2);
      
      setEvents(generateDateForIntervenant(disponibilities, previousYearDate, nextYearDate));
    }
  }, [intervenant]);

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

  if (intervenant) {
    return (
      <div className="h-screen mx-4">
        <h1>Page Availability</h1>
        <p>Bonjour, {intervenant.firstname} {intervenant.name} !</p>
        <section className="flex flex-col md:grid md:grid-cols-4 gap-4 w-full mt-10">
          <NumberWeek
            activeWeek={selectedWeek}
            onWeekClick={(week) => setSelectedWeek(week)}
            activeYear={selectedYear} // Année active
            onYearChange={(year) => setSelectedYear(year)} // Gestion du changement d'année
            weekHasEvents={checkWeekHasEvents} // Passer la fonction
          />
          <Calendar
            events={events}
            onEventDrop={updateEventInState}
            selectedYear={selectedYear}
            selectedWeek={selectedWeek}
          />
        </section>
      </div>
    );
  }

  return <p>Les informations de l'intervenant ne sont pas disponibles.</p>;
}
