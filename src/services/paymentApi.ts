import api from '@/utils/api';
import { payHereConfig } from '@/config/payhere';

export interface PaymentSessionRequest {
  amount: number;
  currency: string;
  orderId: string;
  itemDescription: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  country?: string;
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
}

export const paymentApiService = new PaymentApiService();
