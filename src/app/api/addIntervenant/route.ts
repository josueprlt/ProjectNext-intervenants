import { addIntervenant } from '@/app/lib/data';

export async function POST(request: Request) {
    try {
        const { firstname, name, email, creationdate, enddate, key, availability } = await request.json();
        console.log(`Données reçues : ${firstname}, ${name}, ${email}, ${creationdate}, ${enddate}, ${key}, ${availability}`);
        
        const result = await addIntervenant({ firstname, name, email, creationdate, enddate, key, availability });
        return new Response(JSON.stringify({ message: 'Intervenant ajouté', data: result }), { status: 201 });
    } catch (err) {
        console.error('Erreur serveur', err);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
    }
}