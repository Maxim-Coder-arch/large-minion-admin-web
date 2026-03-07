import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🛡️ Middleware:', path);
  
  // Список публичных страниц (доступны без входа)
  const publicPaths = [
    '/login',           // страница входа
    '/api/admin/login', // API для входа
    '/_next',           // статика Next.js
    '/favicon.ico',     // иконка
  ];
  
  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  );
  
  // Если путь публичный - пропускаем
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Для всех остальных страниц проверяем авторизацию
  const adminToken = request.cookies.get('admin_token')?.value;
  
  if (adminToken === 'authenticated') {
    return NextResponse.next(); // есть кука - пускаем
  }
  
  // нет куки - редирект на логин
  console.log('🚫 Нет авторизации, редирект на /login');
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}