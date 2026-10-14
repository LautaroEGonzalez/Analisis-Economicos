"""Funciones compartidas: acceso a la API de series de datos.gob.ar y utilidades."""

import time
from pathlib import Path

import pandas as pd
import requests

RAIZ = Path(__file__).resolve().parents[1]
API = "https://apis.datos.gob.ar/series/api/series/"
IPC_NAC = "148.3_INIVELNAL_DICI_M_26"   # IPC Nacional, nivel general (dic-2016 = 100)
MESES_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
PUBLICADO = RAIZ / "fuentes" / "ipc_publicado.csv"   # IPC del informe del INDEC, cargado a mano

SESION = requests.Session()
SESION.headers["User-Agent"] = "analisis-economicos (github actions)"


def pedir(url, params, intentos=4):
    """GET con reintentos: la API a veces tarda o devuelve 5xx."""
    for i in range(intentos):
        try:
            resp = SESION.get(url, params=params, timeout=60)
            if resp.status_code == 200:
                return resp.json()
            print(f"  ⚠️ HTTP {resp.status_code} (intento {i + 1})")
        except requests.RequestException as e:
            print(f"  ⚠️ {e.__class__.__name__} (intento {i + 1})")
        time.sleep(5 * (i + 1))
    raise RuntimeError(f"La API no respondió: {url} {params}")


def ym(fecha):
    return fecha.strftime("%Y-%m")


def etiqueta(fecha):
    return f"{MESES_ES[fecha.month - 1]}-{str(fecha.year)[2:]}"


def r(x, n=2):
    """Redondea y convierte NaN en None (JSON válido)."""
    return None if x is None or pd.isna(x) else round(float(x), n)
