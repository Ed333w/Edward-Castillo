"""
Autenticacion y llamadas de solo lectura a Microsoft Graph, compartidas por
test_auth.py (prueba minima) y resumen_matutino.py (pipeline diario).

Variables de entorno requeridas (nunca hardcodear valores aqui):
    GRAPH_TENANT_ID   -> Directory (tenant) ID de la app registrada en Azure AD
                         (o "organizations" si se usa el client ID publico de
                         Microsoft Graph PowerShell como alternativa sin
                         registro de app propia)
    GRAPH_CLIENT_ID   -> Application (client) ID de la app
    MAIL_FOLDER_NAME  -> nombre exacto de la carpeta de Outlook a leer

El token se cachea en token_cache.bin (ignorado por git) para no tener que
repetir el login por device code cada vez que se ejecuta un script.
"""

import os
import sys
import json
from pathlib import Path

import msal
import requests

SCOPES = ["https://graph.microsoft.com/Mail.Read"]
CACHE_PATH = Path(__file__).parent / "token_cache.bin"
GRAPH_BASE = "https://graph.microsoft.com/v1.0"


def load_config(*extra_required):
    """Lee variables de entorno requeridas. extra_required agrega nombres
    adicionales a validar (ej. para scripts que necesitan mas config)."""
    names = ["GRAPH_TENANT_ID", "GRAPH_CLIENT_ID", "MAIL_FOLDER_NAME", *extra_required]
    values = {name: os.environ.get(name) for name in names}

    missing = [name for name, value in values.items() if not value]
    if missing:
        print("Faltan variables de entorno: " + ", ".join(missing))
        print("Configuralas antes de ejecutar este script (ver README.md).")
        sys.exit(1)

    return values


def get_token(tenant_id, client_id):
    cache = msal.SerializableTokenCache()
    if CACHE_PATH.exists():
        cache.deserialize(CACHE_PATH.read_text(encoding="utf-8"))

    app = msal.PublicClientApplication(
        client_id,
        authority=f"https://login.microsoftonline.com/{tenant_id}",
        token_cache=cache,
    )

    accounts = app.get_accounts()
    result = None
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])

    if not result:
        flow = app.initiate_device_flow(scopes=SCOPES)
        if "user_code" not in flow:
            print("No se pudo iniciar el device code flow:")
            print(json.dumps(flow, indent=2, ensure_ascii=False))
            sys.exit(1)
        print(flow["message"])
        result = app.acquire_token_by_device_flow(flow)

    if cache.has_state_changed:
        CACHE_PATH.write_text(cache.serialize(), encoding="utf-8")

    if "access_token" not in result:
        print("Fallo la autenticacion.")
        print(f"Error: {result.get('error')}")
        print(f"Descripcion: {result.get('error_description')}")
        sys.exit(1)

    return result["access_token"]


def find_folder_id(token, folder_name):
    resp = requests.get(
        f"{GRAPH_BASE}/me/mailFolders",
        headers={"Authorization": f"Bearer {token}"},
        params={"$filter": f"displayName eq '{folder_name}'"},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json().get("value", [])
    if not data:
        print(f"No se encontro ninguna carpeta de primer nivel llamada '{folder_name}'.")
        print("Nota: esta busqueda solo mira carpetas de primer nivel (hermanas de Inbox).")
        sys.exit(1)
    return data[0]["id"]


def list_messages(token, folder_id, select="subject,from,receivedDateTime", top=25, filter_query=None, orderby="receivedDateTime desc"):
    params = {
        "$top": top,
        "$orderby": orderby,
        "$select": select,
    }
    if filter_query:
        params["$filter"] = filter_query

    resp = requests.get(
        f"{GRAPH_BASE}/me/mailFolders/{folder_id}/messages",
        headers={"Authorization": f"Bearer {token}"},
        params=params,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json().get("value", [])
