import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Supprime le cookie token en le définissant avec une date expirée
    const response = NextResponse.json({ message: 'Déconnexion réussie' });
    response.headers.set(
      'Set-Cookie',
      'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;'
    );
    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}