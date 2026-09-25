"""
Resumen matutino: lista los correos NUEVOS (desde la ultima ejecucion) de la
carpeta configurada, con remitente, asunto, hora, un resumen de 1-2 lineas y
cualquier accion/fecha limite mencionada.

Solo lectura (permiso Mail.Read delegado). No modifica ni marca correos.

Variables de entorno:
    GRAPH_TENANT_ID, GRAPH_CLIENT_ID, MAIL_FOLDER_NAME  -> igual que test_auth.py
    ANTHROPIC_API_KEY  -> opcional. Si esta presente, se usa Claude para
                          generar resumenes y detectar acciones/fechas
                          limite con mejor calidad. Si no esta, se usa un
                          resumen basico local (sin llamadas externas).
    ANTHROPIC_MODEL    -> opcional, default "claude-haiku-4-5-20251001".

Estado: la fecha/hora del correo mas reciente procesado se guarda en
state.json (junto al script, ignorado por git) para que la siguiente
ejecucion solo traiga correos nuevos.
"""

import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

from graph_client import load_config, get_token, find_folder_id, list_messages

STATE_PATH = Path(__file__).parent / "state.json"
OUTPUT_DIR = Path(__file__).parent / "resumenes"
DEFAULT_LOOKBACK_HOURS = 24
ANTHROPIC_MODEL_DEFAULT = "claude-haiku-4-5-20251001"

DEADLINE_KEYWORDS = re.compile(
    r"antes del?|fecha l[ií]mite|plazo|vence|vencimiento|entregar|entrega|"
    r"por favor confirmar|confirmar antes|deadline|due date|se solicita",
    re.IGNORECASE,
)
DATE_PATTERN = re.compile(
    r"\b(\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?|"
    r"\d{1,2}\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|"
    r"septiembre|octubre|noviembre|diciembre))\b",
    re.IGNORECASE,
)


def load_state():
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {}


def save_state(state):
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def since_timestamp(state):
    if "last_check" in state:
        return state["last_check"]
    cutoff = datetime.now(timezone.utc) - timedelta(hours=DEFAULT_LOOKBACK_HOURS)
    return cutoff.strftime("%Y-%m-%dT%H:%M:%SZ")


def fallback_summary(body_preview):
    text = (body_preview or "").strip().replace("\n", " ")
    match = re.search(r"^(.{20,180}?[.!?])\s", text + " ")
    summary = match.group(1) if match else text[:180]
    return summary or "(sin contenido de vista previa)"


def fallback_action_flag(subject, body_preview):
    combined = f"{subject or ''} {body_preview or ''}"
    if DEADLINE_KEYWORDS.search(combined):
        date_match = DATE_PATTERN.search(combined)
        snippet = combined[max(0, (date_match.start() if date_match else 0) - 20):]
        return snippet.strip()[:120]
    return None


def summarize_with_claude(messages):
    api_key = os.environ["ANTHROPIC_API_KEY"]
    model = os.environ.get("ANTHROPIC_MODEL", ANTHROPIC_MODEL_DEFAULT)

    items = [
        {
            "id": i,
            "subject": m.get("subject"),
            "from": m.get("from", {}).get("emailAddress", {}).get("name"),
            "preview": m.get("bodyPreview"),
        }
        for i, m in enumerate(messages)
    ]

    prompt = (
        "Para cada correo en esta lista JSON, escribe un resumen de 1-2 "
        "lineas en espanol y detecta si menciona una accion pendiente o "
        "fecha limite (o null si no hay). Responde SOLO con JSON, una "
        "lista de objetos {id, resumen, accion_o_fecha_limite}.\n\n"
        f"{json.dumps(items, ensure_ascii=False)}"
    )

    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": model,
            "max_tokens": 2048,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=60,
    )
    resp.raise_for_status()
    text = resp.json()["content"][0]["text"]
    text = re.sub(r"^```json|```$", "", text.strip(), flags=re.MULTILINE).strip()
    results = {item["id"]: item for item in json.loads(text)}
    return results


def build_report(messages):
    use_claude = bool(os.environ.get("ANTHROPIC_API_KEY"))
    claude_results = summarize_with_claude(messages) if use_claude and messages else {}

    lines = []
    for i, m in enumerate(messages):
        sender = m.get("from", {}).get("emailAddress", {})
        received = m.get("receivedDateTime", "")
        subject = m.get("subject", "(sin asunto)")
        preview = m.get("bodyPreview", "")

        if i in claude_results:
            summary = claude_results[i].get("resumen", "")
            action = claude_results[i].get("accion_o_fecha_limite")
        else:
            summary = fallback_summary(preview)
            action = fallback_action_flag(subject, preview)

        lines.append(f"### {subject}")
        lines.append(f"- De: {sender.get('name')} <{sender.get('address')}>")
        lines.append(f"- Hora: {received}")
        lines.append(f"- Resumen: {summary}")
        if action:
            lines.append(f"- ⚠️ Posible accion/fecha limite: {action}")
        lines.append("")

    return "\n".join(lines)


def main():
    config = load_config()
    tenant_id, client_id, folder_name = (
        config["GRAPH_TENANT_ID"],
        config["GRAPH_CLIENT_ID"],
        config["MAIL_FOLDER_NAME"],
    )

    token = get_token(tenant_id, client_id)
    folder_id = find_folder_id(token, folder_name)

    state = load_state()
    since = since_timestamp(state)
    messages = list_messages(
        token,
        folder_id,
        select="subject,from,receivedDateTime,bodyPreview",
        top=50,
        filter_query=f"receivedDateTime gt {since}",
        orderby="receivedDateTime asc",
    )

    today = datetime.now().strftime("%Y-%m-%d")
    header = f"# Resumen matutino — {today} ({folder_name})\n\n"

    if not messages:
        body = "No hay correos nuevos desde la ultima revision.\n"
    else:
        body = f"{len(messages)} correo(s) nuevo(s):\n\n" + build_report(messages)

    report = header + body
    print(report)

    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / f"{today}.md").write_text(report, encoding="utf-8")

    if messages:
        state["last_check"] = messages[-1]["receivedDateTime"]
        save_state(state)


if __name__ == "__main__":
    main()
