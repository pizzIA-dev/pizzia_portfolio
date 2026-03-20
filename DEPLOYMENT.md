# Guía de Despliegue a Producción (PizzIA)

Esta guía te ayudará a subir el proyecto a **GitHub**, el backend a **Railway**, las imágenes a **Cloudinary**, y el frontend a **Vercel**, todo de manera gratuita.

---

## 1. Subir Código a GitHub
Antes de nada, el código local ya está versionado. Solo necesitas subirlo a tu repositorio de `pizzIA-dev`.

1.  Ve a [github.com](https://github.com) y crea un **nuevo repositorio vacío** (p.ej. `pizzia-portfolio`). NO marques "Add README" ni ".gitignore" (ya los tenemos).
2.  Abre tu terminal en la carpeta raíz del proyecto (`F:\PizzIA\2026\ANTIGRAVITY`).
3.  Ejecuta los comandos que te da GitHub, que serán similares a estos:
    ```bash
    git branch -M master
    git remote add origin https://github.com/pizzIA-dev/TU_NUEVO_REPO.git
    git push -u origin master
    ```

---

## 2. Bases de Datos e Imágenes (Cloudinary)
**Cloudinary** alojará las imágenes subidas desde el panel de administrador.
1.  Crea una cuenta en [Cloudinary](https://cloudinary.com/).
2.  Ve a tu Dashboard, busca tu **API Environment variable** (empieza con `cloudinary://...`).
3.  Copia esta URL guardándola a mano para el siguiente paso.

---

## 3. Despliegue del Backend (Railway)
**Railway** alojará el servidor Django y la base de datos PostgreSQL automáticamente.
1.  Ve a [railway.app](https://railway.app/) y crea una cuenta con GitHub.
2.  Haz clic en **New Project** → **Deploy from GitHub repo** y elige tu repositorio `pizzia-portfolio`.
3.  *(Importante)* Railway detectará que es un proyecto mixto. **Dile a Railway que el Root Directory del backend es `/` o añádelo así.**
4.  Crea una **Base de Datos PostgreSQL** dentro de Railway (New → Database → PostgreSQL).
5.  Ve a la configuración del despliegue de Django (Settings → Variables) y añade:
    *   `DATABASE_URL`: Elige la que te da el Postgres de Railway.
    *   `SECRET_KEY`: Una cadena de texto alfanumérica muy larga y aleatoria.
    *   `DJANGO_ENV`: `production`
    *   `ALLOWED_HOSTS`: `*` (o el dominio temporal que te dé Railway).
    *   `CLOUDINARY_URL`: La URL que sacaste de Cloudinary.
    *   `CORS_ALLOWED_ORIGINS`: Déjalo vacío de momento, luego pondrás aquí el link de Vercel.
6.   Railway compilará el código, ejecutará `requirements.txt` y arrancará tu servidor. (Nota: Una vez desplegado, tendrás que ejecutar `python manage.py createsuperuser` en la consola de Railway para volver a crear tu usuario en PostgreSQL).

---

## 4. Despliegue del Frontend (Vercel)
**Vercel** alojará la web y el minijuego de React.
1.  Ve a [vercel.com](https://vercel.com/) y entra con GitHub.
2.  Haz clic en **Add New Project** y selecciona tu repositorio `pizzia-portfolio`.
3.  Vercel detectará mágicamente que es un proyecto Vite/React en la carpeta `/frontend`. Si no lo hace, asigna `frontend` como **Root Directory**.
4.  Abre el apartado **Environment Variables** y añade:
    *   `VITE_API_URL`: Aquí debes poner la **URL pública que te dio Railway para el backend** (p.ej. `https://pizzia-backend.up.railway.app`).
5.  Haz clic en **Deploy**.

¡Felicidades! Una vez desplegado, puedes volver a Railway en su sección de `CORS_ALLOWED_ORIGINS` y poner la URL que te dio Vercel (p.ej. `https://pizzia-frontend.vercel.app`) para asegurar la conexión.
