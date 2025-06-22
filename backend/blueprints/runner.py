from flask import Blueprint, request, g, Response
import requests, os, time
from mapping import to_piston
from auth import require_auth
from dotenv import load_dotenv
load_dotenv()

PISTON_URL = os.getenv("PISTON_URL", "https://emkc.org/api/v2/piston/execute")

bp = Blueprint("runner", __name__, url_prefix="/")

@bp.post("/run")
@require_auth()
def run_code():
    data = request.get_json(force=True)
    lang, src = data.get("lang"), data.get("src", "")
    meta = to_piston(lang)
    if not meta:
        return "unsupported language", 400

    lang_name, version = meta
    payload = {
        "language": lang_name,
        "version":  version,
        "files":    [{"name": "main", "content": src}],
    }

    piston = requests.post(
        PISTON_URL,
        json=payload,
        timeout=15,               # no stream=True
    ).json()

    out = (piston["run"]["stdout"] + piston["run"]["stderr"]).strip()
    return out, 200, {"Content-Type": "text/plain"}
