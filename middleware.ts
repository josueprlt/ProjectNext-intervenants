// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl;
//   const token = request.cookies.get('token')?.value;

//   if (url.pathname.startsWith('/dashboard')) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
//     } catch (error) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*'], // Matcher pour toutes les routes sous /dashboard
// };
