from datetime import datetime
from db import db

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(500), nullable=False)
    salary = db.Column(db.String(100))
    description = db.Column(db.Text)

    posting_date = db.Column(db.DateTime, default=datetime.utcnow)
    job_type = db.Column(db.String(100))  # e.g. 'Full-time', 'Part-time', 'Internship'
    tags = db.Column(db.String(500))     # Comma-separated tags like "Python,Remote,Data"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "salary": self.salary,
            "description": self.description,
            "posting_date": self.posting_date.strftime("%Y-%m-%d %H:%M:%S"),
            "job_type": self.job_type,
            "tags": self.tags.split(",") if self.tags else []
        }
