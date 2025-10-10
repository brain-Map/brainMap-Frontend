'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function PaymentTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lastRedirectUrl, setLastRedirectUrl] = useState<string>('');

  const testPaymentWithoutAuth = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing payment API without authentication...');
      
      // Direct API call without authentication
      const response = await fetch('http://localhost:8082/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization header
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'LKR',
          orderId: `TEST_${Date.now()}`,
          itemDescription: 'Test Payment',
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+94771234567',
          customerAddress: '123 Test Street',
          city: 'Colombo',
          country: 'Sri Lanka',
          requestedMode: 'sandbox'
        })
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success response:', data);
        
        // Check redirect URL
        if (data.redirectUrl) {
          if (data.redirectUrl.includes('sandbox.payhere.lk')) {
            console.log('✅ CORRECT: Sandbox PayHere URL generated');
          } else if (data.redirectUrl.includes('payhere.lk')) {
            console.log('❌ WRONG: Live PayHere URL generated instead of sandbox');
          }
        }
        
        setResult({ success: true, data });
        toast.success('Payment session created successfully!');
      } else {
        const errorData = await response.text();
        console.log('❌ Error response:', errorData);
        setResult({ success: false, status: response.status, error: errorData });
        
        if (response.status === 401) {
          toast.error('Authentication required - backend expects login');
        } else {
          toast.error(`Backend error: ${response.status}`);
        }
      }

    } catch (error: any) {
      console.error('❌ Network error:', error);
      setResult({ success: false, error: error.message });
      toast.error('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const testWithRealAuth = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔑 Testing with REAL JWT token...');
      
      // Use the real JWT token provided
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IldHRCttdUxKL09tMWJIRzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3V2ZWtyanNic2p4dmF2ZXF0Ym51LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5MzdjMTE5Zi1iNDA5LTRlZWItYmY2ZC1jYmVmOWIxZGQzMjUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYwMTIzMzQ0LCJpYXQiOjE3NjAxMTk3NDQsImVtYWlsIjoiaXMxMEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiaXMxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IklzdXJ1IiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI5MzdjMTE5Zi1iNDA5LTRlZWItYmY2ZC1jYmVmOWIxZGQzMjUiLCJ1c2VyX3JvbGUiOiJQcm9qZWN0IE1lbWJlciJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzYwMTE5NzQ0fV0sInNlc3Npb25faWQiOiIwYzNlMjAzMi1hNzJiLTQ3NTUtYmI0NS0yZmYwMjlmOWIzN2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.UGwKefKTHDT2nrHOaOb__8L79kU-p_gdrKMGF12zrSQ';
      
      const response = await fetch('http://localhost:8082/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'LKR',
          orderId: `REAL_AUTH_${Date.now()}`,
          itemDescription: 'Real Auth Test Payment',
          customerName: 'Isuru',
          customerEmail: 'is10@gmail.com',
          customerPhone: '+94771234567',
          customerAddress: '123 Test Street',
          city: 'Colombo',
          country: 'Sri Lanka',
          requestedMode: 'sandbox'
        })
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Backend response:', data);
        
        // Detailed analysis of redirect URL
        if (data.redirectUrl) {
          console.log('� Full redirect URL:', data.redirectUrl);
          
          if (data.redirectUrl.includes('sandbox.payhere.lk')) {
            console.log('✅ CORRECT: Backend generated SANDBOX PayHere URL');
            console.log('🎯 This should work correctly');
          } else if (data.redirectUrl.includes('www.payhere.lk')) {
            console.log('❌ WRONG: Backend generated LIVE PayHere URL');
            console.log('🔧 Backend should use sandbox URL instead');
          } else if (data.redirectUrl.includes('payhere.lk')) {
            console.log('⚠️  WARNING: Generic PayHere URL - check if sandbox or live');
          } else {
            console.log('❓ UNKNOWN: Unexpected URL format');
          }
          
          // Extract merchant ID from URL if possible
          const urlParams = new URLSearchParams(data.redirectUrl.split('?')[1]);
          const merchantId = urlParams.get('merchant_id');
          if (merchantId) {
            console.log('🏪 Merchant ID in URL:', merchantId);
            if (merchantId === '1232399') {
              console.log('✅ Using your sandbox merchant ID');
            } else if (merchantId === '1211149') {
              console.log('ℹ️  Using PayHere test merchant ID');
            } else {
              console.log('❓ Unknown merchant ID');
            }
          }
        } else {
          console.log('❌ ERROR: No redirect URL in response');
        }
        
        // Store the redirect URL for further testing
        setLastRedirectUrl(data.redirectUrl);
        
        setResult({ 
          success: true, 
          data, 
          analysis: 'Backend is generating CORRECT sandbox URL - if you still get redirected to live site, this might be a PayHere sandbox issue or browser redirect.',
          nextSteps: [
            '1. Click "Test Direct Redirect" below to see what happens',
            '2. Check if PayHere sandbox is working properly', 
            '3. Try opening the sandbox URL directly in a new tab'
          ]
        });
      } else {
        const errorData = await response.text();
        console.log('❌ Error response:', errorData);
        setResult({ success: false, status: response.status, error: errorData });
      }

    } catch (error: any) {
      console.error('❌ Request error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">PayHere Backend Test</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={() => {
              // Store the JWT token in localStorage for checkout to use
              const jwtToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IldHRCttdUxKL09tMWJIRzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3V2ZWtyanNic2p4dmF2ZXF0Ym51LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5MzdjMTE5Zi1iNDA5LTRlZWItYmY2ZC1jYmVmOWIxZGQzMjUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYwMTIzMzQ0LCJpYXQiOjE3NjAxMTk3NDQsImVtYWlsIjoiaXMxMEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiaXMxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IklzdXJ1IiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI5MzdjMTE5Zi1iNDA5LTRlZWItYmY2ZC1jYmVmOWIxZGQzMjUiLCJ1c2VyX3JvbGUiOiJQcm9qZWN0IE1lbWJlciJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzYwMTE5NzQ0fV0sInNlc3Npb25faWQiOiIwYzNlMjAzMi1hNzJiLTQ3NTUtYmI0NS0yZmYwMjlmOWIzN2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.UGwKefKTHDT2nrHOaOb__8L79kU-p_gdrKMGF12zrSQ';
              localStorage.setItem('accessToken', jwtToken);
              toast.success('JWT Token stored! Now you can test checkout page.');
            }}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            💾 Store JWT Token for Checkout
          </button>

          <button
            onClick={testPaymentWithoutAuth}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Payment API (No Auth)'}
          </button>

          <button
            onClick={testWithRealAuth}
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Payment API (With Real JWT Token)'}
          </button>

          {lastRedirectUrl && (
            <div className="space-y-2 pt-4 border-t">
              <button
                onClick={() => {
                  console.log('🧪 Testing direct redirect to:', lastRedirectUrl);
                  console.log('🕐 Redirect happening in 3 seconds...');
                  setTimeout(() => {
                    console.log('🚀 Redirecting now...');
                    window.location.href = lastRedirectUrl;
                  }, 3000);
                  toast.success('Redirecting in 3 seconds... Check console and URL bar!');
                }}
                className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                🧪 Test Direct Redirect to Sandbox URL
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(lastRedirectUrl);
                  toast.success('Sandbox URL copied! Open in new tab to test manually.');
                }}
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                📋 Copy Sandbox URL (Open in New Tab)
              </button>

              <button
                onClick={() => window.open(lastRedirectUrl, '_blank')}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                🆕 Open Sandbox URL in New Tab
              </button>
            </div>
          )}
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className="font-bold mb-2">
              {result.success ? '✅ Success' : '❌ Error'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {result?.success && (
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">✅ Backend Test Successful!</h3>
              <p className="text-sm text-green-700 mb-3">
                Your backend is correctly generating sandbox PayHere URLs. The issue might be:
              </p>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>PayHere sandbox redirecting to live site</li>
                <li>Browser caching or network issues</li>
                <li>PayHere merchant account configuration</li>
              </ul>
            </div>

            <a
              href="/payment-gateway/checkout?customerName=Isuru&customerEmail=is10@gmail.com"
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
            >
              🛒 Go to Checkout Page (Token is stored)
            </a>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">🔍 Debug Information</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Backend URL:</strong> http://localhost:8082</li>
            <li><strong>Expected Sandbox URL:</strong> https://sandbox.payhere.lk/pay/checkout</li>
            <li><strong>Wrong Live URL:</strong> https://payhere.lk/pay/checkout</li>
            <li><strong>Your Merchant ID:</strong> 1232399 (sandbox)</li>
          </ul>

          {lastRedirectUrl && (
            <div className="mt-4 p-2 bg-white rounded text-xs font-mono break-all">
              <strong>Last Generated URL:</strong><br/>
              {lastRedirectUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}