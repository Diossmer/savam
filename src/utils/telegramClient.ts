import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

// Cargar variables de entorno
process.loadEnvFile();

const apiId = parseInt(process.env.TELEGRAM_API_ID || "");
const apiHash = process.env.TELEGRAM_API_HASH || "";
const stringSession = new StringSession(process.env.TELEGRAM_STRING_SESSION || "");

let client: TelegramClient | null = null;

export async function getTelegramClient() {
  if (!client) {
    if (!apiId || !apiHash) {
      throw new Error("TELEGRAM_API_ID y TELEGRAM_API_HASH son requeridos");
    }

    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.connect();
  }
  return client;
}

export async function disconnectTelegramClient() {
  if (client) {
    await client.disconnect();
    client = null;
  }
}
