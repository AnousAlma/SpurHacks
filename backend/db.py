# backend/db.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import time
load_dotenv()

client = MongoClient(os.environ["MONGO_URI"])
db = client.spurhacks

users = db.users
classes = db.classes
exams = db.exams
submissions = db.submissions

def init_indexes():
    users.create_index("uid", unique=True)
    users.create_index("role")

    classes.create_index("teacherIds")
    classes.create_index("studentIds")

    exams.create_index("classId")

    submissions.create_index(
        [("examId", 1), ("studentId", 1)], unique=True
    )

if __name__ == "__main__":
    init_indexes()
    print("Indexes ensured.")

users = db.users
def get_or_create_user(uid: str, email: str, role: str, name: str = ""):
    """Return Mongo _id, creating the doc on very first login."""
    doc = users.find_one({"uid": uid})
    if doc:
        return doc["_id"], doc["role"]

    res = users.insert_one({
        "uid": uid,
        "email": email,
        "name": name,
        "role": role,         # 'teacher' | 'student'
        "classes": [],        # list[ObjectId]
        "createdAt": time.time(),
    })
    return res.inserted_id, role
