# Barbería

Sistema web para una barbería: los clientes reservan citas en línea y el personal las gestiona desde un panel.

- **Clientes:** ven servicios y barberos, reservan eligiendo servicio, barbero, fecha y hora libre, y consultan sus próximas citas con su teléfono.
- **Barberos:** inician sesión y gestionan (confirmar, completar, cancelar) solo sus citas.
- **Administrador:** ve todas las citas, administra servicios, barberos (con su acceso al panel) y clientes, y ve un resumen del día y del mes.

Stack: **FastAPI + MySQL** (`backend/`) y **React + Vite + Tailwind** servido con **Nginx** (`frontend/`).
Las tablas y los datos iniciales (5 servicios, 3 barberos y el usuario administrador) se crean solos al arrancar el backend. El esquema completo también está en `database/init.sql` (opcional, para crear la base a mano o consultarla).

## Desarrollo local

Backend (con SQLite, sin necesitar MySQL):

```bash
cd backend
pip install -r requirements.txt
DATABASE_URL=sqlite:///./barberia.db uvicorn main:app --reload --port 8000
```

Frontend (en otra terminal; el proxy de Vite envía `/api` al puerto 8000):

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173. Acceso del personal en `/staff/login`: usuario `admin`, contraseña `admin123` (cámbiala con `ADMIN_PASSWORD`).
Para usar MySQL en local, copia `backend/.env.example` a `backend/.env` y ajusta los datos.

## Local con Docker (MySQL incluido)

Con Docker instalado, desde la raíz del proyecto:

```bash
docker compose up --build
```

Abre http://localhost:8080 (personal en `/staff/login`; la API en http://localhost:8000/docs).
Los datos quedan guardados en un volumen; `docker compose down -v` los borra.

Si solo quieres la base de datos y correr backend y frontend a mano:

```bash
docker compose up -d mysql
cd backend
DB_HOST=127.0.0.1 DB_USER=barberuser DB_PASS=barberclave123 DB_NAME=barberia uvicorn main:app --reload --port 8000
```

## Despliegue en OpenShift

Todo está en `openshift/barberia-openshift.yaml` (MySQL, backend, frontend y URL pública con HTTPS).

1. Edita el archivo: cambia las claves de los Secret `mysql-secret` y `app-secret`, y `ref: main` si tu rama se llama distinto.
2. Asegúrate de haber hecho `git push` de todo el código a GitHub.
3. Aplícalo:
   ```bash
   oc login --token=TU_TOKEN --server=URL_DEL_CLUSTER
   oc apply -f openshift/barberia-openshift.yaml
   ```
   O en la consola web: perspectiva **Developer** → **+** → **Import YAML**.
4. Revisa el avance y obtén la URL:
   ```bash
   oc get builds
   oc get pods
   oc get route frontend
   ```

Problemas frecuentes:

- Build en error: `oc logs build/backend-1` o `oc logs build/frontend-1`.
- Repo privado: agrega un Source Secret con tu token de GitHub al `source` de los BuildConfig.
- Tras subir cambios a GitHub: `oc start-build backend` / `oc start-build frontend`.
- El backend queda sin responder unos segundos al inicio mientras espera a MySQL; es normal.

## Variables del backend

| Variable | Para qué sirve | Por defecto |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | Conexión a MySQL | 127.0.0.1, 3306, barberuser, password, barberia |
| `DATABASE_URL` | Alternativa a lo anterior (ej. SQLite local) | — |
| `SECRET_KEY` | Firma de las sesiones | cámbiala en producción |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Administrador inicial | admin / admin123 |
| `HORA_APERTURA`, `HORA_CIERRE` | Horario de atención (24 h) | 9 y 19 |
| `TZ_OFFSET_HORAS` | Zona horaria de la barbería | -5 (Colombia) |
| `CORS_ORIGINS` | Orígenes permitidos (solo si el frontend está en otro dominio) | http://localhost:5173 |
