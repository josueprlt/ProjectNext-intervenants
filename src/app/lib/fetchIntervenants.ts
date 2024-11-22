import { db } from "@/app/lib/db";
import { Intervenant } from "@/app/lib/definitions";

export async function fetchIntervenants(): Promise<Intervenant[]> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM "intervenants"');
    client.release();
    return result.rows as Intervenant[];
  } catch (e: any) {
    console.error('Error fetching intervenants: ', e);
    throw e;
  }
}