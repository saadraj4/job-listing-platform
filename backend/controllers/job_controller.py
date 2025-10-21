from models.job import Job
from db import db

def get_all_jobs():
    return Job.query.all()

def get_job_by_id(job_id):
    return Job.query.get(job_id)

def create_job(data):
    new_job = Job(
        title=data.get("title"),
        company=data.get("company"),
        location=data.get("location"),
        salary=data.get("salary"),
        description=data.get("description")
    )
    db.session.add(new_job)
    db.session.commit()
    return new_job

def delete_job(job_id):
    job = Job.query.get(job_id)
    if job:
        db.session.delete(job)
        db.session.commit()
        return True
    return False
