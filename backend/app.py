# Import necessary modules
from flask import Flask
from flask_cors import CORS
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from db import db
from routes.job_routes import job_bp
from models.job import Job


app = Flask(__name__)

CORS(app) #For now I have enabled it for all origins, 
# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(job_bp, url_prefix="/api")


@app.route("/")
def home():
    return "Job Portal Backend is Running!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
