'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentApiService, PaymentStatusResponse } from '@/services/paymentApi';
import { supabase } from '@/lib/superbaseClient';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  
  // useRef to prevent duplicate execution in React Strict Mode
  const hasRecordedTransaction = useRef(false);

  useEffect(() => {
    // Prevent duplicate execution
    if (hasRecordedTransaction.current) {
      console.log('⏭️ [SUCCESS] Transaction already processed, skipping...');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Get payment details from URL parameters or localStorage
        const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
        const orderId = searchParams.get('order_id') || searchParams.get('orderId');
        const mentorId = searchParams.get('mentorId');
        
        console.log('🔍 [SUCCESS] Payment verification started');
        console.log('🔍 [SUCCESS] Payment ID:', paymentId);
        console.log('🔍 [SUCCESS] Order ID:', orderId);
        console.log('🔍 [SUCCESS] Mentor ID:', mentorId);
        
        // Try to get payment info from localStorage as fallback
        const storedPayment = localStorage.getItem('currentPayment');
        let paymentInfo = null;
        
        if (storedPayment) {
          paymentInfo = JSON.parse(storedPayment);
          console.log('📦 [SUCCESS] Stored payment info:', paymentInfo);
        }

        const finalPaymentId = paymentId || paymentInfo?.paymentId;
        const finalOrderId = orderId || paymentInfo?.orderId;
        const finalMentorId = mentorId || paymentInfo?.mentorId;

        // Store mentorId in state for display
        if (finalMentorId) {
          setMentorId(finalMentorId);
          console.log('💾 [SUCCESS] Mentor ID stored in state:', finalMentorId);
        }

        if (!finalPaymentId && !finalOrderId) {
          throw new Error('No payment information found');
        }

        // Verify payment status with backend
        let status: PaymentStatusResponse;
        if (finalPaymentId) {
          console.log('🔍 [SUCCESS] Verifying payment by ID:', finalPaymentId);
          status = await paymentApiService.getPaymentStatus(finalPaymentId);
        } else if (finalOrderId) {
          console.log('🔍 [SUCCESS] Verifying payment by Order ID:', finalOrderId);
          status = await paymentApiService.getPaymentStatusByOrderId(finalOrderId);
        } else {
          throw new Error('Unable to verify payment');
        }

        console.log('✅ [SUCCESS] Payment status:', status);
        setPaymentStatus(status);

        // Record transaction if payment is successful
        if (status.status === 'PENDING') {
          // Mark as processed immediately to prevent duplicate calls
          hasRecordedTransaction.current = true;
          
          try {
            // Get current user from Supabase session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('❌ [SUCCESS] Error getting session:', sessionError);
              throw new Error('Failed to get user session');
            }
            
            const user = session?.user;
            
            console.log('👤 [SUCCESS] Current user from Supabase:', user);
            console.log('👤 [SUCCESS] User ID:', user?.id);
            console.log('👤 [SUCCESS] User email:', user?.email);
            
            if (user && user.id && finalMentorId) {
              console.log('💾 [SUCCESS] Recording transaction and updating payment status...');
              console.log('💾 [SUCCESS] Amount:', status.amount);
              console.log('💾 [SUCCESS] Sender ID (current user):', user.id);
              console.log('💾 [SUCCESS] Receiver ID (mentor):', finalMentorId);
              console.log('💾 [SUCCESS] Payment ID (payment_sessions.payment_id):', finalPaymentId);
              
              // Validate UUID format
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              const isSenderUUID = uuidRegex.test(user.id);
              const isReceiverUUID = uuidRegex.test(finalMentorId);
              
              console.log('🔍 [SUCCESS] Sender ID UUID format:', isSenderUUID ? '✅ Valid' : '❌ Invalid');
              console.log('🔍 [SUCCESS] Receiver ID UUID format:', isReceiverUUID ? '✅ Valid' : '❌ Invalid');
              
              const transactionData = {
                amount: status.amount,
                senderId: user.id,
                receiverId: finalMentorId,
                status: 'COMPLETED',
                paymentId: finalPaymentId || null
              };
              
              console.log('📦 [SUCCESS] Transaction payload:', JSON.stringify(transactionData, null, 2));
              
              // Execute both operations simultaneously using Promise.all
              console.log('⚡ [SUCCESS] Executing transaction record and payment status update simultaneously...');
              console.log('📝 [SUCCESS] Will update payment_sessions WHERE payment_id =', finalPaymentId);
              console.log('🛡️ [SUCCESS] Using useRef guard to prevent duplicate execution');
              
              const [transactionResult, paymentStatusResult] = await Promise.all([
                paymentApiService.recordTransaction(transactionData),
                finalPaymentId ? paymentApiService.updatePaymentSessionStatus(finalPaymentId, 'COMPLETED') : Promise.resolve(null)
              ]);
              
              console.log('✅ [SUCCESS] Transaction recorded successfully:', transactionResult);
              console.log('✅ [SUCCESS] Payment session status updated successfully:', paymentStatusResult);
              toast.success('Payment and transaction recorded successfully!');
            } else {
              console.warn('⚠️ [SUCCESS] Missing user ID or mentor ID, transaction not recorded');
              console.warn('⚠️ [SUCCESS] User:', user);
              console.warn('⚠️ [SUCCESS] User ID:', user?.id);
              console.warn('⚠️ [SUCCESS] Mentor ID:', finalMentorId);
              toast.success('Payment completed successfully!');
            }
          } catch (transactionError: any) {
            console.error('❌ [SUCCESS] Failed to record transaction or update payment status:', transactionError);
            // Don't fail the entire process if transaction recording fails
            toast.success('Payment completed successfully!');
            toast.error('Failed to record transaction in database');
            // Keep the ref as true to prevent retry
          }
          
          // Clear stored payment info on successful verification
          localStorage.removeItem('currentPayment');
        } else {
          console.log('⏭️ [SUCCESS] Payment status is not PENDING, skipping transaction recording');
          toast.error('Payment verification failed');
        }

      } catch (err: any) {
        console.error('❌ [SUCCESS] Payment verification failed:', err);
        setError(err.message || 'Failed to verify payment status');
        toast.error('Failed to verify payment status');
        // Reset the ref on error to allow retry
        hasRecordedTransaction.current = false;
      } finally {
        setLoading(false);
      }
    };
    
    console.log('🔍 [SUCCESS] Search Params:', searchParams);
    console.log('🛡️ [SUCCESS] Has recorded transaction:', hasRecordedTransaction.current);

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    // Navigate to dashboard or appropriate page
    router.push('/');
  };

  const handleViewDetails = () => {
    // Navigate to payment history or transaction details
    router.push('/payment-history');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleContinue}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        {paymentStatus?.status === 'SUCCESS' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for your payment. Your transaction has been completed successfully.</p>
            
            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{paymentStatus.currency} {paymentStatus.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-xs">{paymentStatus.orderId}</span>
                </div>
                {mentorId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor ID:</span>
                    <span className="font-mono text-xs">{mentorId}</span>
                  </div>
                )}
                {paymentStatus.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentStatus.transactionId}</span>
                  </div>
                )}
                {paymentStatus.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{paymentStatus.paymentMethod}</span>
                  </div>
                )}
                {paymentStatus.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(paymentStatus.paymentDate).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleViewDetails}
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                View Payment History
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h2>
            <p className="text-gray-600 mb-6">
              Your payment is being processed. You will receive a confirmation email once the payment is completed.
            </p>
            
            {paymentStatus && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-yellow-600">{paymentStatus.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-xs">{paymentStatus.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{paymentStatus.currency} {paymentStatus.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Check Status Again
              </button>
              <button
                onClick={handleContinue}
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
