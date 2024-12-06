'use client';

import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch('/api/auth/verifyToken', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Déconnexion réussie');
        window.location.href = '/login';
      } else {
        const data = await response.json();
        console.error(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur de connexion au serveur', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex h-20 w-full items-end rounded-lg bg-red p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              {isLoggedIn ? (
                <div>
                  <p className='text-center'>Déjà connecté en tant que <span className='text-redHover'>{user.email}</span></p>
                  <button className="mt-4 w-full bg-red text-white rounded-md py-[9px] hover:bg-redHover" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="mb-3 text-2xl">
                    Connexion
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                  </div>
                  <button className="mt-4 w-full bg-red text-white rounded-md py-[9px] hover:bg-redHover" aria-disabled={isPending}>
                    Se Connecter
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
