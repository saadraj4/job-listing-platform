# Import necessary modules
from flask import Blueprint, jsonify, request
from controllers.job_controller import get_all_jobs, get_job_by_id, create_job, update_job, remove_job, bulk_insert_jobs

# Blueprint for job routes
job_bp = Blueprint("job_routes", __name__)

# Route to create a new job
@job_bp.route("/createJob", methods=["POST"])
def createJob():
    if not request.json:
        return jsonify({"message": "Request body must be JSON"}), 400
    
    new_job, error, status_code = create_job(request.json)
    if error:
        return jsonify(error), status_code
    return jsonify(new_job.to_dict()), status_code

# Route to delete a job
@job_bp.route("/removeJob/<int:job_id>", methods=["DELETE"])
def removeJob(job_id):
    success, error, status_code = remove_job(job_id)
    if error:
        return jsonify(error), status_code
    return jsonify({"message": "Job deleted successfully"}), status_code


# Route to update a job
@job_bp.route("/updateJob/<int:job_id>", methods=["PUT"])
def updateJob(job_id):
    try:
        print(f"PUT request received for job {job_id}")
        print(f"Request data: {request.json}")
        
        if not request.json:
            return jsonify({"message": "Request body must be JSON"}), 400
        
        job, error, status_code = update_job(job_id, request.json)
        if error:
            print(f"Error in update_job: {error}")
            return jsonify(error), status_code
        
        print(f"Job updated successfully, returning: {job.to_dict()}")
        return jsonify(job.to_dict()), status_code
    except Exception as e:
        print(f"Exception in updateJob route: {str(e)}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500


# Route to get a job by id
@job_bp.route("/getJobById/<int:job_id>", methods=["GET"])
def getJobById(job_id):
    job, error, status_code = get_job_by_id(job_id)
    if error:
        return jsonify(error), status_code
    return jsonify(job.to_dict()), status_code


# Route to get all jobs
@job_bp.route("/getAllJobs", methods=["GET"])
def getAllJobs():
    try:
        jobs, error, status_code = get_all_jobs()
        if error:
            return jsonify(error), status_code
        return jsonify([job.to_dict() for job in jobs]), status_code
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


# Route to bulk store the data into database (scraped data from https://www.actuarylist.com/)
@job_bp.route("/jobs/bulk", methods=["POST"])
def bulk_insert_jobs_route():
    return bulk_insert_jobs()