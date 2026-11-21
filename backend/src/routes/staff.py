from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from src.auth import usuario_actual
from src.citas_util import cita_a_dict, rango_del_dia
from src.config.database import get_db
from src.models import Cita, Usuario
from src.schemas import Estado, EstadoIn

router = APIRouter(prefix="/api", tags=["Personal"])


@router.get("/citas")
def listar_citas(
    fecha: Optional[date] = None,
    estado: Optional[Estado] = None,
    usuario: Usuario = Depends(usuario_actual),
    db: Session = Depends(get_db),
):
    """El admin ve todas las citas; cada barbero solo las suyas."""
    q = db.query(Cita).options(
        joinedload(Cita.cliente), joinedload(Cita.barbero), joinedload(Cita.servicio)
    )
    if usuario.rol == "barbero":
        q = q.filter(Cita.id_barbero == usuario.id_barbero)
    if fecha:
        desde, hasta = rango_del_dia(fecha)
        q = q.filter(Cita.inicio >= desde, Cita.inicio < hasta)
    if estado:
        q = q.filter(Cita.estado == estado)
    return [cita_a_dict(c) for c in q.order_by(Cita.inicio).limit(500).all()]


@router.patch("/citas/{id_cita}")
def cambiar_estado(
    id_cita: int,
    datos: EstadoIn,
    usuario: Usuario = Depends(usuario_actual),
    db: Session = Depends(get_db),
):
    cita = db.get(Cita, id_cita)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    if usuario.rol == "barbero" and cita.id_barbero != usuario.id_barbero:
        raise HTTPException(status_code=403, detail="Esta cita no es tuya")
    cita.estado = datos.estado
    db.commit()
    db.refresh(cita)
    return cita_a_dict(cita)
