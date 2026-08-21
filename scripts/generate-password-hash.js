// Uso: npm run admin:hash -- "tuPasswordSecreto"
// Copia el resultado en ADMIN_PASSWORD_HASH dentro de .env
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run admin:hash -- "tuPasswordSecreto"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  // Next.js expande variables de entorno usando "$" y corrompe (vacía) cualquier valor
  // de .env que tenga varios "$" seguidos de dígitos, como un hash bcrypt normal
  // ("$2a$10$..."), sin importar comillas o escapes. Para evitarlo, guardamos el hash
  // codificado en Base64 (alfabeto sin "$") y lo decodificamos en src/lib/auth.ts.
  const encoded = Buffer.from(hash, "utf-8").toString("base64");
  console.log("\nAgrega esto a tu .env:\n");
  console.log(`ADMIN_PASSWORD_HASH_B64="${encoded}"\n`);
});
