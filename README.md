# Proforma App

Catálogo de productos (bocaditos, dulces salados, tortas) con generación de proforma para el cliente, y panel administrador para gestionar categorías y productos.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind + shadcn/ui · Prisma · PostgreSQL (Supabase) · Zustand

## Desarrollo local (sin Supabase todavía)

Trabajamos con PostgreSQL instalado nativamente en Windows (sin Docker/WSL). El `schema.prisma`
usa el mismo provider (`postgresql`) que usaremos en producción con Supabase, así que migrar más
adelante es solo cambiar el `.env`.

### 1. Instalar PostgreSQL

Descarga el instalador desde https://www.postgresql.org/download/windows/, instálalo dejando el
puerto por defecto (5432) y anota el password que le pongas al usuario `postgres`.

Luego crea la base de datos del proyecto con "SQL Shell (psql)" (viene con el instalador):

```sql
CREATE DATABASE proforma;
```

### 2. Instalación del proyecto

```bash
npm install
cp .env.example .env
```

Edita `.env` y reemplaza el password en `DATABASE_URL`/`DIRECT_URL` si no usaste `postgres`.

### 3. Crear las tablas

```bash
npm run db:push      # sincroniza prisma/schema.prisma -> Postgres local
npm run db:studio    # (opcional) explorador visual de la BD en http://localhost:5555
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`. El catálogo estará vacío hasta que carguemos categorías/productos
desde el panel admin (o `db:studio` mientras no exista el formulario).

> **Imágenes de producto**: por ahora el campo `imageUrl` acepta una URL directa (ej. subida a
> cualquier servicio, o una imagen pública de prueba). El upload real a Supabase Storage lo
> conectamos cuando migremos — el código en `lib/supabase.ts` ya está preparado, solo inactivo.

### Migrar a Supabase más adelante

1. Crear proyecto en Supabase, copiar las credenciales al `.env` (sección ya comentada)
2. `npm run db:push` (o `db:migrate`) contra la nueva `DATABASE_URL`
3. Crear el bucket público `products` en Storage
4. Nada del código cambia — solo variables de entorno

## Estructura del proyecto

```
prisma/schema.prisma        # Modelos: Category, Product
src/
  app/
    page.tsx                # Catálogo público (Server Component)
    api/categorias/         # CRUD categorías
    api/productos/          # CRUD productos
    admin/                  # Panel administrador (pendiente)
  components/
    catalog-client.tsx      # Orquesta tabs de categoría + grid + sidebar
    product-card.tsx        # Tarjeta de producto individual
    proforma-sidebar.tsx    # Lista de selección + total
    ui/                     # Componentes shadcn/ui
  lib/
    prisma.ts               # Cliente Prisma (singleton)
    supabase.ts             # Clientes Supabase (browser/server) para Storage
    store/useProforma.ts    # Estado global de la proforma (Zustand + persist)
  types/index.ts             # Schemas Zod + tipos compartidos
```

## Ya implementado

- ✅ Modelo de datos (Category, Product) en Prisma
- ✅ API REST: `GET/POST /api/categorias`, `PATCH/DELETE /api/categorias/[id]`, ídem `/api/productos`
- ✅ Catálogo público: tabs por categoría, grid de productos, sidebar de proforma con cantidad/total (persistido en localStorage)

## Pendiente (siguientes pasos sugeridos)

1. **Auth del admin** — login simple (NextAuth con credenciales) para proteger `/admin`
2. **Formularios admin** — crear/editar categorías y productos con React Hook Form + Zod
3. **Upload de imágenes** — subir a Supabase Storage desde el formulario de producto
4. **Exportar proforma** — botón "Generar proforma" → PDF o envío por WhatsApp
5. **Pulir UI** — pasar componentes `ui/` a los oficiales de shadcn (`npx shadcn@latest add button card input`, etc.)
