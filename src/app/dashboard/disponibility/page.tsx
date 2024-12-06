'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Disponibility() {
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await fetch('/api/auth/verifyToken', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Token invalide');
                }

            } catch (error) {
                router.push('/login');
            }
        };

        checkToken();
    }, []);


    return (
        <main className="flex min-h-screen flex-col p-6">
            <p>Disponibilités des intervenants</p>
        </main>
    );
}