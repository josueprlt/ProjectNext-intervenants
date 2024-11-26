"use client"
import { useEffect, useState } from 'react';

export default function Gestion() {
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
        <main className="flex min-h-screen flex-col p-6">
            <h1>Gestion des Intervenants :</h1>
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
        </main>
    );
}