import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

process.loadEnvFile();

const apiId = parseInt(process.env.TELEGRAM_API_ID || "");
const apiHash = process.env.TELEGRAM_API_HASH || "";

if (!apiId || !apiHash) {
  console.error("Error: TELEGRAM_API_ID y TELEGRAM_API_HASH son requeridos en el archivo .env");
  process.exit(1);
}

(async () => {
  console.log("Iniciando generación de sesión de Telegram...");
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Ingresa tu número de teléfono (con código de país, ej: +58412...): "),
    password: async () => await input.text("Ingresa tu contraseña (si tienes 2FA activa): "),
    phoneCode: async () => await input.text("Ingresa el código que recibiste de Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("¡Sesión generada con éxito!");
  const sessionString = client.session.save();
  console.log("\n--- COPIA ESTA CADENA EN TU ARCHIVO .env ---");
  console.log(`TELEGRAM_STRING_SESSION=${sessionString}`);
  console.log("--------------------------------------------\n");

  await client.disconnect();
  process.exit(0);
})();
