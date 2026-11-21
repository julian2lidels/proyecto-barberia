from typing import Optional

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.config.settings import SECRET_KEY
from src.models import Usuario
from src.security import leer_token


def usuario_actual(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> Usuario:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Debes iniciar sesión")
    datos = leer_token(authorization[7:].strip(), SECRET_KEY)
    if not datos:
        raise HTTPException(status_code=401, detail="Sesión inválida o vencida")
    usuario = db.get(Usuario, datos.get("uid"))
    if not usuario:
        raise HTTPException(status_code=401, detail="Sesión inválida")
    return usuario


def solo_admin(usuario: Usuario = Depends(usuario_actual)) -> Usuario:
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo el administrador puede hacer esto")
    return usuario
