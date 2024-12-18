import { saveAvailability, findUserByEmail } from '@/app/lib/data';

export async function POST(request) {
    try {
        const { events, email } = await request.json();
        console.log(`Données reçues : ${events}, ${email}`);

        // Vérifie si l'email existe déjà dans la base de données
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            // Si l'utilisateur n'existe pas, renvoie une erreur spécifique
            return new Response(
                JSON.stringify({ error: "Cet intervenant n'existe pas" }),
                { status: 400 } // 400 pour une mauvaise requête
            );
        }

        // Sauvegarder la disponibilité de l'intervenant
        const result = await saveAvailability({ events, email });
        return new Response(
            JSON.stringify({ message: "Disponibilité de l'intervenant sauvegardée", data: result }),
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