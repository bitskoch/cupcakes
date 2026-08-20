import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/admin/categorias"
        className="rounded-lg border border-border bg-card p-6 hover:bg-accent"
      >
        <h2 className="font-semibold">Categorías</h2>
        <p className="text-sm text-muted-foreground">
          Crea y ordena las categorías del catálogo (bocaditos, dulces salados, tortas...).
        </p>
      </Link>
      <Link
        href="/admin/productos"
        className="rounded-lg border border-border bg-card p-6 hover:bg-accent"
      >
        <h2 className="font-semibold">Productos</h2>
        <p className="text-sm text-muted-foreground">
          Carga productos con imagen, descripción y precio, asignados a una categoría.
        </p>
      </Link>
    </div>
  );
}
