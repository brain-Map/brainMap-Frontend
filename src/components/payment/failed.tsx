'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentApiService, PaymentStatusResponse } from '@/services/paymentApi';
import toast from 'react-hot-toast';

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get payment details from URL parameters or localStorage
        const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
        const orderId = searchParams.get('order_id') || searchParams.get('orderId');
        const errorMessage = searchParams.get('error') || searchParams.get('message');
        
        // Try to get payment info from localStorage as fallback
        const storedPayment = localStorage.getItem('currentPayment');
        let paymentInfo = null;
        
        if (storedPayment) {
          paymentInfo = JSON.parse(storedPayment);
        }

        const finalPaymentId = paymentId || paymentInfo?.paymentId;
        const finalOrderId = orderId || paymentInfo?.orderId;

        if (finalPaymentId || finalOrderId) {
          // Verify payment status with backend
          let status: PaymentStatusResponse;
          if (finalPaymentId) {
            status = await paymentApiService.getPaymentStatus(finalPaymentId);
          } else {
            status = await paymentApiService.getPaymentStatusByOrderId(finalOrderId);
          }
          setPaymentStatus(status);
        }

        if (errorMessage) {
          setError(errorMessage);
        }

        toast.error('Payment failed. Please try again.');

      } catch (err: any) {
        console.error('Failed to check payment status:', err);
        setError(err.message || 'Payment failed');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
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

  const handleContactSupport = () => {
    router.push('/contact');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Payment Status</h2>
          <p className="text-gray-600">Please wait while we check your payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
          </p>

          {/* Error Details */}
          {(error || paymentStatus) && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-red-900 mb-3">Error Details</h3>
              <div className="space-y-2 text-sm">
                {error && (
                  <div className="flex justify-between">
                    <span className="text-red-700">Error:</span>
                    <span className="text-red-900 text-right max-w-48 break-words">{error}</span>
                  </div>
                )}
                {paymentStatus && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-red-700">Status:</span>
                      <span className="font-semibold text-red-900">{paymentStatus.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Order ID:</span>
                      <span className="font-mono text-xs text-red-900">{paymentStatus.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Amount:</span>
                      <span className="font-semibold text-red-900">{paymentStatus.currency} {paymentStatus.amount.toLocaleString()}</span>
                    </div>
                    {paymentStatus.message && (
                      <div className="flex justify-between">
                        <span className="text-red-700">Message:</span>
                        <span className="text-red-900 text-right max-w-48 break-words">{paymentStatus.message}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Common Reasons for Payment Failure</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details entered</li>
              <li>• Card expired or blocked</li>
              <li>• Network connection issues</li>
              <li>• Transaction declined by your bank</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Payment Again
            </button>
            <button
              onClick={handleContactSupport}
              className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Contact Support
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
              Need help? Contact our support team for assistance with your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
