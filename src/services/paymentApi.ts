import api from '@/utils/api';
import { payHereConfig } from '@/config/payhere';

export interface PaymentSessionRequest {
  amount: number;
  currency: string;
  orderId: string;
  itemDescription?: string;  // Made optional if backend doesn't require it
  firstName: string;        // Changed from customerName
  lastName: string;         // New field
  email: string;            // Changed from customerEmail
  phone?: string;           // Changed from customerPhone
  address?: string;         // Changed from customerAddress
  city?: string;
  country?: string;         // May not be in backend, but keeping for compatibility
}

export interface PaymentSessionResponse {
  paymentId: string;
  redirectUrl: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
  amount: number;
  currency: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: string;
  message?: string;
}

export interface TransactionRequest {
  amount: number;
  senderId: string;    // UUID format - User ID of the payer (student/project member)
  receiverId: string;  // UUID format - User ID of the receiver (mentor/domain expert)
  status: string;      // Transaction status: 'COMPLETED', 'PENDING', 'FAILED'
}

export interface TransactionResponse {
  id: string;          // UUID format - Transaction ID
  amount: number;
  senderId: string;    // UUID format - User ID of the payer
  receiverId: string;  // UUID format - User ID of the receiver
  status: string;
  createdAt: string;   // ISO 8601 timestamp
}

class PaymentApiService {
  /**
   * Create a new PayHere payment session
   * Automatically includes PayHere mode and configuration
   */
  async createPaymentSession(paymentData: PaymentSessionRequest): Promise<PaymentSessionResponse> {
    try {
      // Validate PayHere configuration
      const configValidation = payHereConfig.validateConfig();
      if (!configValidation.isValid) {
        throw new Error(`PayHere configuration error: ${configValidation.errors.join(', ')}`);
      }

      // Send clean payment data to backend (backend handles PayHere configuration)
      const requestPayload = {
        ...paymentData,
        // Optional: Include mode for backend reference (backend has final authority)
        requestedMode: payHereConfig.getConfig().mode
      };

      console.log('📤 Sending to backend:', requestPayload);
      console.log('🔗 Backend URL:', api.defaults.baseURL + '/api/payments/create-session');
      
      // Log authentication status
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      console.log('🔐 Authentication token:', token ? 'Present (will be auto-attached)' : '❌ MISSING');
      
      const response = await api.post('/api/payments/create-session', requestPayload);
      
      console.log('📥 Backend response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Payment session creation failed:', error);
      
      // Log detailed error information
      if (error.response) {
        console.log('📊 Error Status:', error.response.status);
        console.log('📝 Error Data:', error.response.data);
        console.log('🔐 Error Headers:', error.response.headers);
        
        // Specific handling for authentication errors
        if (error.response.status === 401) {
          console.error('🚫 AUTHENTICATION ERROR: Backend requires login token');
          console.log('🔑 Current token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
        }
      } else if (error.request) {
        console.error('🌐 NETWORK ERROR: No response from backend');
        console.log('📡 Request details:', error.request);
      } else {
        console.error('⚙️ REQUEST SETUP ERROR:', error.message);
      }
      
      // Enhanced error logging for sandbox mode
      if (payHereConfig.isSandboxMode()) {
        console.log('⚙️ PayHere Sandbox Mode - Configuration:', payHereConfig.getConfig());
      }
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to create payment session';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in to continue.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Backend server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Cannot connect to backend server. Please check if the backend is running.';
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get payment status by payment ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/api/payments/status/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get payment status:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get payment status'
      );
    }
  }

  /**
   * Get payment status by order ID
   */
  async getPaymentStatusByOrderId(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/api/payments/status/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get payment status:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get payment status'
      );
    }
  }

  /**
   * Cancel a payment session
   */
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await api.post(`/api/payments/cancel/${paymentId}`);
    } catch (error: any) {
      console.error('Failed to cancel payment:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to cancel payment'
      );
    }
  }

  /**
   * Get PayHere configuration info
   */
  getPayHereConfig() {
    return payHereConfig.getConfig();
  }

  /**
   * Get test card information for sandbox mode
   */
  getTestCards() {
    return payHereConfig.getTestCards();
  }

  /**
   * Record a transaction in the database after successful payment
   */
  async recordTransaction(transactionData: TransactionRequest): Promise<TransactionResponse> {
    try {
      // UUID format validation (basic check)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(transactionData.senderId)) {
        console.warn('⚠️ [TRANSACTION] senderId may not be in valid UUID format:', transactionData.senderId);
      } else {
        console.log('✅ [TRANSACTION] senderId is valid UUID format');
      }
      
      if (!uuidRegex.test(transactionData.receiverId)) {
        console.warn('⚠️ [TRANSACTION] receiverId may not be in valid UUID format:', transactionData.receiverId);
      } else {
        console.log('✅ [TRANSACTION] receiverId is valid UUID format');
      }
      
      console.log('💾 [TRANSACTION] Recording transaction:', transactionData);
      console.log('🔗 [TRANSACTION] Backend URL:', api.defaults.baseURL + '/api/transactions/record');
      
      const response = await api.post('/api/transactions/record', transactionData);
      
      console.log('✅ [TRANSACTION] Transaction recorded successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TRANSACTION] Failed to record transaction:', error);
      console.error('❌ [TRANSACTION] Error response:', error.response?.data);
      console.error('❌ [TRANSACTION] Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required to record transaction');
      } else if (error.response?.status === 404) {
        throw new Error('Transaction recording endpoint not found');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid transaction data');
      }
      
      throw new Error(
        error.response?.data?.message || 'Failed to record transaction'
      );
    }
  }

  /**
   * Update payment session status to COMPLETED
   * This should be called after successful payment verification
   */
  async updatePaymentSessionStatus(paymentId: string, status: string = 'COMPLETED'): Promise<any> {
    try {
      console.log('🔄 [PAYMENT STATUS] Updating payment session status...');
      console.log('🔄 [PAYMENT STATUS] Payment ID:', paymentId);
      console.log('🔄 [PAYMENT STATUS] New Status:', status);
      console.log('🔗 [PAYMENT STATUS] Backend URL:', api.defaults.baseURL + `/api/payments/${paymentId}/status`);
      
      const response = await api.put(`/api/payments/${paymentId}/status`, { status });
      
      console.log('✅ [PAYMENT STATUS] Payment session status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [PAYMENT STATUS] Failed to update payment session status:', error);
      console.error('❌ [PAYMENT STATUS] Error response:', error.response?.data);
      console.error('❌ [PAYMENT STATUS] Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required to update payment status');
      } else if (error.response?.status === 404) {
        throw new Error('Payment session not found');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid status update request');
      }
      
      throw new Error(
        error.response?.data?.message || 'Failed to update payment session status'
      );
    }
  }
}

export const paymentApiService = new PaymentApiService();
