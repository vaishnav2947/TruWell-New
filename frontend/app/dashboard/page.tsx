"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Badge } from '@/components/badge';
import { Loader } from '@/components/loader';
import { User, FileText, ClipboardList, CheckCircle, Mail } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore.getState();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaysConsultations: 0,
    todaysPrescriptions: 0,
    draftPrescriptions: 0,
    pendingSignatures: 0,
    emailsSent: 0,
    recentPatients: [],
    notifications: [],
  });

  // Fetch dashboard stats (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        todaysConsultations: 12,
        todaysPrescriptions: 8,
        draftPrescriptions: 3,
        pendingSignatures: 5,
        emailsSent: 10,
        recentPatients: [
          { id: '1', name: 'John Doe', mrn: 'MRN001', lastVisit: 'Today, 10:30 AM' },
          { id: '2', name: 'Jane Smith', mrn: 'MRN002', lastVisit: 'Yesterday, 2:15 PM' },
          { id: '3', name: 'Robert Johnson', mrn: 'MRN003', lastVisit: '2 days ago' },
        ],
        notifications: [
          { id: '1', title: 'New patient registered', time: '5 min ago', unread: true },
          { id: '2', title: 'Prescription ready for signing', time: '15 min ago', unread: true },
          { id: '3', title: 'System update scheduled', time: '1 hour ago', unread: false },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Welcome back, {user?.firstName}!!
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Today's Consultations
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.todaysConsultations}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Today's Prescriptions
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.todaysPrescriptions}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Draft Prescriptions
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.draftPrescriptions}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Pending Signatures
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingSignatures}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Emails Sent
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.emailsSent}
                  </p>
                </div>
              </div>
            </Card>

            {/* We can add more stats as needed */}
          </div>

          {/* Recent Patients and Notifications */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Recent Patients Card */}
            <Card className="lg:col-span-2">
              <header className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-800">
                  Recent Patients
                </h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </header>
              <div className="space-y-4">
                {stats.recentPatients.length > 0 ? (
                  stats.recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          MRN: {patient.mrn}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last visit: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No recent patients
                  </p>
                )}
              </div>
            </Card>

            {/* Notifications Card */}
            <Card className="lg:col-span-1">
              <header className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-800">
                  Notifications
                </h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </header>
              <div className="space-y-3">
                {stats.notifications.length > 0 ? (
                  stats.notifications.map((notif) => (
                    <div key={notif.id} className="flex items-center space-x-3 p-2 border-b last:border-b-0">
                      <div className="flex-shrink-0">
                        <div className={`h-3 w-3 rounded-full ${
                          notif.unread ? 'bg-primary-500' : 'bg-gray-300'
                        }`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm font-medium ${
                          notif.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">
                    No notifications
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="primary" onClick={() => {}}>
                New Patient
              </Button>
              <Button variant="primary" onClick={() => {}}>
                New Consultation
              </Button>
              <Button variant="primary" onClick={() => {}}>
                New Prescription
              </Button>
              <Button variant="primary" onClick={() => {}}>
                Find Pharmacy
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}