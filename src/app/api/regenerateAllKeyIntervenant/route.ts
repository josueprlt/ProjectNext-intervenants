import { NextResponse } from 'next/server';
import { regenerateAllKeysIntervenants } from '@/app/lib/data';

export async function PUT() {
  try {
    // Appeler la fonction pour regénérer toutes les clés
    const result = await regenerateAllKeysIntervenants();

    // Répondre avec succès si tout est OK
    return NextResponse.json(
      { message: 'Toutes les clés ont été régénérées avec succès.', result },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erreur lors de la régénération des clés des intervenants:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}