import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    // Recherche de l'utilisateur dans la base de données
    const result = await db.query('SELECT id, email, password FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const user = result.rows[0];

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    // Création du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Clé secrète (variable d'env obligatoire)
      { expiresIn: '7d' } // Durée de validité
    );

    // Configuration du cookie avec le token
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict;`;

    // Envoi de la réponse avec le cookie
    const response = NextResponse.json({ message: 'Connexion réussie' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}