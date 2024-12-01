import { z } from 'zod';

// Définition du schéma de validation pour le formulaire d'inscription
export const SignupFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' })
        .trim(),
});

// Définition des types pour l'état du formulaire
export type FormState =
    | {
        errors?: {
            email?: string[];
            password?: string[];
        };
        message?: string;
    }
    | undefined;

export type User = { id: number; email: string; password: string; };