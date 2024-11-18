import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM intervenants');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}