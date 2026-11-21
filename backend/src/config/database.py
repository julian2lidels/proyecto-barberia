import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()


def _crear_engine():
    # DATABASE_URL es opcional: sirve para desarrollo local con SQLite.
    url_directa = os.getenv("DATABASE_URL")
    if url_directa:
        args = {"check_same_thread": False} if url_directa.startswith("sqlite") else {}
        return create_engine(url_directa, connect_args=args)

    # URL.create escapa bien contraseñas con caracteres especiales (@, :, /)
    url = URL.create(
        "mysql+mysqlconnector",
        username=os.getenv("DB_USER", "barberuser"),
        password=os.getenv("DB_PASS", "password"),
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "barberia"),
    )
    return create_engine(url, pool_pre_ping=True, pool_size=5, pool_recycle=1800)


engine = _crear_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
