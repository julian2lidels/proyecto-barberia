import logging
import time

from sqlalchemy import text
from sqlalchemy.orm import Session

from src.config.database import Base, SessionLocal, engine
from src.config.settings import ADMIN_PASSWORD, ADMIN_USER
from src.models import Barbero, Servicio, Usuario
from src.security import hash_password, verify_password

SERVICIOS_INICIALES = [
    ("Corte clásico", "Corte a tijera o máquina con acabado a navaja", 25000, 30),
    ("Barba", "Perfilado y arreglo de barba con toalla caliente", 20000, 30),
    ("Corte + barba", "Combo completo de corte y barba", 40000, 60),
    ("Corte niño", "Para menores de 12 años", 18000, 30),
    ("Afeitado clásico", "Afeitado con navaja y toalla caliente", 22000, 30),
]

BARBEROS_INICIALES = [
    ("Carlos", "Fade y cortes modernos"),
    ("Andrés", "Barba y afeitado clásico"),
    ("Miguel", "Cortes clásicos y niños"),
]


def esperar_base_de_datos(intentos: int = 30, pausa: int = 2) -> None:
    """En OpenShift MySQL puede tardar en arrancar: reintenta antes de rendirse."""
    for n in range(1, intentos + 1):
        try:
            with engine.connect() as conexion:
                conexion.execute(text("SELECT 1"))
            return
        except Exception as e:
            logging.warning("Esperando la base de datos (%s/%s): %s", n, intentos, e)
            time.sleep(pausa)
    raise RuntimeError("No fue posible conectar con la base de datos")


def sembrar(db: Session) -> None:
    # El administrador siempre coincide con ADMIN_USER / ADMIN_PASSWORD (Secret en OpenShift):
    # si cambias la clave en el Secret y reinicias el backend, la nueva clave queda activa.
    admin = db.query(Usuario).filter(Usuario.usuario == ADMIN_USER).first()
    if not admin:
        db.add(Usuario(usuario=ADMIN_USER, password_hash=hash_password(ADMIN_PASSWORD), rol="admin"))
    else:
        admin.rol = "admin"
        if not verify_password(ADMIN_PASSWORD, admin.password_hash):
            admin.password_hash = hash_password(ADMIN_PASSWORD)
    if db.query(Servicio).count() == 0:
        for nombre, descripcion, precio, duracion in SERVICIOS_INICIALES:
            db.add(Servicio(nombre=nombre, descripcion=descripcion, precio=precio, duracion_min=duracion))
    if db.query(Barbero).count() == 0:
        for nombre, especialidad in BARBEROS_INICIALES:
            db.add(Barbero(nombre=nombre, especialidad=especialidad))
    db.commit()


def inicializar() -> None:
    esperar_base_de_datos()
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        sembrar(db)
