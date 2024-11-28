"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { trashIcon, penIcon, dangerIcon, plusIcon } from "@/app/ui/icons";

export default function Gestion() {
    const [intervenants, setIntervenants] = useState([]);
    const Trash = trashIcon;
    const Pen = penIcon;
    const Danger = dangerIcon;
    const Plus = plusIcon;

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

    const fetchData = async () => {
        const response = await fetch('/api/fetchIntervenants');
        const result = await response.json();
        setIntervenants(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col p-2 pr-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestion des Intervenants</h1>
            <Link href="/add/intervenant" className='flex items-center gap-2 text-white bg-red mr-auto mb-2 rounded-lg px-2 py-2 hover:bg-redHover'>
                <Plus className='w-5 h-5' />
                Ajouter un intervenant
            </Link>
            {intervenants ? (
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
                                className={`relative grid grid-cols-7 gap-4 text-sm text-gray-800 py-3 items-center group rounded-md ${isDatePassed(inter.enddate) ? 'bg-orangeLight' : ''}`}
                            >
                                <div className='pl-2'>{inter.firstname}</div>
                                <div>{inter.name}</div>
                                <div className="truncate">{inter.email}</div>
                                <div className="truncate">{inter.key}</div>
                                <div className="truncate">{inter.creationdate}</div>
                                <div className="truncate">{inter.enddate}</div>
                                <div>{inter.availability}</div>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                    <Link href={`/modification/intervenant/${inter.id}`} className="bg-gray-50 p-2 rounded hover:bg-sky-100">
                                        <Pen className="w-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(inter.id)} className="bg-gray-50 p-2 rounded hover:bg-redLight hover:text-red">
                                        <Trash className="w-5" />
                                    </button>
                                </div>
                                {isDatePassed(inter.enddate) && (
                                    <div className='absolute right-5 top-1/2 transform -translate-y-1/2 flex gap-1 z-0'>
                                        <Danger className="w-6 h-6 text-orange" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Chargement...</p>
            )}
        </main>
    );
}