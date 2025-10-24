import React, { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (...args: any[]) => Promise<void> | void
  args?: any[]
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  args = [],
  title = "Delete Item",
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const defaultMessage = itemName 
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone."

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      await onConfirm(...args)
      onClose()
    } catch (error) {
      console.error('Delete operation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={handleClose}
      />
      
  {/* Modal */}
  <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-[51]">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message || defaultMessage}
          </p>
        </div>

  {/* Actions */}
  <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}