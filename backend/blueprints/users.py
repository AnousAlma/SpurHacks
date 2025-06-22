from flask import Blueprint, request, g
import time, bson
from db import users
from auth import require_auth

bp = Blueprint("users", __name__, url_prefix="/api")

@bp.post("/first-login")
def first_login():
    body = request.json or {}
    role = body.get("role")
    name = body.get("name", "")
    if role not in ("teacher", "student"):
        return {"error": "role required"}, 400

    doc = users.find_one({"uid": g.user["uid"]})
    if doc:
        if doc["role"] != role:
            return {"error": f"already {doc['role']}"}, 409
        return {"ok": True, "role": role}, 200

    users.insert_one({
        "uid": g.user["uid"],
        "email": g.user.get("email", ""),
        "name": name,
        "role": role,
        "classes": [],
        "createdAt": time.time(),
    })
    return {"ok": True, "role": role}, 201


@bp.get("/me")
@require_auth()
def me():
    doc = users.find_one({"uid": g.user["uid"]}, {"role": 1, "_id": 0})
    print(doc)
    return {"role": doc["role"] if doc else None}
