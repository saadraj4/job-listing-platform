from flask import Blueprint, jsonify, request
from controllers.job_controller import get_all_jobs, get_job_by_id, create_job, delete_job

job_bp = Blueprint("job_routes", __name__)

@job_bp.route("/jobs", methods=["GET"])
def fetch_jobs():
    jobs = get_all_jobs()
    return jsonify([job.to_dict() for job in jobs])

@job_bp.route("/jobs/<int:job_id>", methods=["GET"])
def fetch_job(job_id):
    job = get_job_by_id(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    return jsonify(job.to_dict())

@job_bp.route("/jobs", methods=["POST"])
def add_job():
    data = request.json
    new_job = create_job(data)
    return jsonify(new_job.to_dict()), 201

@job_bp.route("/jobs/<int:job_id>", methods=["DELETE"])
def remove_job(job_id):
    success = delete_job(job_id)
    if not success:
        return jsonify({"message": "Job not found"}), 404
    return jsonify({"message": "Job deleted successfully"})
