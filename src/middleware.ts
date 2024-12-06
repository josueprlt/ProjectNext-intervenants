import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: Request) {
  const url = new URL(request.url);

  // Log pour vérifier l'header
  console.log('Headers:', request.headers);

  // Si l'utilisateur essaie d'accéder à /dashboard, vérifiez si le cookie 'token' est valide
  if (url.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      console.error('Token manquant');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Vérification du token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
      console.log('Token décodé:', decodedToken); // Debug
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/disponibility'], // Ajouter ici les chemins protégés
};
