"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CloseIcon } from "@/app/ui/icons";

const convertDateForInput = (isoDate) => {
    if (!isoDate) return ''; // Si la date est invalide ou vide, retourner une chaîne vide
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajouter un zéro devant si le mois est inférieur à 10
    const day = String(date.getDate()).padStart(2, '0'); // Ajouter un zéro devant si le jour est inférieur à 10
    return `${year}-${month}-${day}`;
};

export default function modificationIntervenant() {
    const router = useRouter();
    const [intervenant, setIntervenant] = useState(null);
    const [firstname, setFirstname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [enddate, setEnddate] = useState(null);
    const [availability, setAvailability] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const params = useParams();
    const id = params.id;

    const fetchData = async () => {
        const response = await fetch(`/api/fetchIntervenant/${id}`);
        const result = await response.json();
        setIntervenant(result);
        setFirstname(result.firstname);
        setName(result.name);
        setEmail(result.email);
        setEnddate(result.enddate);
        setAvailability(result.availability);
    };
    
    const handleModification = async () => {
        const data = {
            firstname,
            name,
            email,
            enddate,
            availability,
        };

        try {
            const response = await fetch(`/api/modificationIntervenant/${id}`, {
                method: 'PUT',
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
        fetchData();
    }, []);

    useEffect(() => {
        if (intervenant?.enddate) {
            setEnddate(convertDateForInput(intervenant.enddate)); // Conversion de la date récupérée
        }
    }, [intervenant]);

    return (
        <>
            {intervenant ? (
                <section className='h-screen flex flex-col justify-center' >
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleModification();
                            }}
                            className="max-w-xl p-6 m-auto bg-white rounded-lg shadow-md space-y-6 relative"
                        >
                            <Link href="/dashboard" className='text-red hover:text-redHover'>
                                <CloseIcon className='absolute right-5 top-5 w-8 h-8' />
                            </Link>
                            <h2 className='text-center mb-5 text-2xl font-bold'>Modifier un intervenant</h2>
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
                                <label htmlFor="date" className="font-semibold text-gray-700">Date de fin de validité</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={enddate}
                                    onChange={(e) => setEnddate(e.target.value)}
                                    required
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="availability" className="font-semibold text-gray-700">Disponible</label>
                                <textarea
                                    id="availability"
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red text-white py-2 rounded-md hover:bg-redHover focus:outline-none focus:ring-2 focus:ring-red"
                            >
                                Modifier
                            </button>
                            {errorMessage && (
                                <div className='text-center'>
                                    <span className="text-red font-semibold text-sm mt-2">{errorMessage}</span>
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            ) : (
                <p>Chargement...</p>
            )}
        </>
    );
}