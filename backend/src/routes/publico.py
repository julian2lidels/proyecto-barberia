from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.citas_util import cita_a_dict, limpiar_telefono, rangos_ocupados
from src.config.database import get_db
from src.config.settings import HORA_APERTURA, HORA_CIERRE, PASO_MIN, ahora
from src.horarios import generar_horarios, hay_cruce, horario_valido
from src.models import Barbero, Cita, Cliente, Servicio
from src.schemas import BarberoOut, CitaCrear, ServicioOut

router = APIRouter(prefix="/api", tags=["Público"])


@router.get("/servicios", response_model=List[ServicioOut])
def listar_servicios(db: Session = Depends(get_db)):
    return db.query(Servicio).filter(Servicio.activo.is_(True)).order_by(Servicio.nombre).all()


@router.get("/barberos", response_model=List[BarberoOut])
def listar_barberos(db: Session = Depends(get_db)):
    return db.query(Barbero).filter(Barbero.activo.is_(True)).order_by(Barbero.nombre).all()


def _servicio_y_barbero(db: Session, id_servicio: int, id_barbero: int):
    servicio = db.get(Servicio, id_servicio)
    barbero = db.get(Barbero, id_barbero)
    if not servicio or not servicio.activo:
        raise HTTPException(status_code=404, detail="El servicio no está disponible")
    if not barbero or not barbero.activo:
        raise HTTPException(status_code=404, detail="El barbero no está disponible")
    return servicio, barbero


@router.get("/disponibilidad")
def disponibilidad(id_barbero: int, id_servicio: int, fecha: date, db: Session = Depends(get_db)):
    """Horas libres de un barbero en una fecha para el servicio elegido."""
    servicio, barbero = _servicio_y_barbero(db, id_servicio, id_barbero)
    horarios = generar_horarios(
        fecha,
        servicio.duracion_min,
        HORA_APERTURA,
        HORA_CIERRE,
        PASO_MIN,
        rangos_ocupados(db, barbero.id, fecha),
        ahora(),
    )
    return {"fecha": fecha.isoformat(), "horarios": horarios}


@router.post("/citas", status_code=201)
def reservar_cita(datos: CitaCrear, db: Session = Depends(get_db)):
    servicio, barbero = _servicio_y_barbero(db, datos.id_servicio, datos.id_barbero)

    inicio = datos.inicio.replace(tzinfo=None)
    fin = inicio + timedelta(minutes=servicio.duracion_min)

    if inicio <= ahora():
        raise HTTPException(status_code=400, detail="Elige una fecha y hora futuras")
    if not horario_valido(inicio, fin, HORA_APERTURA, HORA_CIERRE, PASO_MIN):
        raise HTTPException(status_code=400, detail="Ese horario está fuera de la jornada de atención")
    if hay_cruce(inicio, fin, rangos_ocupados(db, barbero.id, inicio.date())):
        raise HTTPException(status_code=409, detail="Ese horario ya fue tomado, elige otro")

    telefono = limpiar_telefono(datos.telefono)
    cliente = db.query(Cliente).filter(Cliente.telefono == telefono).first()
    if cliente:
        cliente.nombre = datos.nombre.strip()
        if datos.email:
            cliente.email = datos.email.strip()
    else:
        cliente = Cliente(nombre=datos.nombre.strip(), telefono=telefono, email=datos.email)
        db.add(cliente)
        db.flush()

    cita = Cita(
        id_cliente=cliente.id,
        id_barbero=barbero.id,
        id_servicio=servicio.id,
        inicio=inicio,
        fin=fin,
        estado="pendiente",
        notas=datos.notas,
    )
    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita_a_dict(cita)


@router.get("/citas/consulta")
def consultar_citas(telefono: str = Query(min_length=7, max_length=20), db: Session = Depends(get_db)):
    """Próximas citas de un cliente (solo datos básicos, sin información personal)."""
    cliente = db.query(Cliente).filter(Cliente.telefono == limpiar_telefono(telefono)).first()
    if not cliente:
        return []
    citas = (
        db.query(Cita)
        .filter(Cita.id_cliente == cliente.id, Cita.inicio >= ahora(), Cita.estado != "cancelada")
        .order_by(Cita.inicio)
        .limit(20)
        .all()
    )
    return [
        {
            "id": c.id,
            "inicio": c.inicio.isoformat(),
            "estado": c.estado,
            "servicio_nombre": c.servicio.nombre,
            "barbero_nombre": c.barbero.nombre,
        }
        for c in citas
    ]
