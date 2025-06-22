from flask import Blueprint, request, g
from bson import ObjectId
from db import users, classes, exams
from auth import require_auth
import time

bp = Blueprint("exams", __name__, url_prefix="/api")

@bp.post("/exams")
@require_auth("teacher")
def create_exam():
    b = request.json or {}
    try: cid = ObjectId(b["classId"])
    except: return {"error":"classId"},400
    teacher = users.find_one({"uid":g.user["uid"]})
    if not teacher or not classes.find_one({"_id":cid,"teacherIds":teacher["_id"]}):
        return {"error":"not your class"},403
    exam_id = exams.insert_one({
      "classId":cid,"creatorId":teacher["_id"],
      "title":b["title"].strip(),"description":b.get("description",""),
      "durationMin":int(b["durationMin"]),
      "questions":b["questions"],"createdAt":time.time()
    }).inserted_id
    return {"examId":str(exam_id)},201


