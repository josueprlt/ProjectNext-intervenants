"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function modificationIntervenant() {
    const [intervenant, setIntervenant] = useState(null);
    const params = useParams();
    const id = params.id;

    const fetchData = async () => {
        const response = await fetch(`/api/fetchIntervenant/${id}`);
        const result = await response.json();
        setIntervenant(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {intervenant ? (
                <form action="">
                    <div>
                        <label htmlFor="firstname">Prénom</label>
                        <input type="text" name='firstname' id='firstname' value={intervenant.firstname} placeholder='Entrez un prénom' required />
                    </div>
                    <div>
                        <label htmlFor="name">Nom</label>
                        <input type="text" name='name' id='name' value={intervenant.name} placeholder='Entrez un nom' required />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' id='email' value={intervenant.email} placeholder='Entrez un email' required />
                    </div>
                </form>
            ) : (
                <p className="text-gray-500">Chargement...</p>
            )}
        </>
    );
}