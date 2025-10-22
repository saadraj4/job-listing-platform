import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { fetchJobs, createJob, updateJob, deleteJob } from './api'
import Filters from './components/Filters'
import JobsList from './components/JobsList'
import JobForm from './components/JobForm'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ q: '', job_type: '', location: '', tags: [], sort: 'date_desc' })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  const availableTags = useMemo(() => {
    const set = new Set()
    jobs.forEach(j => Array.isArray(j.tags) && j.tags.forEach(t => set.add(t)))
    return Array.from(set)
  }, [jobs])

  const fetchAll = async () => {
    setLoading(true); setError('')
    try {
      const params = {
        q: filters.q || undefined,
        job_type: filters.job_type || undefined,
        location: filters.location || undefined,
        tags: (filters.tags && filters.tags.length) ? filters.tags.join(',') : undefined,
        sort: filters.sort || undefined,
      }
      const { data } = await fetchJobs(params)
      setJobs(Array.isArray(data?.jobs) ? data.jobs : (Array.isArray(data) ? data : []))
    } catch {
      setError('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.job_type, filters.location, filters.sort, filters.tags.join('|')])

  const onCreate = () => { setEditing(null); setShowForm(true) }
  const onEdit = (job) => { setEditing(job); setShowForm(true) }
  const onDelete = async (job) => {
    if (!window.confirm('Delete this job?')) return
    try {
      await deleteJob(job.id)
      setJobs((prev) => prev.filter(j => j.id !== job.id))
      setToast('Job deleted successfully.')
    } catch {
      setToast('Failed to delete job.')
    } finally {
      setTimeout(() => setToast(''), 2000)
    }
  }

  const submitForm = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        await updateJob(editing.id, payload)
        setToast('Job updated successfully.')
      } else {
        await createJob(payload)
        setToast('Job added successfully.')
      }
      setShowForm(false)
      await fetchAll()
    } catch {
      setToast(`Failed to ${editing ? 'update' : 'add'} job.`)
    } finally {
      setSubmitting(false)
      setTimeout(() => setToast(''), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-600 text-white grid place-content-center font-bold">JL</div>
            <h1 className="text-xl font-semibold text-gray-900">Job Listings</h1>
          </div>
          <button onClick={onCreate} className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-700">Add Job</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
          <Filters value={filters} onChange={setFilters} availableTags={availableTags} />
        </section>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="grid place-content-center py-20 text-gray-600">Loading jobs…</div>
        ) : (
          <JobsList jobs={jobs} onEdit={onEdit} onDelete={onDelete} />
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Job' : 'Add Job'}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50">Close</button>
            </div>
            <JobForm initialValues={editing || {}} onCancel={() => setShowForm(false)} onSubmit={submitForm} submitting={submitting} />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
