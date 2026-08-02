"use client";

import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { CheckCircle, Circle, Clock, Mail, FileText, Printer, Download } from 'lucide-react';

export default function SentPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescription Sent</h1>
        <p className="text-gray-600">
          Your prescription has been successfully sent to the pharmacy for fulfilment
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Overview */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Status Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg: 4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-800">Status: Sent</h3>
                <p className="text-sm text-gray-600">
                  The prescription has been transmitted to the pharmacy via secure email
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-center">
              <div>
                <p className="text-xs font-medium text-gray-500">QUEUED</p>
                <p className="text-2xl font-bold text-gray-900">✓</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">SENDING</p>
                <p className="text-2xl font-bold text-gray-900">✓</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">SENT</p>
                <p className="text-2xl font-bold text-gray-900">✓</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">DELIVERED</p>
                <p className="text-2xl font-bold text-gray-500">○</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">OPENED</p>
                <p className="text-2xl font-bold text-gray-500">○</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">COMPLETED</p>
                <p className="text-2xl font-bold text-gray-500">○</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Transmission Details */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Transmission Details</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Prescription ID:</p>
                <p className="text-sm text-gray-700 font-mono">RX-2024-001234</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sent To:</p>
                <p className="text-sm text-gray-700">Harris Pharmacy, London</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sent At:</p>
                <p className="text-sm text-gray-700">
                  Today, 2:30 PM
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Method:</p>
                <p className="text-sm text-gray-700">Encrypted Email (TLS 1.3)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Reference:</p>
                <p className="text-sm text-gray-700">REF-2024-001234</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tracking ID:</p>
                <p className="text-sm text-gray-700">TRK-2024-005678</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">What Happens Next?</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Circle className="h-3 w-3 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-800">Pharmacy Processing</h3>
                <p className="text-sm text-gray-600">
                  The pharmacy will receive and process the prescription
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Circle className="h-3 w-3 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-800">Notification</h3>
                <p className="text-sm text-gray-600">
                  You will be notified when the prescription is dispensed
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Circle className="h-3 w-3 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-800">Pickup/Delivery</h3>
                <p className="text-sm text-gray-600">
                  Patient can collect or arrange delivery
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            // Go back to fulfilment dashboard
          }}
        >
          Back to Fulfilment
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // View tracking details
            alert('Viewing detailed tracking');
          }}
        >
          View Tracking Details
        </Button>
      </div>
    </div>
  );
}