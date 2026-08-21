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

## Login del admin

El panel `/admin` está protegido con NextAuth (provider de credenciales, un solo usuario admin
definido por variables de entorno — no hay tabla `User`, es intencionalmente simple).

### 1. Generar el hash del password

```bash
npm run admin:hash -- "tuPasswordSecreto"
```

Copia el resultado (`ADMIN_PASSWORD_HASH_B64=...`) a tu `.env`.

> **⚠️ Importante:** Next.js corrompe (vacía) cualquier valor de `.env` con varios `$` seguidos
> de dígitos — como un hash bcrypt normal (`$2a$10$...`) — sin importar comillas o escapes. Por
> eso guardamos el hash codificado en Base64 (el script ya lo hace por ti) y lo decodificamos en
> `src/lib/auth.ts` antes de compararlo.

### 2. Generar el AUTH_SECRET

```bash
# En Git Bash / WSL / Mac / Linux:
openssl rand -base64 32

# En PowerShell (si no tienes openssl):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copia el resultado a `AUTH_SECRET` en tu `.env`.

### 3. Completar ADMIN_EMAIL

En `.env`, pon el email con el que vas a iniciar sesión (`ADMIN_EMAIL`).

### 4. Probar

```bash
npm run dev
```

Entra a `localhost:3000/admin` — te va a redirigir a `/login`. Ingresa con el email y password
(el password en texto plano, no el hash) que configuraste.



## Imágenes de producto (Supabase Storage)

El upload de imágenes usa Supabase **solo para Storage** — la base de datos sigue siendo tu
Postgres local, no hace falta migrarla.

1. Crea un proyecto gratis en https://supabase.com
2. Project Settings → API: copia `Project URL`, `anon public` key y `service_role` key a tu
   `.env` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
3. Storage → New bucket → nombre exacto `products`, márcalo como **público**
4. Reinicia `npm run dev`

El upload ocurre en el servidor (`/api/upload`, protegida por sesión de admin) usando la
`service_role` key — el navegador nunca toca esa key directamente.

## Ya implementado

- ✅ Modelo de datos (Category, Product) en Prisma
- ✅ API REST: `GET/POST /api/categorias`, `PATCH/DELETE /api/categorias/[id]`, ídem `/api/productos`
- ✅ Catálogo público: tabs por categoría, grid de productos, sidebar de proforma con cantidad/total (persistido en localStorage)
- ✅ Panel admin (`/admin`) con CRUD de categorías y productos
- ✅ Login del admin (NextAuth, provider de credenciales) protegiendo `/admin` y su API
- ✅ Upload de imágenes a Supabase Storage desde el formulario de producto

## Pendiente (siguientes pasos sugeridos)

1. **Exportar proforma** — botón "Generar proforma" → PDF o envío por WhatsApp
2. **Desplegar** — Supabase (base de datos, cuando decidas migrar) + Vercel (hosting)
3. **Pulir UI** — pasar componentes `ui/` a los oficiales de shadcn (`npx shadcn@latest add button card input`, etc.)
