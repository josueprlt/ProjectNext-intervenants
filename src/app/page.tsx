"use client"
import { useEffect, useState } from 'react';
import Image from "next/image";
import { fetchIntervenants } from './lib/data';

export default function Home() {
  const [intervenants, setIntervenants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/fetchIntervenants');
      const result = await response.json();
      setIntervenants(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Liste des Intervenants :</h1>
        {intervenants ? (
          <>
            <ul>
              {intervenants.map((inter) => (
                <li key={inter.id}>- {inter.firstname} {inter.name}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>Loading...</p>
          </>
        )}
    </div>
  );
}
