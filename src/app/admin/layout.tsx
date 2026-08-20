import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/admin" className="font-semibold">
            Panel administrador
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/categorias" className="text-muted-foreground hover:text-foreground">
              Categorías
            </Link>
            <Link href="/admin/productos" className="text-muted-foreground hover:text-foreground">
              Productos
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Ver catálogo →
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
