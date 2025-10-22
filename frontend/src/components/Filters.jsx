import Tag from './Tag'

export default function Filters({ value, onChange, availableTags }) {
  const setVal = (partial) => onChange({ ...value, ...partial })
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <input value={value.q} onChange={(e) => setVal({ q: e.target.value })} placeholder="Search by title or company" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select value={value.job_type} onChange={(e) => setVal({ job_type: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <input value={value.location} onChange={(e) => setVal({ location: e.target.value })} placeholder="Location (e.g., Remote)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <select value={value.sort || 'date_desc'} onChange={(e) => setVal({ sort: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="date_desc">Date Posted: Newest First</option>
          <option value="date_asc">Date Posted: Oldest First</option>
        </select>
        <select multiple value={value.tags} onChange={(e) => setVal({ tags: Array.from(e.target.selectedOptions).map(o => o.value) })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 md:col-span-1">
          {(availableTags || []).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        {(value.q || value.job_type || value.location || (value.tags?.length)) ? (
          <>
            <span>Active filters:</span>
            {value.q && <Tag label={`q: ${value.q}`} />}
            {value.job_type && <Tag label={`type: ${value.job_type}`} />}
            {value.location && <Tag label={`loc: ${value.location}`} />}
            {(value.tags || []).map(t => <Tag key={t} label={t} />)}
            <button onClick={() => onChange({ q: '', job_type: '', location: '', tags: [], sort: 'date_desc' })} className="ml-2 rounded border px-2 py-0.5 text-xs hover:bg-gray-50">Reset</button>
          </>
        ) : <span>No filters applied</span>}
      </div>
    </div>
  )
}


