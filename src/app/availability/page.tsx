'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function isDatePassed(creationDate: string, endDate: string): boolean {
  const parsedCreationDate = new Date(creationDate);
  const parsedEndDate = new Date(endDate);
  return parsedEndDate < parsedCreationDate;
}

export default function AvailabilityPage() {
  const [intervenant, setIntervenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (!key) {
    return (
      <div>
        <p>Aucune clé renseignée dans l'URL</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (intervenant && isDatePassed(intervenant.creationdate, intervenant.enddate)) {
    return (
      <div>
        <p>La date de validité est dépassée</p>
      </div>
    );
  }

  if (intervenant) {
    return (
      <div>
        <h1>Page Availability</h1>
        <p>Bonjour, {intervenant.firstname} {intervenant.name} !</p>
      </div>
    );
  }

  return (
    <div>
      <p>Les informations de l'intervenant ne sont pas disponibles.</p>
    </div>
  );
}