# Arquitectura del Proyecto - SAVAM

Este documento describe la estructura de carpetas y la organización del código en el proyecto SAVAM.

## Estructura de Carpetas

```text
savam/
├── src/
│   ├── config/         # Configuraciones globales (DB, CORS, Env, etc.)
│   ├── controllers/    # Lógica de manejo de peticiones HTTP
│   ├── middleware/     # Funciones intermedias (Auth, Validación, etc.)
│   ├── models/         # Definiciones de esquemas de Mongoose
│   ├── repositories/   # Capa de acceso a datos (Patrón Repository)
│   ├── routes/         # Definición de rutas de la API
│   ├── server/         # Punto de entrada y configuración del servidor
│   ├── services/       # Lógica de negocio compleja
│   ├── types/          # Definiciones de tipos y interfaces de TypeScript
│   └── app.ts          # Configuración principal de la aplicación Express
├── logs/               # Archivos de registro del sistema
├── .env                # Variables de entorno (No subir al repositorio)
├── package.json        # Dependencias y scripts del proyecto
└── tsconfig.json       # Configuración de TypeScript
```

## Responsabilidades por Capa

### `config/`
Contiene la configuración centralizada de la aplicación, incluyendo la validación de variables de entorno, configuración de seguridad (CORS, Helmet) y límites de peticiones.

### `controllers/`
Reciben las peticiones del cliente, extraen los datos necesarios y llaman a los servicios o repositorios correspondientes. Son responsables de enviar la respuesta HTTP final.

### `middleware/`
Contiene funciones que se ejecutan antes de llegar a los controladores, como la verificación de tokens JWT, manejo de errores global y validación de esquemas de entrada.

### `models/`
Define la estructura de los documentos en MongoDB utilizando Mongoose.

### `repositories/`
Implementa el patrón Repository para abstraer la lógica de persistencia de datos. Esto permite cambiar la base de datos o la librería de acceso a datos sin afectar la lógica de negocio.

### `routes/`
Define los endpoints de la API y asocia cada ruta con su controlador y middlewares correspondientes.

### `services/`
Contiene la lógica de negocio que no pertenece directamente a un repositorio o controlador. Suele coordinar múltiples repositorios o realizar operaciones complejas.

### `types/`
Centraliza las interfaces y tipos de TypeScript utilizados en todo el proyecto para asegurar la consistencia y el tipado fuerte.
