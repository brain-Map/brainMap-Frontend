"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import { useAuth } from '@/contexts/AuthContext'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Eye, Trash, Edit } from 'lucide-react';

interface Package {
  serviceId: string
  title: string
  subject: string
  description: string
  createdAt: string
  updatedAt?: string
  thumbnailUrl?: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { user } = useAuth();

  const router = useRouter();

  const mentorId = user?.id

  useEffect(() => {
    if (!mentorId) return;
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    axios.get(`http://localhost:8080/api/v1/service-listings/mentor/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setPackages(Array.isArray(res.data) ? res.data : [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch packages.");
        setLoading(false);
      });
  }, [mentorId]);

  const openDelete = (id: string) => { setDeleteId(id); setDeleteDialogOpen(true); }
  const closeDelete = () => { setDeleteId(null); setDeleteDialogOpen(false); }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8080/api/v1/service-listings/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages(pkgs => pkgs.filter(pkg => pkg.serviceId !== deleteId));
    } catch (err) {
      alert("Failed to delete package.");
    }
    closeDelete();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Service Packages</h1>
          <p className="text-muted-foreground">Manage and view the service packages you offer</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading packages...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No packages found.</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Quick Action</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.serviceId} className="group hover:bg-gray-50">
                    <TableCell className="font-semibold text-primary cursor-pointer" onClick={() => { window.location.href = `/services/${pkg.serviceId}` }}>
                      <div className="flex items-center gap-3">
                        <div>
                          <div>{pkg.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pkg.subject ?? '-'}</TableCell>
                    <TableCell>{pkg.createdAt ? format(new Date(pkg.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => window.location.href = `/services/${pkg.serviceId}`} title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/services/${pkg.serviceId}/edit-service`)} title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(pkg.serviceId)} title="Delete">
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>Are you sure you want to delete this package? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDelete}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
