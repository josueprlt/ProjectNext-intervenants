import { JsonObject } from 'next-auth/adapters';
import db from './db';
import { v4 as uuidv4 } from 'uuid';

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
        console.error("Erreur lors de la récupération de l'intervant", err);
        throw err;
    } finally {
        client.release();
    }
}

export async function addIntervenant(data: { firstname: string; name: string; email: string; creationdate: Date; enddate: Date; key: string; availability: string }) {
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

export async function regenerateKeyIntervenantById(id: number, data: { key: string }) {
    const client = await db.connect();
    try {
        const query = `UPDATE intervenants SET key = $1 WHERE id = $2 RETURNING *;`;

        const values = [
            data.key,
            id,
        ];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            console.error(`Aucun intervenant trouvé avec l'ID ${id}`);
            throw new Error('Intervenant non trouvé');
        }

        console.log(`Clé régénérée avec succès pour l'intervenant ID ${id}`);
        return result.rows[0]; // Retourne l'intervenant mis à jour
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l’intervenant:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function regenerateAllKeysIntervenants() {
    const client = await db.connect();
    try {
        // Récupérer tous les intervenants
        const querySelect = `SELECT id FROM intervenants;`;
        const result = await client.query(querySelect);

        if (result.rowCount === 0) {
            console.error('Aucun intervenant trouvé.');
            throw new Error('Pas d\'intervenants dans la base de données');
        }

        const intervenants = result.rows;

        // Mise à jour des clés
        const updates = intervenants.map(async (intervenant) => {
            const newKey = uuidv4(); // Générer une nouvelle clé unique
            const queryUpdate = `UPDATE intervenants SET key = $1 WHERE id = $2 RETURNING *;`;
            const values = [newKey, intervenant.id];
            const updateResult = await client.query(queryUpdate, values);

            if (updateResult.rowCount === 0) {
                console.error(`Impossible de mettre à jour l'intervenant avec l'ID ${intervenant.id}`);
            } else {
                console.log(`Clé régénérée avec succès pour l'intervenant ID ${intervenant.id}`);
            }
            return updateResult.rows[0]; // Retourne l'intervenant mis à jour
        });

        // Attendre que toutes les mises à jour soient terminées
        await Promise.all(updates);

        console.log('Toutes les clés ont été régénérées avec succès.');
        return { success: true };
    } catch (err) {
        console.error('Erreur lors de la régénération des clés des intervenants:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function getIntervenantByKey(key: string) {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT * FROM intervenants WHERE key = $1', [key]);
        if (result.rowCount === 0) {
            throw new Error('Intervenant non trouvé');
        }
        return result.rows[0];
    } catch (err) {
        console.error("Erreur lors de la récupération de l'intervant", err);
        throw err;
    } finally {
        client.release();
    }
}


export async function saveAvailability(data: any) {
    const client = await db.connect();
    try {
        const result = await client.query(
            'UPDATE intervenants SET availability = $2 WHERE email = $1 RETURNING *',
            [data.email, JSON.stringify(data.events)]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Erreur lors de la sauvegarde', err);
        throw err;
    } finally {
        client.release();
    }
}