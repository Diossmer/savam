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

    // WhatsApp muestra este texto cuando el número NO existe (ES y EN)
    const mensajesError = [
      "no existe en WhatsApp",
      "isn't on WhatsApp",
      "no está en WhatsApp"
    ];

    // Texto genérico a ignorar cuando lo encontramos en H2/H3
    const mensajesIgnorar = [
      "WhatsApp installed",
      "instalada la aplicación",
      "Chatea en WhatsApp con",
      "Chat on WhatsApp with"
    ];

    // Buscamos si el cuerpo de la página contiene el mensaje de error
    const contenido = await page.content();
    const esInactivo = mensajesError.some(msg => contenido.includes(msg));

    // EXTRACTOR DE INFORMACIÓN DE PERFIL MEJORADO
    let tituloPagina = "";
    let tieneImagen = false;

    try {
      // 1. Detectar imagen de perfil REAL (Solo las de pps.whatsapp.net son fotos de usuario)
      const imgSelector = 'img[src*="pps.whatsapp.net"]';
      const imgElement = page.locator(imgSelector).first();
      if (await imgElement.count() > 0) {
        tieneImagen = true;
      }

      // 2. Obtener el nombre (H3 o H2)
      const selectoresNombre = ['h3._9vd5', 'h2._9vd5', 'h3', 'h2'];

      for (const selector of selectoresNombre) {
        const elementos = page.locator(selector);
        const count = await elementos.count();

        for (let i = 0; i < count; i++) {
          const texto = await elementos.nth(i).innerText();
          const textoLimpio = texto?.trim() || "";

          if (textoLimpio) {
            // Verificamos si es un mensaje genérico de "Chatea con..."
            const esIgnorable = mensajesIgnorar.some(ignore =>
              textoLimpio.toLowerCase().includes(ignore.toLowerCase()) ||
              textoLimpio.toLowerCase().startsWith("chatea en whatsapp con") ||
              textoLimpio.toLowerCase().startsWith("chat on whatsapp with")
            );

            if (!esIgnorable) {
              tituloPagina = textoLimpio;
              break;
            } else if (!tituloPagina) {
              // Si es ignorable pero aún no tenemos nada, lo guardamos como backup por si acaso
              tituloPagina = textoLimpio;
            }
          }
        }
        if (tituloPagina && !mensajesIgnorar.some(ignore => tituloPagina.toLowerCase().includes(ignore.toLowerCase()))) {
          break;
        }
      }

    } catch (e) {
      console.error("Error al extraer info de perfil:", e);
    }

    await browser.close();

    // Si dice "no existe", es inactivo (false)
    if (esInactivo) {
      return { valido: false, titulo: "No existe" };
    }

    // 4. Determinar validez final
    // Si el título es genérico Y no tiene imagen real, es FALSO
    const esTituloGenerico = mensajesIgnorar.some(ignore =>
      tituloPagina.toLowerCase().includes(ignore.toLowerCase())
    );

    if (esTituloGenerico && !tieneImagen) {
      console.log(`[ConsultaRouter] Marcando como INACTIVO (genérico sin imagen): ${tituloPagina}`);
      return { valido: false, titulo: tituloPagina || "Sin identificar" };
    }

    // Si tiene imagen o el título no es genérico, es un perfil real
    return { valido: true, titulo: tituloPagina || "Sin identificar" };
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