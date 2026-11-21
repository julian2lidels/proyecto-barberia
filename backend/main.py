import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import src.models  # noqa: F401  (registra las tablas)
from src.middlewares.error_handler import global_exception_handler
from src.routes import admin, publico, sesion, staff
from src.seed import inicializar


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Espera a MySQL, crea las tablas y carga datos iniciales la primera vez
    inicializar()
    yield


app = FastAPI(
    title="API Barbería",
    description="Reserva de citas, servicios, barberos y panel del personal",
    version="1.0.0",
    lifespan=lifespan,
)

# En OpenShift el frontend usa el mismo origen (Nginx hace proxy a /api), así que
# CORS solo hace falta en desarrollo o si el frontend vive en otro dominio.
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)

app.include_router(publico.router)
app.include_router(sesion.router)
app.include_router(staff.router)
app.include_router(admin.router)


@app.get("/")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Barbería operativa y conectada."}
