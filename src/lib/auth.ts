import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;

        if (!adminEmail || !hashB64) {
          throw new Error(
            "Admin no configurado: falta ADMIN_EMAIL o ADMIN_PASSWORD_HASH_B64 en .env"
          );
        }
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) return null;

        // El hash se guarda en Base64 en .env porque Next.js corrompe valores con "$"
        // (ver comentario en scripts/generate-password-hash.js).
        const passwordHash = Buffer.from(hashB64, "base64").toString("utf-8");

        const isValid = await bcrypt.compare(credentials.password, passwordHash);
        if (!isValid) return null;

        return { id: "admin", email: adminEmail };
      },
    }),
  ],
};
