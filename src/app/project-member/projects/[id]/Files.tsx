"use client";

import { useEffect, useState } from 'react';
import {
  Upload,
  X,
  File as FileIcon,
  FileText,
  Image,
  Video,
  Music,
  Plus,
} from 'lucide-react';
import { uploadApi } from '@/services/uploadApi';
import { useParams } from 'next/navigation';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  file: File;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
}

interface ServerFile {
  id: string;
  projectId: string;
  url: string;
}

export default function FileUploadInterface() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverFiles, setServerFiles] = useState<ServerFile[]>([]);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const fetchServerFiles = async () => {
    if (!projectId) return;
    setServerLoading(true);
    setServerError(null);
    try {
      const data: ServerFile[] = await uploadApi.getUploadedFiles(projectId);
      setServerFiles(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setServerError(e?.message || 'Failed to load files');
    } finally {
      setServerLoading(false);
    }
  };

  useEffect(() => {
    fetchServerFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      setIsModalOpen(false);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      file,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const uploadAll = async () => {
    const pending = files.filter((f) => f.status === 'pending' || !f.status);
    if (pending.length === 0) return;

    if (!projectId) {
      setFiles((prev) =>
        prev.map((f) =>
          pending.find((p) => p.id === f.id)
            ? { ...f, status: 'error' }
            : f
        )
      );
      return;
    }

    // mark uploading
    setFiles((prev) =>
      prev.map((f) =>
        pending.find((p) => p.id === f.id)
          ? { ...f, status: 'uploading' }
          : f
      )
    );

    try {
      // Ensure FormData is used
      const formData = new FormData();
      pending.forEach((f) => formData.append('files', f.file));

      const response = await uploadApi.uploadFiles(projectId as string, formData);

      setFiles((prev) =>
        prev.map((f) =>
          pending.find((p) => p.id === f.id)
            ? {
                ...f,
                status: 'success',
                url: response?.url || f.url,
              }
            : f
        )
      );

      // Refresh server list after successful upload
      fetchServerFiles();
    } catch (error) {
      console.error('Upload failed:', error);
      setFiles((prev) =>
        prev.map((f) =>
          pending.find((p) => p.id === f.id)
            ? { ...f, status: 'error' }
            : f
        )
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    );
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/'))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (type.startsWith('video/'))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (type.startsWith('audio/'))
      return <Music className="w-5 h-5 text-green-500" />;
    if (type.includes('pdf') || type.includes('document'))
      return <FileText className="w-5 h-5 text-red-500" />;
    return <FileIcon className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen max-w-full mx-auto p-6">
      <div className="max-w-full mx-auto">
        <div className="max-w-full rounded-2xl p-8">
          {/* Existing Uploaded Files from Backend */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Files</h2>
            {serverLoading && <p className="text-gray-500">Loading files...</p>}
            {serverError && <p className="text-red-600">{serverError}</p>}
            {!serverLoading && !serverError && (
              serverFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serverFiles.map((sf) => {
                    const name = (() => {
                      try { return decodeURIComponent(sf.url.split('/').pop() || 'file'); } catch { return 'file'; }
                    })();
                    const isImage = /(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
                    return (
                      <a
                        key={sf.id}
                        href={sf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                      >
                        <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {isImage ? (
                            <img src={sf.url} alt={name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex flex-col items-center text-gray-500 p-4">
                              <FileIcon className="w-10 h-10 mb-2" />
                              <span className="text-xs">Preview not available</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-700 truncate" title={name}>{name}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No files uploaded yet for this project.</p>
              )
            )}
            <div className="mt-3 flex justify-end">
              <button onClick={fetchServerFiles} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                Refresh
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              File Upload Manager
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary hover:text-black transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add file
            </button>
          </div>

          {files.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={uploadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                disabled={files.every((f) => f.status === 'success')}
              >
                Upload All
              </button>
            </div>
          )}

          {/* File List */}
          {files.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Uploaded Files ({files.length})
                </h2>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} •{' '}
                          {new Date(file.uploadedAt).toLocaleTimeString()}
                        </p>
                        {file.status && (
                          <p
                            className={`text-xs mt-1 ${
                              file.status === 'success'
                                ? 'text-green-600'
                                : file.status === 'error'
                                ? 'text-red-600'
                                : 'text-blue-600'
                            }`}
                          >
                            {file.status === 'pending' && 'Pending'}
                            {file.status === 'uploading' && 'Uploading...'}
                            {file.status === 'success' && 'Uploaded'}
                            {file.status === 'error' && 'Upload failed'}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No files uploaded yet</p>
              <p className="text-sm">Click "Add file" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upload Files
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop files here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                  Browse Files
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
