"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

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
}

interface ExportUtilsProps {
  transactions: Transaction[];
  className?: string;
}

export default function ExportUtils({ transactions, className = "" }: ExportUtilsProps) {
  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "Username",
      "User Role", 
      "Type",
      "Amount",
      "Status",
      "Date",
      "Payment Method",
      "Project Name",
      "Notes"
    ];

    const csvContent = [
      headers.join(","),
      ...transactions.map(txn => [
        txn.id,
        `"${txn.username}"`,
        txn.userRole,
        txn.type,
        txn.amount,
        txn.status,
        `"${new Date(txn.date).toLocaleString()}"`,
        `"${txn.paymentMethod || ''}"`,
        `"${txn.projectName || ''}"`,
        `"${(txn.notes || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real application, you would use a PDF library like jsPDF or react-pdf
    // For now, we'll show a simple alert
    alert(`PDF export feature would generate a detailed report of ${transactions.length} transactions. In a real implementation, this would use a PDF library like jsPDF or react-pdf.`);
  };

  const generateReport = () => {
    const now = new Date();
    const summary = {
      totalTransactions: transactions.length,
      totalPayments: transactions.filter(t => t.type === "Payment" && t.status === "Approved").reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: transactions.filter(t => t.type === "Withdrawal" && t.status === "Approved").reduce((sum, t) => sum + t.amount, 0),
      pendingCount: transactions.filter(t => t.status === "Pending").length,
      failedCount: transactions.filter(t => t.status === "Failed").length,
    };

    const reportContent = `
TRANSACTION MANAGEMENT REPORT
Generated: ${now.toLocaleString()}

SUMMARY STATISTICS:
- Total Transactions: ${summary.totalTransactions}
- Total Approved Payments: $${summary.totalPayments.toFixed(2)}
- Total Approved Withdrawals: $${summary.totalWithdrawals.toFixed(2)}
- Pending Transactions: ${summary.pendingCount}
- Failed Transactions: ${summary.failedCount}

STATUS BREAKDOWN:
- Approved: ${transactions.filter(t => t.status === "Approved").length}
- Pending: ${summary.pendingCount}
- Rejected: ${transactions.filter(t => t.status === "Rejected").length}
- Failed: ${summary.failedCount}

TYPE BREAKDOWN:
- Payments: ${transactions.filter(t => t.type === "Payment").length}
- Withdrawals: ${transactions.filter(t => t.type === "Withdrawal").length}

DETAILED TRANSACTION LIST:
${transactions.map((txn, index) => `
${index + 1}. ${txn.id}
   User: ${txn.username} (${txn.userRole})
   Type: ${txn.type} | Amount: $${txn.amount.toFixed(2)} | Status: ${txn.status}
   Date: ${new Date(txn.date).toLocaleString()}
   ${txn.projectName ? `Project: ${txn.projectName}` : ''}
   ${txn.notes ? `Notes: ${txn.notes}` : ''}
`).join('')}

Report End
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaction_report_${now.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button onClick={exportToCSV} variant="outline" size="sm">
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button onClick={exportToPDF} variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
      <Button onClick={generateReport} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Generate Report
      </Button>
    </div>
  );
}
