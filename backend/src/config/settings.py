import os
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.getenv("SECRET_KEY", "cambia-esta-clave-en-produccion")
TOKEN_HORAS = int(os.getenv("TOKEN_HORAS", "12"))

ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# Horario de atención y tamaño de cada turno (minutos)
HORA_APERTURA = int(os.getenv("HORA_APERTURA", "9"))
HORA_CIERRE = int(os.getenv("HORA_CIERRE", "19"))
PASO_MIN = int(os.getenv("PASO_MIN", "30"))

# Zona horaria de la barbería (Colombia = UTC-5). Las citas se guardan en hora local.
ZONA = timezone(timedelta(hours=int(os.getenv("TZ_OFFSET_HORAS", "-5"))))


def ahora() -> datetime:
    """Hora actual de la barbería, sin zona horaria (naive)."""
    return datetime.now(ZONA).replace(tzinfo=None)
