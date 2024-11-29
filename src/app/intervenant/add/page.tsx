"use client";

import Link from 'next/link';
import { CloseIcon } from "@/app/ui/icons";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddIntervenant() {
    const router = useRouter();
    const [firstname, setFirstname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [creationdate, setCreationdate] = useState(new Date());
    const [enddate, setEnddate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 2)));
    const [key, setKey] = useState(uuidv4());
    const [availability, setAvailability] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAdd = async () => {
        const data = {
            firstname,
            name,
            email,
            creationdate,
            enddate,
            key,
            availability,
        };

        try {
            const response = await fetch('/api/addIntervenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                router.push('/dashboard');
            } else {
                if (result.error === 'Email déjà utilisé') {
                    setErrorMessage('Cet email est déjà utilisé. Veuillez en choisir un autre.');
                }
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
        <section className='h-screen flex flex-col justify-center'>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                    }}
                    className="max-w-xl p-6 m-auto bg-white rounded-lg shadow-md space-y-6 relative"
                >
                    <Link href="/dashboard" className='text-red hover:text-redHover'>
                        <CloseIcon className='absolute right-5 top-5 w-8 h-8' />
                    </Link>
                    <h2 className='text-center mb-5 text-2xl font-bold'>Ajouter un intervenant</h2>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="firstname" className="font-semibold text-gray-700">Prénom</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Insérez Prénom"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="font-semibold text-gray-700">Nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insérez Nom"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Insérez Email"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="availability" className="font-semibold text-gray-700">Disponibilité</label>
                        <textarea
                            id="availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            placeholder='Insérez disponibilité'
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red text-white py-2 rounded-md hover:bg-redHover focus:outline-none focus:ring-2 focus:ring-red"
                    >
                        Ajouter
                    </button>
                    {errorMessage && (
                        <div className='text-center'>
                            <span className="text-red font-semibold text-sm mt-2">{errorMessage}</span>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};