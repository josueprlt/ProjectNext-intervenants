import { deleteIntervenantById } from '@/app/lib/data';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log(`ID reçu : ${id}`); // Ajout de log pour vérifier l'ID
    try {
        const result = await deleteIntervenantById(Number(id));
        console.log(`Résultat de la suppression : ${result}`); // Ajout de log pour vérifier le résultat
        return new Response(JSON.stringify({ message: 'Intervenant supprimé' }), { status: 200 });
    } catch (err) {
        console.error('Erreur lors de la suppression', err);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
    }
}