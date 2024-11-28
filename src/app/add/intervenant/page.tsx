"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

export default function AddIntervenant() {
    const [firstname, setFirstname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [creationdate, setCreationdate] = useState(new Date());
    const [enddate, setEnddate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 2)));
    const [key, setKey] = useState(uuidv4());
    const [availability, setAvailability] = useState(false);
    
    const handleAdd = async () => {
        const router = useRouter();
        const data = {
            firstname,
            name,
            email,
            creationdate,
            enddate,
            key,
            availability
        };

        try {
            const response = await fetch('/api/addIntervenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'intervenant", error);
        }
    };

    useEffect(() => {
        setKey(uuidv4());
        setCreationdate(new Date());
        setEnddate(new Date(new Date().setMonth(new Date().getMonth() + 2)));
    }, []);

    return (
        <div>
            <div>
                <label htmlFor="firstname">Prénom</label>
                <input type="text" id='firstname' value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Insérez Prénom" required />
            </div>
            <div>
                <label htmlFor="name">Nom</label>
                <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder="Insérez Nom" required />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Insérez Email" required />
            </div>
            <div>
                <label htmlFor="availability">Availability</label>
                <input type="checkbox" id='availability' checked={availability} onChange={(e) => setAvailability(e.target.checked)} />
            </div>
            <button onClick={handleAdd}>Ajouter</button>
        </div>
    );
};