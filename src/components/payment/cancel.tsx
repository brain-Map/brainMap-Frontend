'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentApiService, PaymentStatusResponse } from '@/services/paymentApi';
import toast from 'react-hot-toast';

export default function PaymentCancel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCancelledPayment = async () => {
      try {
        // Get payment details from URL parameters or localStorage
        const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
        const orderId = searchParams.get('order_id') || searchParams.get('orderId');
        
        // Try to get payment info from localStorage as fallback
        const storedPayment = localStorage.getItem('currentPayment');
        let paymentInfo = null;
        
        if (storedPayment) {
          paymentInfo = JSON.parse(storedPayment);
        }

        const finalPaymentId = paymentId || paymentInfo?.paymentId;
        const finalOrderId = orderId || paymentInfo?.orderId;

        if (finalPaymentId || finalOrderId) {
          try {
            // Check payment status first
            let status: PaymentStatusResponse;
            if (finalPaymentId) {
              status = await paymentApiService.getPaymentStatus(finalPaymentId);
            } else {
              status = await paymentApiService.getPaymentStatusByOrderId(finalOrderId);
            }
            setPaymentStatus(status);

            // If payment is still pending, attempt to cancel it
            if (status.status === 'PENDING' && finalPaymentId) {
              await paymentApiService.cancelPayment(finalPaymentId);
            }
          } catch (error) {
            console.log('Could not check/cancel payment status:', error);
            // This is acceptable as the payment might already be cancelled
          }
        }

        toast.error('Payment was cancelled');

        // Clear stored payment info
        localStorage.removeItem('currentPayment');

      } catch (err: any) {
        console.error('Error handling cancelled payment:', err);
      } finally {
        setLoading(false);
      }
    };

    handleCancelledPayment();
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Clear any stored payment info and redirect to checkout
    localStorage.removeItem('currentPayment');
    router.push('/payment-gateway/checkout');
  };

  const handleGoHome = () => {
    localStorage.removeItem('currentPayment');
    router.push('/');
  };

  const handleBrowseServices = () => {
    localStorage.removeItem('currentPayment');
    router.push('/services'); // Adjust this path based on your app structure
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Cancellation</h2>
          <p className="text-gray-600">Please wait while we process your cancellation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been cancelled. No charges have been made to your account.
          </p>

          {/* Payment Details (if available) */}
          {paymentStatus && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-yellow-900 mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Status:</span>
                  <span className="font-semibold text-yellow-900">{paymentStatus.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Order ID:</span>
                  <span className="font-mono text-xs text-yellow-900">{paymentStatus.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Amount:</span>
                  <span className="font-semibold text-yellow-900">{paymentStatus.currency} {paymentStatus.amount.toLocaleString()}</span>
                </div>
                {paymentStatus.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Cancelled At:</span>
                    <span className="text-yellow-900">{new Date(paymentStatus.paymentDate).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• No charges were made to your payment method</li>
              <li>• You can retry the payment at any time</li>
              <li>• Your order will not be processed until payment is completed</li>
              <li>• If you have questions, contact our support team</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Complete Payment
            </button>
            <button
              onClick={handleBrowseServices}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Browse Services
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need assistance? <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
