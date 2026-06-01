# Logos de Trayectoria Profesional

Agrega aquí los logos de las empresas (formato `.png`, `.jpg`, `.svg`, etc.).
Luego, asegúrate de actualizar el arreglo `LOGOS` en `frontend/src/pages/LandingPage.jsx` con el nombre de archivo y la empresa.

Ejemplo:
Si subes `bcp.png`, agrega esto en `LandingPage.jsx`:
```js
const LOGOS = [
  { file: 'bcp.png', name: 'BCP' },
  // ...
];
```

**Nota sobre Vercel/Railway:** Al ser archivos estáticos, debes commitear y subir estas imágenes al repositorio para que aparezcan en producción.
