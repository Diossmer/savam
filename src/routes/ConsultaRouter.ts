import { Router, Request, Response } from 'express';

// --- CONFIGURACIÓN ---
const WHATSAPP_ACCESS_TOKEN = 'EAAL9CodT7xsBQQzz96zN0nsFdPbM5QyYjOzxYCzMIBmb6Ej0U6eHCaGBUfxPqDrYDGteZCUWFOG9hz0QT4NYF9O07ERZByJ4PfhPFfTAgxncCWd8Vj86XtBgvtwAs7OD2sS7kFfxb0mIB2MAEgPkRXhrdBnlbDd5H2bT9GU1UPwQZBaTmMh2SB0X1HLs9bes9Voy64nNfiycWxl0SvrQwoameZC9GROnIdvHdd41ZBZAflN3CZBpWhPVSIGMTKpmg88uEOKUy06VZBZC0NI80YzgqIzQU';
// TODO: Reemplaza esto con tu ID de número de teléfono real (Obtenido en el Dashboard de Meta)
const PHONE_NUMBER_ID = '946340838565364';

export default (router: Router) => {

  router.post('/consultar-whatsapp', async (req: Request, res: Response) => {
    const { numero } = req.body;

    if (!numero || typeof numero !== 'string') {
      return res.status(400).json({ status: 'error', message: 'El campo "numero" es requerido.' });
    }

    const numeroFormateado = '58' + numero.trim().substring(1);

    // --- LÓGICA CORREGIDA: Usar WhatsApp Cloud API (Graph API) ---
    // NO usar api.whatsapp.com (eso es solo para abrir la app en el navegador/celular)
    // Documentación: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

    // Cuerpo de la petición para enviar la plantilla "hello_world"
    const requestBody = {
      messaging_product: "whatsapp",
      to: numeroFormateado,
      type: "template",
      template: {
        name: "hello_world", // La plantilla por defecto de Meta
        language: {
          code: "en_US"
        }
      }
    };

    console.log(`[WhatsApp] Intentando validar número ${numeroFormateado} enviando plantilla.`);

    try {
      const response = await fetch(url, {
        method: 'POST', // IMPORTANTE: La API de grafos requiere POST para enviar mensajes
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().then(
          (data) => {
            console.log(data);
            return data;
          }
        )
          .catch(() => ({}));
        const detallesMeta = errorData.error;
        console.error('[WhatsApp API Error]:', detallesMeta);

        // Error específico que indica que el número no tiene WhatsApp
        if (detallesMeta?.code === 131026) {
          return res.status(200).json({
            status: 'invalido',
            message: `El número ${numero} no tiene una cuenta de WhatsApp.`
          });
        }

        // Otros errores de la API de WhatsApp
        return res.status(response.status).json({
          status: 'error',
          message: detallesMeta?.message || 'Error en la API de WhatsApp.'
        });
      }

      console.log(response.status);

      // Si la respuesta es OK (2xx), significa que la API aceptó el envío.
      console.log(`[WhatsApp] Éxito. El número ${numeroFormateado} es un destinatario válido.`);
      return res.status(200).json({
        status: 'valido',
        message: `El número ${numero} tiene WhatsApp activo.`
      });

    } catch (error: any) {
      // Errores inesperados (ej. sin conexión a internet en el servidor, error de red)
      console.error('[Error Inesperado]:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor al procesar la consulta.'
      });
    }
  });
};