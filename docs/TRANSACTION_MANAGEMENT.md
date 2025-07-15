# Transaction Management Admin Page

## Overview

A comprehensive Transaction Management system for BrainMap administrators to manage student payments and expert withdrawals. The system provides real-time monitoring, filtering, search capabilities, and administrative actions for all financial transactions.

## Features

### 📊 Dashboard Overview
- **Summary Statistics Cards**
  - Total Transactions count
  - Total Approved Payments ($)
  - Total Approved Withdrawals ($)
  - Pending Withdrawal Requests count
  - Failed Transactions count

- **Quick Stats**
  - Today's Transactions
  - Pending Reviews
  - Payment Methods count

- **Recent Transactions Preview**
  - Latest 5 transactions with status indicators

### 🔍 Advanced Filtering & Search
- **Search Functionality**
  - Search by username, email, transaction ID, or project name
  - Real-time search results

- **Filter Options**
  - Transaction Type: All, Payment, Withdrawal
  - Status: All, Pending, Approved, Rejected, Failed
  - User Role: All, Student, Expert
  - Date Range: Start and End date pickers

- **Quick Actions**
  - Clear all filters button
  - Refresh data button

### 📋 Transaction Management Table
- **Comprehensive Data Display**
  - Transaction ID (monospace font)
  - Username with associated project name
  - User Role badges (Student/Expert)
  - Transaction Type badges (Payment/Withdrawal)
  - Amount in USD currency
  - Color-coded status badges
  - Formatted date display

- **Action Buttons**
  - View Details (Eye icon)
  - Approve (Check icon) - for pending transactions
  - Reject (X icon) - for pending transactions
  - Flag (Flag icon) - for marking transactions for review

- **Pagination**
  - Configurable items per page (default: 10)
  - Navigation controls with page indicators
  - Result count display

### 📝 Transaction Details Modal
- **Comprehensive Information Display**
  - All transaction metadata
  - Payment proof viewing capability
  - Related project information
  - Admin notes section

- **Administrative Actions**
  - Approve/Reject/Flag actions for pending transactions
  - Add admin notes functionality
  - Audit trail display

### 📤 Export & Reporting
- **Export Options**
  - CSV export with all transaction data
  - PDF export capability (placeholder)
  - Detailed text report generation

- **Report Features**
  - Summary statistics
  - Status and type breakdowns
  - Detailed transaction listings
  - Timestamp and audit information

### 📋 Audit Logs
- **Admin Activity Tracking**
  - Transaction action history
  - Admin user identification
  - Timestamp recording
  - Action details and reasoning

## Technical Implementation

### File Structure
```
src/app/admin/transactions/
├── page.tsx                                    # Main transaction management page
src/components/admin/
├── TransactionDetailsModal.tsx                 # Detailed view modal component
├── ExportUtils.tsx                            # Export and reporting utilities
src/components/ui/
├── dialog.tsx                                 # Modal dialog component (new)
└── [existing UI components]                   # Button, Card, Table, etc.
```

### Key Components

#### 1. Main Transactions Page (`page.tsx`)
- **State Management**: React hooks for transactions, filters, pagination
- **Data Processing**: Real-time filtering and search functionality
- **UI Layout**: Tabbed interface with Overview, Transactions, and Audit sections

#### 2. Transaction Details Modal (`TransactionDetailsModal.tsx`)
- **Detailed View**: Complete transaction information display
- **Admin Actions**: Approve, reject, flag functionality
- **Note System**: Admin note addition capability
- **Audit Trail**: Transaction history tracking

#### 3. Export Utils (`ExportUtils.tsx`)
- **CSV Export**: Complete transaction data export
- **Report Generation**: Comprehensive text reports
- **PDF Export**: Placeholder for PDF library integration

### Data Models

#### Transaction Interface
```typescript
interface Transaction {
  id: string;                    // Unique transaction identifier
  username: string;              // User email/username
  userRole: "Student" | "Expert"; // User type
  type: "Payment" | "Withdrawal"; // Transaction type
  amount: number;                // Transaction amount in USD
  status: "Pending" | "Approved" | "Rejected" | "Failed"; // Current status
  date: string;                  // ISO timestamp
  paymentMethod?: string;        // Payment method used
  projectName?: string;          // Associated project (if any)
  notes?: string;               // Transaction notes
  proofUrl?: string;            // Payment proof URL
}
```

#### Audit Log Interface
```typescript
interface AuditLog {
  id: string;           // Unique audit log identifier
  transactionId: string; // Associated transaction ID
  action: string;       // Action performed
  adminUser: string;    // Admin who performed action
  timestamp: string;    // ISO timestamp
  details: string;      // Action details
}
```

## Installation & Setup

### Prerequisites
- Next.js 15.3.4
- React 19.0.0
- Tailwind CSS
- Radix UI components

### Required Dependencies
```bash
npm install @radix-ui/react-dialog
```

### Usage
1. Navigate to `/admin/transactions` in your admin dashboard
2. Use the tabbed interface to switch between views:
   - **Overview**: Dashboard with summary statistics
   - **Transactions**: Detailed transaction management
   - **Audit**: Admin action history

## Features in Detail

### Color-Coded Status System
- **Green**: Approved transactions
- **Yellow**: Pending transactions
- **Red**: Rejected transactions
- **Gray**: Failed transactions

### Payment Method Support
- Credit Card
- PayPal
- Bank Transfer
- Cryptocurrency
- Custom payment methods

### Security Features
- Admin action tracking
- Audit trail maintenance
- Flag system for suspicious transactions
- Note system for administrative comments

## Future Enhancements

### Planned Features
1. **Real-time Notifications**: WebSocket integration for live updates
2. **Advanced Analytics**: Charts and graphs for transaction trends
3. **Automated Rules**: Automatic approval/rejection based on criteria
4. **Email Notifications**: Automated user notifications for status changes
5. **Bulk Actions**: Select multiple transactions for batch operations
6. **Advanced Reporting**: Scheduled reports and dashboard analytics

### Integration Points
- **Payment Gateways**: Stripe, PayPal, bank APIs
- **Email Service**: SendGrid, AWS SES
- **Database**: Supabase, PostgreSQL
- **File Storage**: AWS S3, Cloudinary for payment proofs

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

*Last updated: July 15, 2025*
*Version: 1.0.0*
