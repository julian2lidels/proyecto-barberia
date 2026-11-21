import time
import logging
from sqlalchemy import text
from src.config.database import engine, Base, SessionLocal
from src.models import Usuario
from src.auth import hashear_password

def esperar_base_de_datos():
    for intento in range(1, 31):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except Exception as e:
            logging.warning(f"Esperando PostgreSQL ({intento}/30): {e}")
            time.sleep(2)
    raise RuntimeError("No fue posible conectar con PostgreSQL")

def inicializar():
    esperar_base_de_datos()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(Usuario).filter(Usuario.username == "admin").first():
            db.add(Usuario(
                username="admin",
                password_hash=hashear_password("admin123"),
                rol="admin"
            ))
            db.commit()
    finally:
        db.close()