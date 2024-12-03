"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TrashIcon, PenIcon, DangerIcon, PlusIcon, KeyIcon } from "@/app/ui/icons";
import Loading from "./loading";

const convertDateForInput = (isoDate) => {
    if (!isoDate) return ''; // Si la date est invalide ou vide, retourner une chaîne vide
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajouter un zéro devant si le mois est inférieur à 10
    const day = String(date.getDate()).padStart(2, '0'); // Ajouter un zéro devant si le jour est inférieur à 10
    return `${day}/${month}/${year}`;
};

export default function Gestion() {
    const [intervenants, setIntervenants] = useState([]);
    const [loading, setLoading] = useState(true);

    function isDatePassed(endDate: string): boolean {
        const currentDate = new Date();
        const parsedEndDate = new Date(endDate);
        return parsedEndDate < currentDate;
    }

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/deleteIntervenant/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'intervenant", error);
        }
    };

    const handleRegenerate = async (id: number) => {
        try {
            const response = await fetch(`/api/regenerateKeyIntervenant/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Erreur lors de la regénération de la clé de l'intervenant", error);
        }
    };

    const handleRegenerateAll = async () => {
        try {
            const response = await fetch(`/api/regenerateAllKeyIntervenant`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Erreur lors de la regénération de la clé des intervenants", error);
        }
    };

    const fetchData = async () => {
        setLoading(true); // Démarre le chargement
        try {
            const response = await fetch('/api/fetchIntervenants');
            const result = await response.json();
            setIntervenants(result);
        } catch (error) {
            console.error("Erreur lors de la récupération des intervenants", error);
        }
        setLoading(false); // Termine le chargement
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="flex min-h-screen flex-col p-2 pr-4">
            <h1 className="text-3xl font-bold my-8 text-gray-800">Gestion des Intervenants</h1>
            <Link href="/intervenant/add" className='flex items-center gap-2 text-white bg-red mr-auto mb-2 rounded-lg px-2 py-2 hover:bg-redHover'>
                <PlusIcon className='w-5 h-5' />
                Ajouter un intervenant
            </Link>
            <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                    <div className='pl-2'>Prénom</div>
                    <div>Nom</div>
                    <div>Email</div>
                    <div>Clé</div>
                    <div>Date de création</div>
                    <div>Date de fin</div>
                    <div>Disponibilité</div>
                </div>
                <div className="divide-y">
                    {intervenants.map((inter) => (
                        <div
                            key={inter.id}
                            className={`relative grid grid-cols-7 gap-4 text-sm text-gray-800 py-3 items-center group ${isDatePassed(inter.enddate) ? 'bg-orangeLight rounded-md' : ''}`}
                        >
                            <div className='pl-2'>{inter.firstname}</div>
                            <div>{inter.name}</div>
                            <div className="truncate">{inter.email}</div>
                            <div className="truncate">{inter.key}</div>
                            <div className="truncate">{convertDateForInput(inter.creationdate)}</div>
                            <div className="truncate">{convertDateForInput(inter.enddate)}</div>
                            <div>{inter.availability}</div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <Link href={`/intervenant/modification/${inter.id}`} className="bg-gray-50 p-2 rounded hover:bg-sky-100">
                                    <PenIcon className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleRegenerate(inter.id)} className="bg-gray-50 p-2 rounded hover:bg-sky-100">
                                    <KeyIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(inter.id)} className="bg-gray-50 p-2 rounded hover:bg-redLight hover:text-red">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                            {isDatePassed(inter.enddate) && (
                                <div className='absolute right-5 top-1/2 transform -translate-y-1/2 flex gap-1 z-0'>
                                    <DangerIcon className="w-6 h-6 text-orange" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => handleRegenerateAll()} className='flex gap-2 rounded-md bg-gray-50 mr-auto mt-2 p-3 text-sm font-medium hover:bg-sky-100 hover:text-red'>
                <KeyIcon className='w-5 h-5' />
                Regénérer les clés
            </button>
        </main>
    );
}
