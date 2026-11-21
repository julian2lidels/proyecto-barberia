"""Contraseñas y tokens firmados usando solo la librería estándar de Python."""
import base64
import hashlib
import hmac
import json
import os
import time
from typing import Optional

_ITERACIONES = 200_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERACIONES)
    return salt.hex() + "$" + dk.hex()


def verify_password(password: str, almacenado: str) -> bool:
    try:
        salt_hex, hash_hex = almacenado.split("$")
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), _ITERACIONES)
    except ValueError:
        return False
    return hmac.compare_digest(dk.hex(), hash_hex)


def _b64(datos: bytes) -> str:
    return base64.urlsafe_b64encode(datos).rstrip(b"=").decode()


def _unb64(texto: str) -> bytes:
    return base64.urlsafe_b64decode(texto + "=" * (-len(texto) % 4))


def _firmar(cuerpo: str, secreto: str) -> str:
    return _b64(hmac.new(secreto.encode(), cuerpo.encode(), hashlib.sha256).digest())


def crear_token(datos: dict, secreto: str, horas: int) -> str:
    payload = dict(datos, exp=int(time.time()) + horas * 3600)
    cuerpo = _b64(json.dumps(payload, separators=(",", ":")).encode())
    return cuerpo + "." + _firmar(cuerpo, secreto)


def leer_token(token: str, secreto: str) -> Optional[dict]:
    try:
        cuerpo, firma = token.split(".")
        if not hmac.compare_digest(firma, _firmar(cuerpo, secreto)):
            return None
        payload = json.loads(_unb64(cuerpo))
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None
