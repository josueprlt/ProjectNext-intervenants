import { getIntervenantById } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`ID reçu : ${id}`); // Ajout de log pour vérifier l'ID
  try {
    const intervenant = await getIntervenantById(Number(id));
    return NextResponse.json(intervenant);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}