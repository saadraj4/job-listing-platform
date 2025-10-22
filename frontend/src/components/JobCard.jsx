import Tag from './Tag'

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium">{job.company}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{job.job_type}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Posted {new Date(job.posted_at || job.created_at || Date.now()).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(job)} className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">Edit</button>
          <button onClick={() => onDelete(job)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100">Delete</button>
        </div>
      </div>
      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap">
          {job.tags.map((t, idx) => (
            <Tag key={idx} label={t} />
          ))}
        </div>
      )}
    </div>
  )
}


