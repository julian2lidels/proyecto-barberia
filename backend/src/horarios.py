"""Lógica de horarios de las citas (sin dependencias de base de datos)."""
from datetime import date, datetime, time, timedelta
from typing import List, Tuple

Rango = Tuple[datetime, datetime]


def hay_cruce(inicio: datetime, fin: datetime, ocupados: List[Rango]) -> bool:
    return any(inicio < o_fin and fin > o_ini for o_ini, o_fin in ocupados)


def horario_valido(inicio: datetime, fin: datetime, apertura: int, cierre: int, paso: int) -> bool:
    """El turno debe empezar en una marca válida y terminar dentro del horario."""
    abre = datetime.combine(inicio.date(), time(apertura, 0))
    cierra = datetime.combine(inicio.date(), time(cierre, 0))
    minutos_desde_apertura = (inicio - abre).total_seconds() / 60
    return (
        inicio >= abre
        and fin <= cierra
        and fin.date() == inicio.date()
        and inicio.second == 0
        and minutos_desde_apertura % paso == 0
    )


def generar_horarios(
    fecha: date,
    duracion_min: int,
    apertura: int,
    cierre: int,
    paso: int,
    ocupados: List[Rango],
    ahora: datetime,
) -> List[str]:
    libres = []
    actual = datetime.combine(fecha, time(apertura, 0))
    limite = datetime.combine(fecha, time(cierre, 0))
    duracion = timedelta(minutes=duracion_min)
    while actual + duracion <= limite:
        fin = actual + duracion
        if actual > ahora and not hay_cruce(actual, fin, ocupados):
            libres.append(actual.strftime("%H:%M"))
        actual += timedelta(minutes=paso)
    return libres
