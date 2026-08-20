/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // NOTA: "**" acepta cualquier host https, útil mientras probamos con URLs externas.
    // Antes de ir a producción, reemplazar por el/los hostname(s) reales (ej. "*.supabase.co").
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
