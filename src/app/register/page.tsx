'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                router.push('/login');
            } else {
                if (result.errors) {
                    setFieldErrors(result.errors.fieldErrors);
                    setError(result.errors.formErrors);
                } else {
                    setError(result.message);
                }
            }
        } catch (error) {
            console.error('Failed to register:', error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div>
            {success ? (
                <p>Inscription réussie !</p>
            ) : (
                <main className="flex items-center justify-center md:h-screen">
                    <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                        <div className="flex h-20 w-full items-end rounded-lg bg-red p-3 md:h-36">
                            <div className="w-32 text-white md:w-36">
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                                <h1 className="mb-3 text-2xl">
                                    Création de compte
                                </h1>
                                <div className="w-full">
                                    <div>
                                        <label
                                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-[9px] text-sm outline-2 placeholder:text-gray-500 focus:outline-red"
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="Entrez une adresse email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            {fieldErrors.email && <p className='text-redHover'>{fieldErrors.email}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label
                                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                            htmlFor="password"
                                        >
                                            Mot de passe
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-[9px] text-sm placeholder:text-gray-500 focus:outline-red"
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Entrez un mot de passe"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            {fieldErrors.password && <p className='text-redHover'>{fieldErrors.password}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex h-8 items-end space-x-1"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {error && <p className='text-redHover'>{error}</p>}
                                </div>
                                <button className="mt-4 w-full bg-red text-white rounded-md py-[9px] hover:bg-redHover" type="submit">
                                    Se créer un compte
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            )}
        </div>
    );
}
