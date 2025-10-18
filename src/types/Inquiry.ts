export interface Inquiry {
    inquiryId: string;
    userId: string;
    inquiryType: 'ISSUE' | 'POST' | 'COMMENT' | 'MESSAGE' | 'REVIEW' | 'PROJECT' | 'ACCOUNT' | 'PAYMENT' | 'SUPPORT' | 'OTHER';
    title: string;
    inquiryContent: string;
    status: 'PENDING' | 'RESOLVED' | 'REVIEWED' | 'CLOSED'
    cretedAt: string;
    resolvedAt?: string;
}
