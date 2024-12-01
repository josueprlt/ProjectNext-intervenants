'use client';

import { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);

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
            <h1>Register</h1>
            {success ? (
                <p>Inscription réussie !</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.email && <p>{fieldErrors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.password && <p>{fieldErrors.password}</p>}
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">Sign Up</button>
                </form>
            )}
        </div>
    );
}
