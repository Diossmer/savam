import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Asegurar que el directorio de logs existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

class Logger {
  private writeToFile(filename: string, message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const filePath = path.join(logsDir, filename);

    fs.appendFileSync(filePath, logMessage, 'utf8');
    // También mostrar en consola para desarrollo
    console.log(logMessage.trim());
  }

  usuario(message: string, data?: any) {
    const extra = data ? ` - Data: ${JSON.stringify(data)}` : '';
    this.writeToFile('Usuario.txt', `[USUARIO] ${message}${extra}`);
  }

  sistema(message: string) {
    this.writeToFile('Sistema.txt', `[SISTEMA] ${message}`);
  }

  error(message: string, error?: any) {
    const errorDetail = error instanceof Error ? error.stack : JSON.stringify(error);
    this.writeToFile('Errores.txt', `[ERROR] ${message} - Detalle: ${errorDetail}`);
  }
}

export const logger = new Logger();
