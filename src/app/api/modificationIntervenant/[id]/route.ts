import { NextResponse } from 'next/server';
import { updateIntervenantById } from '@/app/lib/data'; // Fonction pour mettre à jour un intervenant

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Récupération des données envoyées dans la requête
    const body = await request.json();
    const { firstname, name, email, enddate, availability } = body;

    // Conversion de la date si nécessaire (facultatif si le front envoie déjà la date dans un bon format)
    const formattedEndDate = new Date(enddate);

    // Mise à jour de l'intervenant
    const updatedIntervenant = await updateIntervenantById(Number(id), {
      firstname,
      name,
      email,
      enddate: formattedEndDate,
      availability,
    });

    // Vérification si la mise à jour a échoué
    if (!updatedIntervenant) {
      return NextResponse.json({ error: 'Échec de la mise à jour. Intervenant introuvable.' }, { status: 404 });
    }

    // Réponse en cas de succès
    return NextResponse.json(updatedIntervenant, { status: 200 });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l’intervenant:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}