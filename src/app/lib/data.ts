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