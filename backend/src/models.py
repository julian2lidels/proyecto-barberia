from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.config.database import Base
from src.config.settings import ahora


class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False, unique=True)
    descripcion = Column(String(200))
    precio = Column(Integer, nullable=False)  # pesos colombianos
    duracion_min = Column(Integer, nullable=False, default=30)
    activo = Column(Boolean, nullable=False, default=True)


class Barbero(Base):
    __tablename__ = "barberos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False)
    telefono = Column(String(20))
    especialidad = Column(String(100))
    activo = Column(Boolean, nullable=False, default=True)


class Usuario(Base):
    """Cuentas del personal: rol 'admin' o 'barbero'."""

    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(200), nullable=False)
    rol = Column(String(20), nullable=False)
    id_barbero = Column(Integer, ForeignKey("barberos.id"), nullable=True)

    barbero = relationship("Barbero")


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False)
    telefono = Column(String(20), nullable=False, unique=True)
    email = Column(String(100))


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    id_barbero = Column(Integer, ForeignKey("barberos.id"), nullable=False, index=True)
    id_servicio = Column(Integer, ForeignKey("servicios.id"), nullable=False)
    inicio = Column(DateTime, nullable=False, index=True)
    fin = Column(DateTime, nullable=False)
    estado = Column(String(20), nullable=False, default="pendiente")  # pendiente|confirmada|completada|cancelada
    notas = Column(String(200))
    creada = Column(DateTime, nullable=False, default=ahora)

    cliente = relationship("Cliente")
    barbero = relationship("Barbero")
    servicio = relationship("Servicio")
