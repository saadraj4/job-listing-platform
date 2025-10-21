# Import necessary modules
from flask import request, jsonify
from models.job import Job
from db import db
from datetime import datetime


# Controller functions for create Job API
def create_job(data):
    try:
        # Validation
        required_fields = ["title", "company", "location"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return None, {"message": f"Missing required fields: {', '.join(missing_fields)}"}, 400
        
        if isinstance(data.get('tags'), list):
            data['tags'] = ','.join(data['tags'])
        new_job = Job(
            title=data.get("title"),
            company=data.get("company"),
            location=data.get("location"),
            salary=data.get("salary"),
            description=data.get("description"),
            job_type=data.get("job_type"),
            tags=data.get("tags")
        )
        db.session.add(new_job)
        db.session.commit()
        return new_job, None, 201
    except Exception as e:
        db.session.rollback()
        return None, {"message": f"Database error: {str(e)}"}, 500


# Controller functions for remove Job API
def remove_job(job_id):
    try:
        job = Job.query.get(job_id)
        if not job:
            return False, {"message": "Job not found"}, 404
        
        db.session.delete(job)
        db.session.commit()
        return True, {"message": "Job deleted successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return False, {"message": f"Database error: {str(e)}"}, 500


# Controller functions for update Job API
def update_job(job_id, data):
    try:
        job = Job.query.get(job_id)
        if not job:
            return None, {"message": "Job not found"}, 404
        
        # Update fields if provided
        if "title" in data:
            job.title = data["title"]
        if "company" in data:
            job.company = data["company"]
        if "location" in data:
            job.location = data["location"]
        if "salary" in data:
            job.salary = data["salary"]
        if "description" in data:
            job.description = data["description"]
        if "job_type" in data:
            job.job_type = data["job_type"]
        if "tags" in data:
            job.tags = data["tags"]
        
        db.session.commit()
        return job, None, 200
    except Exception as e:
        db.session.rollback()
        return None, {"message": f"Database error: {str(e)}"}, 500


# Controller functions for get Job by id API
def get_job_by_id(job_id):
    try:
        job = Job.query.get(job_id)
        if not job:
            return None, {"message": "Job not found"}, 404
        return job, None, 200
    except Exception as e:
        return None, {"message": f"Database error: {str(e)}"}, 500



# Controller functions for get all jobs API
def get_all_jobs():
    try:
        query = Job.query

        # Filtering
        job_type = request.args.get("job_type")
        location = request.args.get("location")
        tag = request.args.get("tag")
        sort = request.args.get("sort")

        if job_type:
            query = query.filter_by(job_type=job_type)
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))
        if tag:
            query = query.filter(Job.tags.ilike(f"%{tag}%"))

        # Sorting
        if sort == "posting_date_desc":
            query = query.order_by(Job.posting_date.desc())
        elif sort == "posting_date_asc":
            query = query.order_by(Job.posting_date.asc())
        else:
            query = query.order_by(Job.posting_date.desc())  # default: newest first

        jobs = query.all()
        return jobs, None, 200
    except Exception as e:
        return None, {"message": f"Database error: {str(e)}"}, 500

