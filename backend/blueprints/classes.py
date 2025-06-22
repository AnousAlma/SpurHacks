from flask import Blueprint, request, g
from bson import ObjectId
from db import users, classes
from auth import require_auth
import time

bp = Blueprint("classes", __name__, url_prefix="/api")

@bp.post("/classes")
@require_auth("teacher")
def create_class():
    name = (request.json or {}).get("name","").strip()
    if not name:
        return {"error":"name"},400

    teacher = users.find_one({"uid":g.user["uid"]})
    if not teacher:
        return {"error": "teacher not found"}, 404
    cls_id = classes.insert_one({
        "name":name,"teacherIds":[teacher["_id"]],
        "studentIds":[],"createdAt":time.time()
    }).inserted_id
    users.update_one({"_id":teacher["_id"]},{"$addToSet":{"classes":cls_id}})
    return {"classId":str(cls_id)},201

@bp.post("/classes/<cid>/join")
@require_auth("student")
def join_class(cid):
    try: cls_id = ObjectId(cid)
    except: return {"error":"bad id"},400
    student = users.find_one({"uid":g.user["uid"]})
    if not student:
        return {"error": "student not found"}, 404
    ok = classes.update_one({"_id":cls_id},
            {"$addToSet":{"studentIds":student["_id"]}}).modified_count
    if not ok: return {"error":"class?"},404
    users.update_one({"_id":student["_id"]},{"$addToSet":{"classes":cls_id}})
    return {"ok":True},200
