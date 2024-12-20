import { deleteIntervenantById } from '@/app/lib/data';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log(`ID reçu : ${id}`); // Ajout de log pour vérifier l'ID
    try {
        const result = await deleteIntervenantById(Number(id));
        return new Response(JSON.stringify({ message: 'Intervenant supprimé' }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
    }
}