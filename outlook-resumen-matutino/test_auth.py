"""
Prueba minima: autenticarse contra Microsoft Graph (solo lectura) y listar
los correos de una carpeta especifica de Outlook.

No hace nada mas todavia (ni resumenes, ni deteccion de fechas limite).
Eso viene despues, una vez que esto funcione de forma confiable.

Variables de entorno requeridas (nunca hardcodear valores aqui):
    GRAPH_TENANT_ID   -> Directory (tenant) ID de la app registrada en Azure AD
    GRAPH_CLIENT_ID   -> Application (client) ID de la app registrada
    MAIL_FOLDER_NAME  -> nombre exacto de la carpeta de Outlook a leer

El token se cachea en token_cache.bin (ignorado por git) para no tener que
repetir el login por device code cada vez que se ejecuta el script.
"""

from graph_client import load_config, get_token, find_folder_id, list_messages


def main():
    config = load_config()
    tenant_id, client_id, folder_name = config["GRAPH_TENANT_ID"], config["GRAPH_CLIENT_ID"], config["MAIL_FOLDER_NAME"]

    print("Autenticando contra Microsoft Graph...")
    token = get_token(tenant_id, client_id)
    print("Autenticacion exitosa.\n")

    folder_id = find_folder_id(token, folder_name)
    messages = list_messages(token, folder_id)

    print(f"{len(messages)} correo(s) en la carpeta '{folder_name}':\n")
    for msg in messages:
        sender = msg.get("from", {}).get("emailAddress", {})
        print(f"- [{msg.get('receivedDateTime')}] {sender.get('name')} <{sender.get('address')}>")
        print(f"  {msg.get('subject')}")


if __name__ == "__main__":
    main()
