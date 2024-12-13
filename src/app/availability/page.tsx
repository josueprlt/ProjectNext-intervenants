'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import generateDateForIntervenant from "./generateDateForIntervenant";
import NumberWeek from "@/app/ui/numberweek";
import { useRef } from 'react';

const getDateFromWeek = (year: number, week: number) => {
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1)); // 1er janvier de l'année
  const daysOffset = (week - 1) * 7; // Nombre de jours à ajouter
  return new Date(firstDayOfYear.setUTCDate(firstDayOfYear.getUTCDate() + daysOffset));
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
      calendarRef.current.getApi().gotoDate(newDate); // Navigue vers la nouvelle date
    }
  }, [selectedYear, selectedWeek]);

  return (
    <div className="col-start-2 col-end-5 w-full h-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
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
  const [events, setEvents] = useState<any[]>([]); // Liste des événements
  const [selectedWeek, setSelectedWeek] = useState<number>(new Date().getUTCDate());
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();


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

    const getISOWeekNumber = (date) => {
      const tempDate = new Date(date);
      tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7)); // Ajuste pour ISO
      const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
      return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    };

    const weekNumber = getISOWeekNumber(currentDate);
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
    // Mettez à jour l'événement dans l'état
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  useEffect(() => {
    if (intervenant) {
      let disponibilities = intervenant.availability;
      console.log(disponibilities);
      setEvents(generateDateForIntervenant(disponibilities, "2024-01-09", "2025-12-13"));
    }
  }, [intervenant])

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
    return <p>La clé de cet intervenant n'est plus valide !</p>
  }

  if (intervenant) {
    return (
      <div className='h-screen mx-4'>
        <h1>Page Availability</h1>
        <p>Bonjour, {intervenant.firstname} {intervenant.name} !</p>
        <section className='grid grid-cols-4 gap-4 w-full mt-10'>
          <NumberWeek
            activeWeek={selectedWeek}
            onWeekClick={(week) => setSelectedWeek(week)}
          />
          <Calendar
            events={events}
            onEventDrop={updateEventInState}
            selectedYear={new Date().getFullYear()} // Année courante, ou remplacez par une sélection
            selectedWeek={selectedWeek}
          />
        </section>
      </div>
    );
  }

  return <p>Les informations de l'intervenant ne sont pas disponibles.</p>;
}
