from flask import Flask
from firebase_admin import credentials, initialize_app
import os
from db import init_indexes
from blueprints import users, classes, exams, submissions, runner
import ai

def create_app():
    cred = credentials.Certificate(os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON"))
    initialize_app(cred)

    app = Flask(__name__)
    init_indexes()

    # register blueprints
    app.register_blueprint(users.bp)
    app.register_blueprint(classes.bp)
    app.register_blueprint(exams.bp)
    app.register_blueprint(submissions.bp)
    app.register_blueprint(runner.bp)   # /run
    app.register_blueprint(ai.bp)       # /ask

    @app.get("/health")
    def health(): return {"status":"ok"}

    @app.get("/")
    def index(): return {"message":"Welcome to the Code Runner API!"}

    return app

if __name__ == "__main__":
    create_app().run(port=5000, threaded=True)
