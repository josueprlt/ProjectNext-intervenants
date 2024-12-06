import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  try {
    // Vérifie et décode le token avec la clé secrète
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Token invalide
  }
};