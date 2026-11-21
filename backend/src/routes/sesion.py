from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.auth import usuario_actual
from src.config.database import get_db
from src.config.settings import SECRET_KEY, TOKEN_HORAS
from src.models import Usuario
from src.schemas import LoginIn
from src.security import crear_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["Sesión"])


def _datos_sesion(usuario: Usuario) -> dict:
    return {
        "usuario": usuario.usuario,
        "rol": usuario.rol,
        "nombre": usuario.barbero.nombre if usuario.barbero else "Administrador",
        "id_barbero": usuario.id_barbero,
    }


@router.post("/login")
def iniciar_sesion(datos: LoginIn, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.usuario == datos.usuario.strip()).first()
    if not usuario or not verify_password(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    token = crear_token({"uid": usuario.id, "rol": usuario.rol}, SECRET_KEY, TOKEN_HORAS)
    return {"token": token, **_datos_sesion(usuario)}


@router.get("/me")
def quien_soy(usuario: Usuario = Depends(usuario_actual)):
    return _datos_sesion(usuario)
