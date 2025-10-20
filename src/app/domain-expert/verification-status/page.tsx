"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { FileText } from 'lucide-react'

export default function VerificationStatusPage() {
  const { user } = useAuth()
  const { show: showToast } = useToast()
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Compute a single overall status and a single review note (most recent)
  const overallStatus = React.useMemo(() => {
    if (!docs || docs.length === 0) return 'N/A'
    const statuses = docs.map((d) => (d.status || '').toString().toUpperCase())
    if (statuses.includes('REJECTED')) return 'REJECTED'
    if (statuses.includes('PENDING') || statuses.includes('IN_REVIEW') || statuses.includes('UNDER_REVIEW')) return 'PENDING'
    if (statuses.every((s) => s === 'APPROVED')) return 'APPROVED'
    return statuses[0] || 'UNKNOWN'
  }, [docs])

  const overallReviewNote = React.useMemo(() => {
    const withNotes = docs.filter((d) => d.reviewNotes && String(d.reviewNotes).trim() !== '')
    if (withNotes.length === 0) return ''
    // pick most recently uploaded note if uploadedAt exists
    withNotes.sort((a, b) => {
      const ta = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
      const tb = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
      return tb - ta
    })
    return withNotes[0].reviewNotes || ''
  }, [docs])

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
        const res = await fetch(`${base}/api/v1/domain-experts/${user.id}/verification-documents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to load verification documents')
        const data = await res.json()
        setDocs(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error('Error fetching verification docs', err)
        showToast('Failed to load verification documents', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [user?.id])

  const handleResubmit = async (documentId: string, file?: File) => {
    if (!file) return
    if (!user?.id) {
      showToast('Missing user id', 'error')
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
      const fd = new FormData()
      fd.append('file', file)

      const resp = await fetch(`${base}/api/v1/domain-experts/${user.id}/verification-documents/${documentId}/resubmit`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        showToast('Resubmit failed: ' + (txt || resp.statusText), 'error')
        return
      }

      const updated = await resp.json()
      setDocs((prev) => prev.map((d) => (String(d.id) === String(documentId) ? updated : d)))
      showToast('Document resubmitted successfully', 'success')
    } catch (err: any) {
      console.error(err)
      showToast('Resubmit failed: ' + (err?.message || 'unknown'), 'error')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Verification Status</h1>
          <div className="text-sm text-gray-600">Current status: <span className="font-semibold">{overallStatus}</span></div>
        </div>
      </div>

      {overallReviewNote && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-900">Review note: {overallReviewNote}</div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : docs.length === 0 ? (
        <p>No verification documents found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
              <div>
                <div className="font-medium">{doc.fileName || 'Document'}</div>
                <div className="text-xs text-gray-500">{doc.contentType || ''} • {doc.size ? (Math.round(doc.size/1024) + ' KB') : ''}</div>
              </div>

              <div className="flex items-center gap-3">
                {doc.fileUrl && (
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open</a>
                )}

                <label className="inline-flex items-center gap-2 text-sm bg-white border rounded px-3 py-1 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleResubmit(doc.id, f)
                      e.currentTarget.value = ''
                    }}
                  />
                  Resubmit
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
