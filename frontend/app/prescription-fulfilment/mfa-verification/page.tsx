"use client";

import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Mail, Phone, RefreshCw, HardDrive } from 'lucide-react';

export default function MFAVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MFA Verification</h1>
        <p className="text-gray-600">For security, please verify your identity before sending the prescription</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Verify Your Identity</h2>
          <p className="text-gray-600 mb-4">
            We've sent a verification code to your registered email address. Please enter the code below.
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Code sent to: <span className="font-medium">j*****s@truw.pharmacy</span>
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="flex-1 text-center text-lg font-medium text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoComplete="off"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Didn't receive the code? <span className="text-primary-600 cursor-pointer">Resend</span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Go back to email preview
                }}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // In a real app, verify the code and proceed
                  alert('Code verified successfully');
                  // Then proceed to send prescription
                }}
              >
                Verify & Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Alternative methods */}
        <Card className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Other Verification Methods</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">SMS Verification</h3>
                <p className="text-sm text-gray-600">
                  Send a code to your phone number ending in **1234
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Authenticator App</h3>
                <p className="text-sm text-gray-600">
                  Use your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Backup Codes</h3>
                <p className="text-sm text-gray-600">
                  Use one of your backup codes
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}