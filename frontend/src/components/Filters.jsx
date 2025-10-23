import { Search, X, ChevronDown } from 'lucide-react';


const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date Posted: Newest First' },
  { value: 'date_asc', label: 'Date Posted: Oldest First' },
];

export default function FilterBar({ filters, onFilterChange, availableLocations, availableTags }) {
  const handleReset = () => {
    onFilterChange({
      keyword: '',
      job_type: 'All',
      location: 'All',
      tags: [],
      sort: 'date_desc',
    });
  };

  const hasActiveFilters =
    filters.keyword !== '' ||
    filters.job_type !== 'All' ||
    filters.location !== 'All' ||
    filters.tags.length > 0;

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];

    onFilterChange({ ...filters, tags: newTags });
  };

  return (
    <div className="top-20 z-30 bg-white/90 backdrop-blur rounded-xl shadow-card hover:shadow-lg transition-shadow border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-2">
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Title or Company
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="keyword"
              value={filters.keyword}
              onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {filters.keyword && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onFilterChange({ ...filters, keyword: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Job Type</span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map(type => {
              const selected = filters.job_type === type;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onFilterChange({ ...filters, job_type: type })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm focus-visible:ring-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-300'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              className="w-full appearance-none pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option value="All">All Locations</option>
              {availableLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  filters.tags.includes(tag)
                    ? 'bg-blue-600 text-white focus-visible:ring-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-300"
          >
            <X size={16} />
            Reset Filters
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.keyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm shadow-sm">
                Keyword: {filters.keyword}
              </span>
            )}
            {filters.job_type !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm shadow-sm">
                Type: {filters.job_type}
              </span>
            )}
            {filters.location !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm shadow-sm">
                Location: {filters.location}
              </span>
            )}
            {filters.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm shadow-sm">
                Tag: {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
