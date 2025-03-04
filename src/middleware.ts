import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Para evitar problemas con localStorage en el servidor, usaremos solo cookies para el middleware
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Rutas que siempre deben ser accesibles (públicas)
  const isPublicRoute = [
    "/login",
    "/_next",
    "/api",
    "/favicon.ico",
  ].some(path => request.nextUrl.pathname.startsWith(path));

  // Solo aplicamos la redirección si no es una ruta pública y no hay token
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token y está en login, redirigir a home
  if (token && isLoginPage) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};