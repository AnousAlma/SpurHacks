from flask import Blueprint, request, g
from bson import ObjectId
from db import users, classes, exams, submissions
from auth import require_auth
import time

bp = Blueprint("subs", __name__, url_prefix="/api")

@bp.post("/submissions")
@require_auth("student")
def submit():
    b=request.json or {}
    try: eid=ObjectId(b["examId"])
    except: return {"error":"examId"},400
    student = users.find_one({"uid":g.user["uid"]})
    if not student:
        return {"error": "student not found"}, 404
    exam = exams.find_one({"_id":eid})
    if not exam:
        return {"error": "exam not found"}, 404
    cls_ok = classes.find_one({"_id":exam["classId"],
                               "studentIds":student["_id"]})
    if not cls_ok: return {"error":"not in class"},403
    submissions.update_one(
        {"examId":eid,"studentId":student["_id"]},
        {"$set":{"lang":b["lang"],"code":b["code"],
                 "finishedAt":time.time()},
         "$setOnInsert":{"startedAt":time.time()}},
        upsert=True)
    return {"ok":True},200
