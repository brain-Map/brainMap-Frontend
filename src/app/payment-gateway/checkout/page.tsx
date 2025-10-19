'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentApiService, PaymentSessionRequest } from '@/services/paymentApi';
import { payHereConfig } from '@/config/payhere';
import toast from 'react-hot-toast';

interface CheckoutProps {
  // Props can be passed from parent component or URL params
  amount?: number;
  currency?: string;
  orderId?: string;
  itemDescription?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  country?: string;
}

export default function CheckoutPage({
  amount: propAmount = 1000,
  currency = 'LKR',
  orderId: propOrderId = `ORDER_${Date.now()}`,
  itemDescription: propItemDescription = 'BrainMap Service',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  customerAddress = '',
  city = 'Colombo',
  country = 'Sri Lanka'
}: CheckoutProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentData, setPaymentData] = useState({
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    city,
    country
  });
  const [showTestCards, setShowTestCards] = useState(false);
  
  // Dynamic payment details from URL params
  const [amount, setAmount] = useState(propAmount);
  const [itemDescription, setItemDescription] = useState(propItemDescription);
  const [orderId, setOrderId] = useState(propOrderId);
  const [serviceId, setServiceId] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [mentorId, setMentorId] = useState<string>('');

  // Get PayHere configuration
  const payHereConfigData = payHereConfig.getConfig();
  const testCards = payHereConfig.getTestCards();

  // Extract query parameters on mount
  useEffect(() => {
    console.log('🔍 [CHECKOUT] Checking for URL parameters...');
    
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    const serviceTitleParam = params.get('serviceTitle');
    const serviceIdParam = params.get('serviceId');
    const bookingIdParam = params.get('bookingId');
    const mentorIdParam = params.get('mentorId');
    
    console.log('📊 [CHECKOUT] URL Parameters:', {
      amount: amountParam,
      serviceTitle: serviceTitleParam,
      serviceId: serviceIdParam,
      bookingId: bookingIdParam,
      mentorId: mentorIdParam
    });
    
    // Update state with URL parameters if they exist
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      setAmount(parsedAmount);
      console.log('💰 [CHECKOUT] Amount set to:', parsedAmount);
    }
    
    if (serviceTitleParam) {
      setItemDescription(serviceTitleParam);
      console.log('📝 [CHECKOUT] Service title set to:', serviceTitleParam);
    }
    
    if (serviceIdParam) {
      setServiceId(serviceIdParam);
      setOrderId(`ORDER_${serviceIdParam}_${Date.now()}`);
      console.log('🆔 [CHECKOUT] Service ID set to:', serviceIdParam);
    }
    
    if (bookingIdParam) {
      setBookingId(bookingIdParam);
      console.log('📋 [CHECKOUT] Booking ID set to:', bookingIdParam);
    }
    
    if (mentorIdParam) {
      setMentorId(mentorIdParam);
      console.log('👤 [CHECKOUT] Mentor ID set to:', mentorIdParam);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (!token) {
      console.warn('⚠️ No authentication token found - payment may require login');
    } else {
      console.log('✅ User is authenticated - ready for payment');
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayWithPayHere = async () => {
    // Check authentication first
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please log in to continue with payment');
      console.error('🚫 Authentication required: No JWT token found');
      // Optionally redirect to login
      // router.push('/login?redirect=/payment-gateway/checkout');
      return;
    }

    console.log('🔐 Authentication token present:', token.substring(0, 20) + '...');

    // Validate required fields
    if (!paymentData.customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    
    if (!paymentData.customerEmail.trim()) {
      toast.error('Customer email is required');
      return;
    }

    if (!paymentData.customerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    try {
      // Split customerName into firstName and lastName
      const nameParts = paymentData.customerName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use first name as last name if only one name provided
      
      const paymentRequest: PaymentSessionRequest = {
        amount,
        currency,
        orderId,
        itemDescription,
        firstName: firstName,
        lastName: lastName,
        email: paymentData.customerEmail.trim(),
        phone: paymentData.customerPhone.trim() || undefined,
        address: paymentData.customerAddress.trim() || undefined,
        city: paymentData.city.trim(),
        country: paymentData.country.trim()
      };

      // Call backend to create PayHere payment session
      console.log('🚀 Sending payment request:', paymentRequest);
      
      const response = await paymentApiService.createPaymentSession(paymentRequest);
      
      console.log('✅ Backend response:', response);
      console.log('🔗 Redirect URL:', response.redirectUrl);
      
      // Check if redirect URL contains sandbox
      if (response.redirectUrl) {
        if (response.redirectUrl.includes('sandbox.payhere.lk')) {
          console.log('✅ Correct: Redirecting to SANDBOX PayHere');
        } else if (response.redirectUrl.includes('payhere.lk')) {
          console.log('❌ WARNING: Redirecting to LIVE PayHere instead of sandbox!');
          console.log('🔍 Full URL:', response.redirectUrl);
        } else {
          console.log('❓ Unknown redirect URL format:', response.redirectUrl);
        }
      } else {
        console.log('❌ ERROR: No redirect URL received from backend');
      }
      
      // Store payment info in localStorage for later use
      localStorage.setItem('currentPayment', JSON.stringify({
        paymentId: response.paymentId,
        orderId: response.orderId,
        amount: response.amount,
        currency: response.currency,
        mentorId: mentorId || undefined
      }));

      console.log('💾 [CHECKOUT] Stored payment info with mentor ID:', mentorId);

      // Redirect to PayHere hosted payment page
      window.location.href = response.redirectUrl;
      
    } catch (error: any) {
      console.error('Payment session creation failed:', error);
      
      // Handle specific error cases
      if (error.message.includes('Authentication required') || error.message.includes('log in')) {
        toast.error('Authentication required. Please log in to continue.');
        console.error('🚫 Authentication error detected');
        // Optionally redirect to login after a delay
        // setTimeout(() => router.push('/login?redirect=/payment-gateway/checkout'), 2000);
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        console.error('🚫 401 Unauthorized: Token may be invalid or expired');
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        // Optionally redirect to login
        // setTimeout(() => router.push('/login?redirect=/payment-gateway/checkout'), 2000);
      } else {
        toast.error(error.message || 'Failed to initialize payment. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h2>
          <p className="text-gray-600">Secure payment with PayHere</p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
          {/* Sandbox Mode Indicator */}
          {payHereConfigData.isSandbox && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">SANDBOX MODE</span>
              </div>
              <p className="text-sm mt-1 text-center">Using PayHere test environment</p>
            </div>
          )}

          {/* Authentication Status Indicator */}
          <div className={`px-4 py-3 rounded-md ${isAuthenticated ? 'bg-green-100 border border-green-400 text-green-800' : 'bg-red-100 border border-red-400 text-red-800'}`}>
            <div className="flex items-center justify-center">
              {isAuthenticated ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Authenticated</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Not Authenticated</span>
                </>
              )}
            </div>
            <p className="text-sm mt-1 text-center">
              {isAuthenticated ? 'Ready to proceed with payment' : 'Please log in to continue'}
            </p>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Summary & Test Cards */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Item:</span>
                  <span className="text-gray-900 font-medium">{itemDescription}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="text-gray-900 text-sm font-mono">{orderId}</span>
                </div>
                {mentorId && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Mentor ID:</span>
                    <span className="text-gray-900 text-sm font-mono">{mentorId}</span>
                  </div>
                )}
                {serviceId && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Service ID:</span>
                    <span className="text-gray-900 text-sm font-mono">{serviceId}</span>
                  </div>
                )}
                {bookingId && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="text-gray-900 text-sm font-mono">{bookingId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{currency} {amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Sandbox Test Cards Information */}
            {payHereConfigData.isSandbox && testCards && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-primary flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Test Cards for Sandbox
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTestCards(!showTestCards)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                  >
                    {showTestCards ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showTestCards && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <p className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-2xl mr-2">💳</span> Visa
                      </p>
                      <p className="font-mono text-sm text-gray-700">
                        {testCards.visa.number}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-600">Expiry: {testCards.visa.expiry}</span>
                        <span className="text-xs text-gray-600">CVV: {testCards.visa.cvv}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <p className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-2xl mr-2">💳</span> Mastercard
                      </p>
                      <p className="font-mono text-sm text-gray-700">
                        {testCards.mastercard.number}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-600">Expiry: {testCards.mastercard.expiry}</span>
                        <span className="text-xs text-gray-600">CVV: {testCards.mastercard.cvv}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-2xl mr-2">💳</span> American Express
                      </p>
                      <p className="font-mono text-sm text-gray-700">
                        {testCards.american_express.number}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-600">Expiry: {testCards.american_express.expiry}</span>
                        <span className="text-xs text-gray-600">CVV: {testCards.american_express.cvv}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Use these test cards on the PayHere payment page for sandbox testing
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  🔒 Your payment information is secured by PayHere
                </p>
                {payHereConfigData.isSandbox && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Currently in {payHereConfigData.mode.toUpperCase()} mode - No real charges will be made
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Customer Information Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={paymentData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  value={paymentData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  value={paymentData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="customerAddress"
                  value={paymentData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={paymentData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={paymentData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayWithPayHere}
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-md font-semibold text-white text-lg transition-all transform hover:scale-105 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay with PayHere
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
