import { addIntervenant, findUserByEmail } from '@/app/lib/data';

export async function POST(request: Request) {
    try {
        const { firstname, name, email, creationdate, enddate, key, availability } = await request.json();
        console.log(`Données reçues : ${firstname}, ${name}, ${email}, ${creationdate}, ${enddate}, ${key}, ${availability}`);

        // Vérifie si l'email existe déjà dans la base de données
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            // Si l'email existe déjà, renvoie une erreur spécifique
            return new Response(
                JSON.stringify({ error: 'Email déjà utilisé' }),
                { status: 400 } // 400 pour une mauvaise requête
            );
        }

        // Si l'email est unique, on ajoute l'intervenant
        const result = await addIntervenant({ firstname, name, email, creationdate, enddate, key, availability });
        return new Response(
            JSON.stringify({ message: 'Intervenant ajouté', data: result }),
            { status: 201 }
        );
    } catch (err) {
        console.error('Erreur serveur', err);
        return new Response(
            JSON.stringify({ error: 'Erreur serveur' }),
            { status: 500 }
        );
    }
}