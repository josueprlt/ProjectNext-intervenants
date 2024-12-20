import { getIntervenantByKey } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { key: string } }) {
  const { key } = params;
  console.log(`Key reçu : ${key}`); // Ajout de log pour vérifier l'ID
  try {
    const intervenant = await getIntervenantByKey(String(key));
    return NextResponse.json(intervenant);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}