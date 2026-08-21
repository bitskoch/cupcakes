export { default } from "next-auth/middleware";

// Protege el panel /admin y también la API que usa (categorías, productos, upload de
// imágenes): sin sesión, las páginas redirigen a /login y la API responde 401.
export const config = {
  matcher: ["/admin/:path*", "/api/categorias/:path*", "/api/productos/:path*", "/api/upload/:path*"],
};
