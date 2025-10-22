import { useState } from 'react'

export default function JobForm({ initialValues, onCancel, onSubmit, submitting }) {
  const [values, setValues] = useState(() => ({
    title: initialValues?.title || '',
    company: initialValues?.company || '',
    location: initialValues?.location || '',
    job_type: initialValues?.job_type || 'Full-time',
    tagsInput: Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : (initialValues?.tags || ''),
  }))

  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!values.title.trim()) next.title = 'Title is required'
    if (!values.company.trim()) next.company = 'Company is required'
    if (!values.location.trim()) next.location = 'Location is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      title: values.title.trim(),
      company: values.company.trim(),
      location: values.location.trim(),
      job_type: values.job_type,
      tags: values.tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input name="title" value={values.title} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g., Senior React Developer" />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input name="company" value={values.company} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g., Acme Inc." />
          {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input name="location" value={values.location} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g., Remote" />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <select name="job_type" value={values.job_type} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <input name="tagsInput" value={values.tagsInput} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="React, Remote, Frontend" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button disabled={submitting} type="submit" className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  )
}


