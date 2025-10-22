import JobCard from './JobCard'

export default function JobsList({ jobs, onEdit, onDelete }) {
  if (!jobs?.length) {
    return <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">No jobs found.</div>
  }
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  )
}


