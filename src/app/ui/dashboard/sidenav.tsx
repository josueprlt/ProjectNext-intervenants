"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './nav-links';
import { SignOutIcon } from '@/app/ui/icons';

export default function SideNav() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        window.location.href = '/login'; // Redirige l'utilisateur après la déconnexion
      } else {
        const data = await response.json();
        console.error(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur de connexion au serveur', err);
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-red p-4 md:h-40"
        href="/"
      >
        <span className="sr-only">Accueil</span>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Liens de navigation */}
        <NavLinks />

        {/* Section pour l'image (optionnelle sur mobile) */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:px-5 md:flex md:flex-wrap md:items-center">
          <Image
            src="/universiteLimoges.png"
            width={700}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          {isLoggedIn && (
            <p>Connecté en tant que <br /> <span className='text-redHover'>{user.email}</span></p>
          )}
        </div>

        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-redLight hover:text-redHover md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <SignOutIcon className="w-6" />
          <div className="hidden md:block">Se Déconnecter</div>
        </button>
      </div>
    </div>
  );
}
