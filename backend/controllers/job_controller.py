# Import necessary modules
from flask import request, jsonify
from models.job import Job
from db import db
from datetime import datetime, timedelta
import re


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
        print(f"Updating job {job_id} with data: {data}")
        
        job = Job.query.get(job_id)
        if not job:
            print(f"Job {job_id} not found")
            return None, {"message": "Job not found"}, 404
        
        # Handle tags conversion if it's a list
        if "tags" in data and isinstance(data["tags"], list):
            data["tags"] = ",".join(data["tags"])
        
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
        
        print(f"Job before commit: {job.to_dict()}")
        db.session.commit()
        print(f"Job updated successfully: {job.to_dict()}")
        return job, None, 200
    except Exception as e:
        print(f"Error updating job: {str(e)}")
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


# controller function to bulk store the data into db scraped from https://www.actuarylist.com/
def bulk_insert_jobs():
    try:
        data = request.get_json()

       
        print(data[0:1])
        if not isinstance(data, list):
            return jsonify({"error": "Expected a list of job objects"}), 400

        jobs_to_add = []

        for job_data in data:
            title = job_data.get("title")
            company = job_data.get("company")
            location = clean_text(job_data.get("location", ""))
            salary = remove_emojis(job_data.get("salary", ""))
            description = job_data.get("description")
            job_type = job_data.get("job_type", "Full-time")
            tags = clean_text(job_data.get("tags", ""))
            posting_raw = job_data.get("posting_date", "")

            # 🕒 Parse posting_date like '10h ago', '12d ago', etc.
            posting_date = parse_posting_date(posting_raw)
            existing = Job.query.filter_by(title=title, company=company).first()
            if existing:
                continue

            new_job = Job(
                title=title,
                company=company,
                location=location,
                salary=salary,
                description=description,
                job_type=job_type,
                tags=tags,
                posting_date=posting_date 
            )
            jobs_to_add.append(new_job)

        db.session.add_all(jobs_to_add)
        db.session.commit()

        return jsonify({"message": f"{len(jobs_to_add)} jobs stored successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



def remove_emojis(text):
    if not text:
        return text
    return re.sub(r'[^\x00-\x7F]+', '', text)

def clean_text(value):
    if not value:
        return ""
    parts = [p.strip() for p in value.split(",") if p.strip() and p.strip().upper() != "N/A"]
    return ", ".join(parts)

def parse_posting_date(raw):
    """Convert text like '10h ago', '12d ago', '2w ago' into datetime."""
    if not raw or raw == "N/A":
        return datetime.utcnow()

    raw = raw.lower().strip()
    now = datetime.utcnow()

    try:
        if "h" in raw:
            hours = int(re.search(r"(\d+)", raw).group(1))
            return now - timedelta(hours=hours)
        elif "d" in raw:
            days = int(re.search(r"(\d+)", raw).group(1))
            return now - timedelta(days=days)
        elif "w" in raw:
            weeks = int(re.search(r"(\d+)", raw).group(1))
            return now - timedelta(weeks=weeks)
        elif "m" in raw:  # for months (approx)
            months = int(re.search(r"(\d+)", raw).group(1))
            return now - timedelta(days=30 * months)
    except:
        pass

    # Default: today
    return now