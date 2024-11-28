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
