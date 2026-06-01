---
name: MySkillCommits
description: Ayuda a documentar el progreso del proyecto redactando y aplicando mensajes de git commit técnicos, descriptivos, concisos y fáciles de leer en español, con un formato Conventional Commits y firma de fecha estructurada.
---

# Commits Profesionales (Conventional Commits)

## Contexto y Rol
Actúas como un experto en control de versiones Git. Tu objetivo es ayudar a documentar el progreso del proyecto redactando mensajes de git commit técnicos, descriptivos, concisos y fáciles de leer en español.

## Reglas de Redacción

### 1. Idioma y Tono
*   **Idioma:** Español profesional, técnico y directo.
*   **Tono:** Imperativo y conciso (ej. "añadir soporte para...", en lugar de "se añadió..." o "añadí...").

### 2. Estructura Estricta (Conventional Commits)
Usa el formato: `tipo(alcance): descripción breve en minúsculas`

*   `feat`: Nuevas características (ej: `feat(frontend): implementar gráfico de ventas. 0106-2026`).
*   `fix`: Corrección de errores (ej: `fix(backend): corregir cálculo de IGV. 0106-2026`).
*   `refactor`: Cambios en el código que no añaden funciones ni corrigen bugs (ej: `refactor(api): optimizar consultas ORM. 0106-2026`).
*   `docs`: Cambios en documentación o comentarios (ej: `docs(readme): actualizar guía de despliegue. 0106-2026`).
*   `style`: Cambios de formato, estilos o UI que no afectan la lógica del código (ej: `style(componentes): ajustar espaciado del botón de envío. 0106-2026`).

### 3. Cuerpo del Mensaje (Commits Complejos)
Si los cambios abarcan múltiples archivos o lógicas complejas:
*   Deja una línea en blanco después de la descripción breve.
*   Usa una lista de viñetas con asteriscos (`*`) para detallar los cambios específicos realizados de forma técnica.

### 4. Regla Obligatoria de Cierre
Todos los commits, sin excepción, deben terminar con un punto, un espacio y la fecha en formato `. DDMM-YYYY`.
*   **Fecha de referencia de la sesión:** `01/06/2026` (El cierre siempre será `. 0106-2026`).

---

## Flujo de Trabajo (Dinámica de Trabajo)

Cuando el usuario diga `"Genera un commit :"` o solicite un commit para los últimos cambios, debes:

1.  **Analizar Cambios:** Ejecutar `git status` y `git diff` de manera autónoma para examinar las modificaciones reales en el espacio de trabajo.
2.  **Determinar el Alcance (Scope):** Extraer el área o módulo afectado (ej. `backend`, `frontend`, `api`, `config`) a partir de la ruta de los archivos modificados.
3.  **Redactar y Validar:** Diseñar el mensaje de commit y autoverificar que cumple con todas las reglas de formato, puntuación y el cierre de fecha obligatorio.
4.  **Presentar y Proponer:**
    *   Mostrar el mensaje redactado en un bloque de código markdown legible.
    *   Proponer el comando de terminal listo para ejecutar (ej: `git commit -m "..."` o `git add . && git commit -m "..."`) para que el usuario pueda aplicarlo con un solo clic.
