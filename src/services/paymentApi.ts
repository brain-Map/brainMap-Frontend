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

      // Add PayHere configuration to request
      const requestPayload = {
        ...paymentData,
        // Include PayHere mode and configuration for backend
        payHereMode: payHereConfig.getConfig().mode,
        payHereMerchantId: payHereConfig.getMerchantId(),
        payHereApiUrl: payHereConfig.getApiUrl(),
        isSandbox: payHereConfig.isSandboxMode()
      };

      const response = await api.post('/api/payments/create-session', requestPayload);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create payment session:', error);
      
      // Enhanced error logging for sandbox mode
      if (payHereConfig.isSandboxMode()) {
        console.log('PayHere Sandbox Mode - Configuration:', payHereConfig.getConfig());
      }
      
      throw new Error(
        error.response?.data?.message || 'Failed to create payment session'
      );
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
