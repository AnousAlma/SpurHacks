import time
from functools import wraps
from flask import request, g
from firebase_admin import auth as admin_auth

def require_auth(role: str | None = None):
    def outer(fn):
        @wraps(fn)
        def wrapper(*a, **kw):
            hdr = request.headers.get("Authorization", "")
            if not hdr.startswith("Bearer "):
                return {"error":"missing token"},401
            try:
                g.user = admin_auth.verify_id_token(hdr.split(" ",1)[1])
            except Exception:
                return {"error":"invalid token"},401
            if role and g.user.get("role")!=role:
                return {"error":f"role {role} only"},403
            return fn(*a, **kw)
        return wrapper
    return outer
