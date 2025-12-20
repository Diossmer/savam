# Librerías y Dependencias - SAVAM

Este documento detalla las librerías principales utilizadas en el proyecto y su propósito.

## Dependencias Principales

| Librería | Propósito |
| :--- | :--- |
| **Express** | Framework web para Node.js, utilizado para construir la API REST. |
| **Mongoose** | ODM (Object Data Modeling) para MongoDB y Node.js. |
| **TypeScript** | Superconjunto de JavaScript que añade tipado estático. |
| **JSON Web Token (JWT)** | Implementación de tokens para autenticación segura. |
| **BcryptJS** | Librería para el hashing de contraseñas. |
| **Helmet** | Ayuda a asegurar la aplicación Express configurando varios encabezados HTTP. |
| **CORS** | Middleware para permitir o restringir recursos solicitados desde otro dominio. |
| **Express Validator** | Conjunto de middlewares para la validación y saneamiento de datos. |
| **Morgan** | Middleware de registro de solicitudes HTTP para Node.js. |
| **Express Rate Limit** | Middleware para limitar las solicitudes repetidas a APIs. |

## Herramientas de Desarrollo

| Herramientas | Propósito |
| :--- | :--- |
| **tsx** | Ejecutor de TypeScript para Node.js (reemplazo moderno de ts-node). |
| **tsc-alias** | Reemplaza los alias de las rutas de TypeScript con rutas relativas después de la compilación. |
| **ts-node-dev** | Herramienta de desarrollo que reinicia el servidor cuando se detectan cambios. |

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática.
- `npm run build`: Compila el proyecto a JavaScript en la carpeta `dist/`.
- `npm start`: Inicia el servidor en producción utilizando los archivos compilados.
- `npm run clean`: Elimina la carpeta `dist/`.
