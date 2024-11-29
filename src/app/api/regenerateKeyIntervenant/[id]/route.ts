import { NextResponse } from 'next/server';
import { regenerateKeyIntervenantById } from '@/app/lib/data';
import { v4 as uuidv4 } from 'uuid'; // Générateur de clés uniques

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Générer une nouvelle clé
    const newKey = uuidv4();

    // Mise à jour de l'intervenant avec la nouvelle clé
    const updatedIntervenant = await regenerateKeyIntervenantById(Number(id), { key: newKey });

    if (!updatedIntervenant) {
      return NextResponse.json({ error: 'Intervenant introuvable.' }, { status: 404 });
    }

    // Réponse avec l'intervenant mis à jour
    return NextResponse.json(updatedIntervenant, { status: 200 });
  } catch (err) {
    console.error('Erreur lors de la régénération de la clé de l’intervenant:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}