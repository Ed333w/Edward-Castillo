"""
Utilidad de solo lectura: autentica y lista las carpetas de primer nivel del
buzon (nombre + cantidad de items), para saber el nombre exacto de la
carpeta a usar en MAIL_FOLDER_NAME sin tener que adivinarlo.

Usa las mismas variables de entorno GRAPH_TENANT_ID / GRAPH_CLIENT_ID que
los demas scripts (ver README.md). No requiere MAIL_FOLDER_NAME.
"""

import os
import sys

import requests

from graph_client import get_token, GRAPH_BASE

REQUIRED = ["GRAPH_TENANT_ID", "GRAPH_CLIENT_ID"]


def main():
    missing = [name for name in REQUIRED if not os.environ.get(name)]
    if missing:
        print("Faltan variables de entorno: " + ", ".join(missing))
        sys.exit(1)

    print("Autenticando contra Microsoft Graph...")
    token = get_token(os.environ["GRAPH_TENANT_ID"], os.environ["GRAPH_CLIENT_ID"])
    print("Autenticacion exitosa.\n")

    resp = requests.get(
        f"{GRAPH_BASE}/me/mailFolders",
        headers={"Authorization": f"Bearer {token}"},
        params={"$top": 100, "$select": "displayName,totalItemCount,unreadItemCount"},
        timeout=30,
    )
    resp.raise_for_status()
    folders = resp.json().get("value", [])

    print(f"Carpetas de primer nivel ({len(folders)}):\n")
    for f in folders:
        print(f"- {f['displayName']}  (total: {f.get('totalItemCount')}, sin leer: {f.get('unreadItemCount')})")


if __name__ == "__main__":
    main()
