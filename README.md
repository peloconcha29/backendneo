# OpenRouter Backend Proxy

Este proyecto crea un servidor Express que actúa como proxy para la API de OpenRouter.

## Características
- Endpoint POST `/chat` para reenviar mensajes a OpenRouter.
- Protege tu clave API usando variables de entorno.
- Listo para subir a Railway.
- Compatible con frontend en Neocities.

## Variables de Entorno
Crea un archivo `.env` con esta variable:

```
OPENROUTER_API_KEY=tu_token_aqui
```

## Uso

```bash
npm install
npm start
```

El servidor escuchará en el puerto definido por `process.env.PORT || 3000`.
