'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

function Calendar({ events, onEventDrop }: { events: any[]; onEventDrop: (event: any) => void }) {
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      locale="fr"
      locales={[frLocale]} // Pour la localisation française
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek',
      }}
      editable={true} // Permet de modifier les événements
      droppable={true} // Permet de déplacer des événements externes dans le calendrier
      events={events}
      eventDrop={(info) => {
        // Appelé lors du déplacement d'un événement
        const updatedEvent = {
          id: info.event.id,
          title: info.event.title,
          start: info.event.start.toISOString(), // Convertir en ISO pour uniformité
          end: info.event.end?.toISOString() || null, // Gérer l'absence de "end"
        };
        onEventDrop(updatedEvent); // Transmettez les données mises à jour
      }}
    />
  );
}

export default function AvailabilityPage() {
  const [intervenant, setIntervenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([
    { "id": "1", "title": "Event 1", "start": "2024-12-01T10:00:00", "end": "2024-12-01T12:00:00" },
    { "id": "2", "title": "Event 2", "start": "2024-12-02T14:00:00", "end": "2024-12-02T15:00:00" }
  ]); // Liste des événements
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

  if (!key) {
    return <p>Aucune clé renseignée dans l'URL</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (intervenant) {    
    return (
      <div>
        <h1>Page Availability</h1>
        <p>Bonjour, {intervenant.firstname} {intervenant.name} !</p>
        <Calendar events={events} onEventDrop={updateEventInState} />
      </div>
    );
  }

  return <p>Les informations de l'intervenant ne sont pas disponibles.</p>;
}
