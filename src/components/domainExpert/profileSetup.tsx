import React from "react"

interface ProfileSetupPopupProps {
  open: boolean
  onSetUpProfile: () => void
  onNotNow: () => void
}

export default function ProfileSetupPopup({ open, onSetUpProfile, onNotNow }: ProfileSetupPopupProps) {
  if (!open) return null

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-20">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[800px] w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onNotNow}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <img
            src="/image/profile_complete.jpg"
            alt="User"
            className="w-80"
          />
        </div>
        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Complete Your Profile to Get Verified!
          </h2>
          
          <div className="text-left space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-blue-600 font-bold text-lg">1.</span>
              <span className="text-gray-800">
                Add your details, qualifications and upload verification documents.
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-600 font-bold text-lg">2.</span>
              <span className="text-gray-800">
                Moderators will review and verify your profile.
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-600 font-bold text-lg">3.</span>
              <span className="text-gray-800">
                Get Verified!
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
              onClick={onSetUpProfile}
            >
              Set Up Profile & Get Verified
            </button>
            <button
              className="px-6 py-3 text-blue-900 hover:text-blue-800 transition font-medium"
              onClick={onNotNow}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}