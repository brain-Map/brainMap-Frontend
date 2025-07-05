import { Plus, Edit, Trash2, Users, CheckCircle } from "lucide-react"

export default function PackagesPage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Packages</h1>
              <p className="mt-2 text-gray-600">Manage your mentorship service offerings</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                Active Packages
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Drafts
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Archived
              </button>
            </nav>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Quick Consultation",
              description: "30-minute one-on-one session to address specific questions",
              price: "$50",
              duration: "30 minutes",
              features: ["1-on-1 video call", "Personalized advice", "Follow-up email"],
              popular: false,
              students: 24,
            },
            {
              title: "Standard Mentorship",
              description: "Regular mentorship sessions with assignments and feedback",
              price: "$150",
              duration: "4 weeks",
              features: ["Weekly 1-hour sessions", "Personalized assignments", "Email support", "Progress tracking"],
              popular: true,
              students: 56,
            },
            {
              title: "Premium Mentorship",
              description: "Comprehensive mentorship program with priority support",
              price: "$300",
              duration: "8 weeks",
              features: [
                "Bi-weekly 1-hour sessions",
                "Custom curriculum",
                "Priority support",
                "Career guidance",
                "Certificate of completion",
              ],
              popular: false,
              students: 18,
            },
          ].map((pkg, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
              {pkg.popular && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-blue-500 text-white text-xs rounded">Popular</div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                  <span className="ml-1 text-sm text-gray-500">/ {pkg.duration}</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {pkg.features.map((feature, j) => (
                  <div key={j} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="mr-1 h-4 w-4" />
                <span>{pkg.students} students enrolled</span>
              </div>
              <div className="flex justify-between space-x-2">
                <button className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
