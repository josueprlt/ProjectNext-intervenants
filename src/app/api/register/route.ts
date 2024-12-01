import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import db from '@/app/lib/db'; // Assure-toi que le chemin est correct
import { SignupFormSchema } from '@/app/lib/definitions';

export async function POST(request: Request) {
    const formData = await request.json();

    // 1. Validation des champs du formulaire
    const validatedFields = SignupFormSchema.safeParse(formData);
    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten();
        return NextResponse.json({ errors }, { status: 400 });
    }

    // 2. Préparer les données pour l'insertion dans la base de données
    const { email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insérer l'utilisateur dans la base de données
    try {
        const data = await db.query(`
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id
    `, [email, hashedPassword]);

        const user = data.rows[0];

        if (!user) {
            return NextResponse.json({ message: 'Une erreur s\'est produite lors de la création de votre compte.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Utilisateur créé avec succès', user }, { status: 201 });
    } catch (error) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
