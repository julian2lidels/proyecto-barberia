from datetime import date, datetime, time, timedelta
from typing import List, Tuple

from sqlalchemy.orm import Session

from src.models import Cita


def limpiar_telefono(telefono: str) -> str:
    return "".join(ch for ch in telefono if ch.isdigit() or ch == "+")


def rango_del_dia(fecha: date) -> Tuple[datetime, datetime]:
    desde = datetime.combine(fecha, time.min)
    return desde, desde + timedelta(days=1)


def rangos_ocupados(db: Session, id_barbero: int, fecha: date) -> List[Tuple[datetime, datetime]]:
    """Horarios ya tomados (citas no canceladas) de un barbero en un día."""
    desde, hasta = rango_del_dia(fecha)
    citas = (
        db.query(Cita)
        .filter(
            Cita.id_barbero == id_barbero,
            Cita.estado != "cancelada",
            Cita.inicio >= desde,
            Cita.inicio < hasta,
        )
        .all()
    )
    return [(c.inicio, c.fin) for c in citas]


def cita_a_dict(c: Cita) -> dict:
    return {
        "id": c.id,
        "inicio": c.inicio.isoformat(),
        "fin": c.fin.isoformat(),
        "estado": c.estado,
        "notas": c.notas,
        "cliente_nombre": c.cliente.nombre,
        "cliente_telefono": c.cliente.telefono,
        "barbero_id": c.id_barbero,
        "barbero_nombre": c.barbero.nombre,
        "servicio_nombre": c.servicio.nombre,
        "servicio_precio": c.servicio.precio,
    }
