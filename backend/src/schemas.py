from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Estado = Literal["pendiente", "confirmada", "completada", "cancelada"]


# ---------- Servicios ----------
class ServicioIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    descripcion: Optional[str] = Field(default=None, max_length=200)
    precio: int = Field(gt=0)
    duracion_min: int = Field(default=30, ge=10, le=240)
    activo: bool = True


class ServicioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: int
    duracion_min: int
    activo: bool


# ---------- Barberos ----------
class BarberoIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    telefono: Optional[str] = Field(default=None, max_length=20)
    especialidad: Optional[str] = Field(default=None, max_length=100)
    activo: bool = True
    # Opcionales: si se envían, se crea también el acceso del barbero al panel
    usuario: Optional[str] = Field(default=None, min_length=3, max_length=50)
    password: Optional[str] = Field(default=None, min_length=6, max_length=100)


class BarberoUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=80)
    telefono: Optional[str] = Field(default=None, max_length=20)
    especialidad: Optional[str] = Field(default=None, max_length=100)
    activo: Optional[bool] = None


class BarberoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    telefono: Optional[str] = None
    especialidad: Optional[str] = None
    activo: bool


# ---------- Citas ----------
class CitaCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    telefono: str = Field(pattern=r"^[0-9+ ]{7,20}$")
    email: Optional[str] = Field(default=None, max_length=100)
    id_barbero: int
    id_servicio: int
    inicio: datetime
    notas: Optional[str] = Field(default=None, max_length=200)


class EstadoIn(BaseModel):
    estado: Estado


# ---------- Sesión ----------
class LoginIn(BaseModel):
    usuario: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=100)
