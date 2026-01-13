import { Router, Request, Response } from 'express';
import { chromium, Browser, Page } from 'playwright';

interface ValidacionWhatsApp {
  valido: boolean;
  titulo: string;
}

async function validarTelefonoWhatsApp(phone: string): Promise<ValidacionWhatsApp> {

  let browser: Browser | null = null;

  try {
    // IMPORTANTE: En entornos server/linux a veces faltan dependencias o se requiere no-sandbox
    // Asegúrate de haber ejecutado: npx playwright install chromium
    // Y instalar dependencias del sistema: npx playwright install-deps
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });



    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    const url = `https://api.whatsapp.com/send/?phone=${phone}&text&type=phone_number&app_absent=0`;

    // 'domcontentloaded' es más rápido y suficiente para ver si carga la interfaz básica
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Esperamos un tiempo prudente
    await page.waitForTimeout(5000);

    // WhatsApp muestra este texto cuando el número NO existe
    const mensajeError = "no existe en WhatsApp";

    // Buscamos si el cuerpo de la página contiene el mensaje de error
    const contenido = await page.content();
    const esInactivo = contenido.includes(mensajeError);

    // INTENTO DE EXTRACTOR DE NOMBRE / IDENTIFICADOR
    // Buscamos el H2 principal que suele contener el Nombre o el texto "Chatea en WhatsApp con..."
    let tituloPagina = "";
    try {
      const h2Element = await page.locator('h2');
      if (await h2Element.count() > 0) {
        tituloPagina = await h2Element.first().innerText();
      }
    } catch (e) {
      console.log("No se pudo extraer H2");
    }

    await browser.close();

    // Si dice "no existe", es inactivo (false)
    if (esInactivo) {
      return { valido: false, titulo: tituloPagina || "No existe" };
    }

    // Si no dice "no existe", asumimos que la página cargó el prompt de chat.
    // El usuario quiere distinguir entre "Nombre" y "Chatea con el numero..."
    return { valido: true, titulo: tituloPagina };
  } catch (error) {
    console.error("Error al validar con Playwright:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default (router: Router) => {
  router.post('/consultar-whatsapp', async (req: Request, res: Response) => {
    const { numero } = req.body;

    if (!numero) {
      return res.status(400).json({ status: 'error', message: 'El campo "numero" es requerido.' });
    }

    try {
      // Si el número no tiene el código de país (asumimos Venezuela 58), se lo agregamos
      let numeroValidar = numero;

      // Lógica simple de normalización para Venezuela
      if (numero.startsWith('04') || numero.startsWith('02')) {
        numeroValidar = '58' + numero.substring(1);
      }

      console.log(`[ConsultaRouter] Validando: ${numeroValidar}`);

      const resultado = await validarTelefonoWhatsApp(numeroValidar);

      const respuestaData = {
        numero_ingresado: numero,
        numero_formateado: numeroValidar,
        tiene_whatsapp: resultado.valido,
        titulo_pagina: resultado.titulo,
        fecha_consulta: new Date().toISOString()
      };

      if (resultado.valido) {
        return res.status(200).json({
          status: 'valido',
          message: `El número ${numero} tiene WhatsApp activo.`,
          data: respuestaData
        });
      } else {
        return res.status(200).json({
          status: 'invalido',
          message: `El número ${numero} NO tiene una cuenta de WhatsApp.`,
          data: respuestaData
        });
      }

    } catch (error: any) {
      console.error("[ConsultaRouter] Error interno:", error);
      // DEV MODE: Enviamos el error real para depurar
      return res.status(500).json({
        status: 'error',
        message: `Error interno: ${error.message || error}`
      });
    }
  });
};