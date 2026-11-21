from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from src.auth import solo_admin
from src.config.database import get_db
from src.config.settings import ahora
from src.models import Barbero, Cita, Cliente, Servicio, Usuario
from src.schemas import BarberoIn, BarberoUpdate, ServicioIn, ServicioOut
from src.security import hash_password
from src.citas_util import rango_del_dia

router = APIRouter(prefix="/api/admin", tags=["Administración"], dependencies=[Depends(solo_admin)])


# ---------- Resumen ----------
@router.get("/resumen")
def resumen(db: Session = Depends(get_db)):
    hoy = ahora()
    desde, hasta = rango_del_dia(hoy.date())
    inicio_mes = datetime(hoy.year, hoy.month, 1)

    citas_hoy = (
        db.query(func.count(Cita.id))
        .filter(Cita.inicio >= desde, Cita.inicio < hasta, Cita.estado != "cancelada")
        .scalar()
    )
    pendientes = (
        db.query(func.count(Cita.id)).filter(Cita.estado == "pendiente", Cita.inicio >= desde).scalar()
    )
    clientes = db.query(func.count(Cliente.id)).scalar()
    ingresos = (
        db.query(func.coalesce(func.sum(Servicio.precio), 0))
        .select_from(Cita)
        .join(Servicio, Servicio.id == Cita.id_servicio)
        .filter(Cita.estado == "completada", Cita.inicio >= inicio_mes)
        .scalar()
    )
    return {
        "citas_hoy": int(citas_hoy or 0),
        "pendientes": int(pendientes or 0),
        "clientes": int(clientes or 0),
        "ingresos_mes": int(ingresos or 0),
    }


# ---------- Servicios ----------
@router.get("/servicios", response_model=List[ServicioOut])
def todos_los_servicios(db: Session = Depends(get_db)):
    return db.query(Servicio).order_by(Servicio.nombre).all()


@router.post("/servicios", response_model=ServicioOut, status_code=201)
def crear_servicio(datos: ServicioIn, db: Session = Depends(get_db)):
    if db.query(Servicio).filter(Servicio.nombre == datos.nombre.strip()).first():
        raise HTTPException(status_code=409, detail="Ya existe un servicio con ese nombre")
    servicio = Servicio(**{**datos.model_dump(), "nombre": datos.nombre.strip()})
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio


@router.put("/servicios/{id_servicio}", response_model=ServicioOut)
def editar_servicio(id_servicio: int, datos: ServicioIn, db: Session = Depends(get_db)):
    servicio = db.get(Servicio, id_servicio)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    repetido = (
        db.query(Servicio)
        .filter(Servicio.nombre == datos.nombre.strip(), Servicio.id != id_servicio)
        .first()
    )
    if repetido:
        raise HTTPException(status_code=409, detail="Ya existe un servicio con ese nombre")
    for campo, valor in datos.model_dump().items():
        setattr(servicio, campo, valor.strip() if campo == "nombre" else valor)
    db.commit()
    db.refresh(servicio)
    return servicio


# ---------- Barberos ----------
def _barbero_dict(b: Barbero, usuario: str = None) -> dict:
    return {
        "id": b.id,
        "nombre": b.nombre,
        "telefono": b.telefono,
        "especialidad": b.especialidad,
        "activo": b.activo,
        "usuario": usuario,
    }


@router.get("/barberos")
def todos_los_barberos(db: Session = Depends(get_db)):
    accesos = {
        u.id_barbero: u.usuario
        for u in db.query(Usuario).filter(Usuario.id_barbero.isnot(None)).all()
    }
    return [_barbero_dict(b, accesos.get(b.id)) for b in db.query(Barbero).order_by(Barbero.nombre).all()]


@router.post("/barberos", status_code=201)
def crear_barbero(datos: BarberoIn, db: Session = Depends(get_db)):
    if bool(datos.usuario) != bool(datos.password):
        raise HTTPException(status_code=400, detail="Para dar acceso al panel envía usuario y contraseña")
    if datos.usuario and db.query(Usuario).filter(Usuario.usuario == datos.usuario.strip()).first():
        raise HTTPException(status_code=409, detail="Ese nombre de usuario ya existe")

    barbero = Barbero(
        nombre=datos.nombre.strip(),
        telefono=datos.telefono,
        especialidad=datos.especialidad,
        activo=datos.activo,
    )
    db.add(barbero)
    db.flush()
    if datos.usuario:
        db.add(
            Usuario(
                usuario=datos.usuario.strip(),
                password_hash=hash_password(datos.password),
                rol="barbero",
                id_barbero=barbero.id,
            )
        )
    db.commit()
    db.refresh(barbero)
    return _barbero_dict(barbero, datos.usuario)


@router.put("/barberos/{id_barbero}")
def editar_barbero(id_barbero: int, datos: BarberoUpdate, db: Session = Depends(get_db)):
    barbero = db.get(Barbero, id_barbero)
    if not barbero:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(barbero, campo, valor)
    db.commit()
    db.refresh(barbero)
    acceso = db.query(Usuario).filter(Usuario.id_barbero == barbero.id).first()
    return _barbero_dict(barbero, acceso.usuario if acceso else None)


# ---------- Clientes ----------
@router.get("/clientes")
def listar_clientes(db: Session = Depends(get_db)):
    totales = dict(db.query(Cita.id_cliente, func.count(Cita.id)).group_by(Cita.id_cliente).all())
    return [
        {
            "id": c.id,
            "nombre": c.nombre,
            "telefono": c.telefono,
            "email": c.email,
            "total_citas": int(totales.get(c.id, 0)),
        }
        for c in db.query(Cliente).order_by(Cliente.nombre).all()
    ]
