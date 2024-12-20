import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
    return NextResponse.json({ message: 'Token valide', user: decodedToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
