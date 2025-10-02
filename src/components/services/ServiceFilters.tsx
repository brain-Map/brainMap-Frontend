"use client"

interface ServiceFiltersProps {
  selectedSubject: string | null
  selectedServiceType: string | null
  onSubjectChange: (subject: string | null) => void
  onServiceTypeChange: (type: string | null) => void
}

const subjects = ["academic", "professional", "creative", "technical", "language", "business"]

const serviceTypes = [
  { value: "online", label: "Online" },
  { value: "offline", label: "In-Person" },
  { value: "mixed", label: "Hybrid" },
]

export function ServiceFilters({
  selectedSubject,
  selectedServiceType,
  onSubjectChange,
  onServiceTypeChange,
}: ServiceFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Subject Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Subject
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="subject"
              checked={selectedSubject === null}
              onChange={() => onSubjectChange(null)}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
              All Subjects
            </span>
          </label>
          {subjects.map((subject) => (
            <label key={subject} className="flex items-center gap-2 cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="subject"
                checked={selectedSubject === subject}
                onChange={() => onSubjectChange(subject)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize font-medium">
                {subject}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Service Type Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Service Type
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="serviceType"
              checked={selectedServiceType === null}
              onChange={() => onServiceTypeChange(null)}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
              All Types
            </span>
          </label>
          {serviceTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="serviceType"
                checked={selectedServiceType === type.value}
                onChange={() => onServiceTypeChange(type.value)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedSubject || selectedServiceType) && (
        <button
          onClick={() => {
            onSubjectChange(null)
            onServiceTypeChange(null)
          }}
          className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-lg border border-blue-200 hover:border-blue-300"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  )
}
