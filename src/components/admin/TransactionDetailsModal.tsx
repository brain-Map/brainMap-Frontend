"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Flag } from "lucide-react";

interface Transaction {
  id: string;
  username: string;
  userRole: "Student" | "Expert";
  type: "Payment" | "Withdrawal";
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Failed";
  date: string;
  paymentMethod?: string;
  projectName?: string;
  notes?: string;
  proofUrl?: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (txnId: string, action: "approve" | "reject" | "flag") => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Failed":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getTypeColor = (type: string) => {
  return type === "Payment"
    ? "bg-blue-100 text-blue-800"
    : "bg-purple-100 text-purple-800";
};

export default function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onAction,
}: TransactionDetailsModalProps) {
  const [adminNote, setAdminNote] = React.useState("");

  if (!transaction) return null;

  const handleAction = (action: "approve" | "reject" | "flag") => {
    onAction(transaction.id, action);
    onClose();
  };

  const handleAddNote = () => {
    if (adminNote.trim()) {
      // In a real app, this would make an API call to save the note
      alert(`Note added: ${adminNote}`);
      setAdminNote("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about transaction {transaction.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Transaction ID</Label>
              <p className="font-mono text-sm">{transaction.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Username</Label>
              <p>{transaction.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">User Role</Label>
              <p>{transaction.userRole}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Type</Label>
              <div className="mt-1">
                <Badge className={getTypeColor(transaction.type)}>
                  {transaction.type}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Amount</Label>
              <p className="font-semibold text-lg">${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Date</Label>
              <p>{new Date(transaction.date).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
              <p>{transaction.paymentMethod || "N/A"}</p>
            </div>
          </div>

          {transaction.projectName && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Related Project</Label>
              <p>{transaction.projectName}</p>
            </div>
          )}

          {transaction.notes && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Notes</Label>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {transaction.notes}
              </p>
            </div>
          )}

          {transaction.proofUrl && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Payment Proof</Label>
              <div className="mt-1 p-3 border rounded-md bg-blue-50">
                <p className="text-sm text-blue-700">
                  📎 Payment proof uploaded
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => window.open(transaction.proofUrl, "_blank")}
                >
                  View Proof
                </Button>
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {transaction.status === "Pending" && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => handleAction("approve")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleAction("reject")}
                variant="destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleAction("flag")}
                variant="outline"
                className="text-orange-600 hover:text-orange-700"
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
            </div>
          )}

          {/* Admin Note Section */}
          <div className="border-t pt-4">
            <Label htmlFor="adminNote" className="text-sm font-medium text-gray-600">
              Add Admin Note
            </Label>
            <Textarea
              id="adminNote"
              placeholder="Add a note about this transaction..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="mt-1"
              rows={3}
            />
            <Button 
              size="sm" 
              className="mt-2"
              onClick={handleAddNote}
              disabled={!adminNote.trim()}
            >
              Add Note
            </Button>
          </div>

          {/* Audit Trail Section */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-600">Audit Trail</Label>
            <div className="mt-2 space-y-2">
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="font-medium">Created:</span> {new Date(transaction.date).toLocaleString()} by System
              </div>
              {transaction.status !== "Pending" && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Last Modified:</span> {new Date().toLocaleString()} by Admin User
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
