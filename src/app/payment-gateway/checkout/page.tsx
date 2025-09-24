'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentApiService, PaymentSessionRequest } from '@/services/paymentApi';
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
  amount = 1000,
  currency = 'LKR',
  orderId = `ORDER_${Date.now()}`,
  itemDescription = 'BrainMap Service',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  customerAddress = '',
  city = 'Colombo',
  country = 'Sri Lanka'
}: CheckoutProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    city,
    country
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayWithPayHere = async () => {
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
      const paymentRequest: PaymentSessionRequest = {
        amount,
        currency,
        orderId,
        itemDescription,
        customerName: paymentData.customerName.trim(),
        customerEmail: paymentData.customerEmail.trim(),
        customerPhone: paymentData.customerPhone.trim() || undefined,
        customerAddress: paymentData.customerAddress.trim() || undefined,
        city: paymentData.city.trim(),
        country: paymentData.country.trim()
      };

      // Call backend to create PayHere payment session
      const response = await paymentApiService.createPaymentSession(paymentRequest);
      
      // Store payment info in localStorage for later use
      localStorage.setItem('currentPayment', JSON.stringify({
        paymentId: response.paymentId,
        orderId: response.orderId,
        amount: response.amount,
        currency: response.currency
      }));

      // Redirect to PayHere hosted payment page
      window.location.href = response.redirectUrl;
      
    } catch (error: any) {
      console.error('Payment session creation failed:', error);
      toast.error(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
            <p className="text-gray-600">Secure payment with PayHere</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Item:</span>
              <span className="text-gray-900">{itemDescription}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="text-gray-900 text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total:</span>
              <span>{currency} {amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Customer Information</h3>
            
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                value={paymentData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="customerEmail"
                value={paymentData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={paymentData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="customerAddress"
                value={paymentData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={paymentData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={paymentData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayWithPayHere}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Pay with PayHere'
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your payment information is secured by PayHere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
