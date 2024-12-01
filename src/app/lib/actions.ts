'use server';

import { signIn } from 'next-auth/react'; // Assure-toi que l'importation est correcte
import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // 1. Validation des champs du formulaire
    const validatedFields = SignupFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten() };
    }

    // 2. Préparer les données pour l'insertion dans la base de données
    const { email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insérer l'utilisateur dans la base de données
    const data = await db.query(`
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id
  `, [email, hashedPassword]);

    const user = data.rows[0];

    if (!user) {
        return {
            message: 'Une erreur s\'est produite lors de la création de votre compte.',
        };
    }

    // 4. Authentifier l'utilisateur
    try {
        const result = await signIn('credentials', {
            redirect: false, // Pour éviter une redirection automatique
            email,
            password,
        });

        if (!result || !result.ok) {
            return 'Invalid credentials.';
        }
    } catch (error) {
        console.error('Failed to sign in:', error);
        return 'Something went wrong.';
    }
}
