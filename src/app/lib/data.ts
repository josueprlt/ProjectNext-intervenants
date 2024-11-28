import db from './db';

// Fonction pour récupérer les intervenants
export async function getIntervenants() {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT * FROM intervenants');
        return result.rows;
    } catch (err) {
        console.error('Erreur lors de la récupération des intervenants', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function getIntervenantById(id: number) {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT * FROM intervenants WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('Intervenant non trouvé');
        }
        return result.rows[0];
    } catch (err) {
        console.error('Erreur lors de la suppression', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function addIntervenant(data: { firstname: string; name: string; email: string; creationdate: Date; enddate: Date; key: string; availability: boolean }) {
    const client = await db.connect();
    try {
        const result = await client.query(
            'INSERT INTO intervenants (firstname, name, email, creationdate, enddate, key, availability) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [data.firstname, data.name, data.email, data.creationdate, data.enddate, data.key, data.availability]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Erreur lors de l\'ajout', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function findUserByEmail(email: string) {
    const client = await db.connect();
    try {
        const result = await client.query(
            'SELECT * FROM intervenants WHERE email = $1',
            [email]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    } catch (err) {
        console.error('Erreur lors de la recherche de l\'email', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function deleteIntervenantById(id: number) {
    const client = await db.connect();
    try {
        const result = await client.query('DELETE FROM intervenants WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            throw new Error('Intervenant non trouvé');
        }
        return result.rows[0]; // Retourner l'intervenant supprimé, si nécessaire
    } catch (err) {
        console.error('Erreur lors de la suppression', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function updateIntervenantById(id: number, data: { firstname: string; name: string; email: string; enddate: Date; availability: string }) {
    const client = await db.connect();
    try {
        const query = `UPDATE intervenants SET firstname = $1, name = $2, email = $3, enddate = $4, availability = $5 WHERE id = $6 RETURNING *;`;

        const values = [
            data.firstname,
            data.name,
            data.email,
            data.enddate,
            data.availability,
            id,
        ];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            throw new Error('Intervenant non trouvé');
        }

        return result.rows[0]; // Retourne l'intervenant mis à jour
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l’intervenant:', err);
        throw err;
    } finally {
        client.release();
    }
}
