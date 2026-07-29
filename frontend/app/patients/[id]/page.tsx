// frontend/app/patients/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Loader } from '@/components/loader';
import { Users, Search, Calendar, Trash2, Edit3, FileText, ClipboardList, CalendarCheck, Folder, Activity, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore.getState();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, demographics, medical-history, medications, prescriptions, timeline, attachments

  // Fetch patient (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPatient = {
        id: params.id,
        firstName: 'John',
        lastName: 'Doe',
        mrn: 'MRN001',
        phone: '07700 900123',
        email: 'john.doe@example.com',
        dateOfBirth: '1980-01-15',
        registeredDate: '2023-01-15',
        status: 'active',
        address: '123 Pharmacy Street, London, SW1A 1AA',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '07700 900456',
          relationship: 'Spouse'
        },
        medicalHistory: [
          { id: '1', condition: 'Hypertension', diagnosedDate: '2020-01-15', notes: 'Managed with medication' },
          { id: '2', condition: 'Type 2 Diabetes', diagnosedDate: '2021-03-22', notes: 'Diet controlled' }
        ],
        medications: [
          { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', startDate: '2020-02-01', endDate: null },
          { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2021-04-01', endDate: null }
        ],
        prescriptions: [
          { id: '1', prescriptionNumber: 'RX001', medication: 'Amoxicillin', dosage: '500mg', quantity: '21 capsules', prescribedDate: '2023-07-01', status: 'active' },
          { id: '2', prescriptionNumber: 'RX002', medication: 'Paracetamol', dosage: '500mg', quantity: '16 tablets', prescribedDate: '2023-06-15', status: 'completed' }
        ],
        timelineEvents: [
          { id: '1', date: '2023-07-20', type: 'consultation', description: 'Initial consultation for hypertension' },
          { id: '2', date: '2023-07-18', type: 'prescription', description: 'Prescribed Amoxicillin for infection' },
          { id: '3', date: '2023-07-15', type: 'registration', description: 'Patient registered' }
        ],
        attachments: [
          { id: '1', name: 'Consultation Notes.pdf', date: '2023-07-20', size: '245 KB', type: 'application/pdf' },
          { id: '2', name: 'Lab Results.pdf', date: '2023-07-18', size: '1.2 MB', type: 'application/pdf' }
        ]
      };
      setPatient(mockPatient);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Patients</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium {
                patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }">
                {patient.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-gray-500">
                MRN: {patient.mrn}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 pb-2">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${activeTab === 'overview'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('demographics')}
                className={`${activeTab === 'demographics'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Demographics
              </button>
              <button
                onClick={() => setActiveTab('medical-history')}
                className={`${activeTab === 'medical-history'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Medical History
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className={`${activeTab === 'medications'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Medications
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`${activeTab === 'prescriptions'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Prescriptions
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`${activeTab === 'timeline'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('attachments')}
                className={`${activeTab === 'attachments'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium`
              >
                Attachments
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <Card>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Phone:</span> {patient.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Email:</span> {patient.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Address:</span> {patient.address}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Emergency Contact</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Name:</span> {patient.emergencyContact.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Phone:</span> {patient.emergencyContact.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Relationship:</span> {patient.emergencyContact.relationship}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Registration</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Registered:</span> {new Date(patient.registeredDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'demographics' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Date of Birth:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Age:</span> {/* Calculate age */}
                    {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">MRN:</span> {patient.mrn}
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'medical-history' && (
              <div className="space-y-6">
                {patient.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medicalHistory.map((condition) => (
                      <div key={condition.id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{condition.condition}</h4>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Diagnosed:</span> {new Date(condition.diagnosedDate).toLocaleDateString()}
                        </p>
                        {condition.notes && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Notes:</span> {condition.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No medical history recorded</p>
                )}
              </div>
            )}
            {activeTab === 'medications' && (
              <div className="space-y-6">
                {patient.medications.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medications.map((med) => (
                      <div key={med.id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{med.name}</h4>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Dosage:</span> {med.dosage}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Frequency:</span> {med.frequency}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Start Date:</span> {new Date(med.startDate).toLocaleDateString()}
                        </p>
                        {med.endDate && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">End Date:</span> {new Date(med.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No medications recorded</p>
                )}
              </div>
            )}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                {patient.prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {patient.prescriptions.map((pres) => (
                      <div key={pres.id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {pres.medication} <span className="text-xs text-gray-500">({pres.prescriptionNumber})</span>
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Dosage:</span> {pres.dosage}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Quantity:</span> {pres.quantity}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Prescribed:</span> {new Date(pres.prescribedDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium {
                            pres.status === 'active' ? 'bg-green-100 text-green-800' :
                            pres.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {pres.status.charAt(0).toUpperCase() + pres.status.slice(1)}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No prescriptions recorded</p>
                )}
              </div>
            )}
            {activeTab === 'timeline' && (
              className="space-y-6">
                {patient.timelineEvents.length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Patient Timeline</h3>
                      {patient.timelineEvents.length > 0 ? (
                        <div className="space-y-3">
                          {patient.timelineEvents.map((event) => (
                            <div key={event.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0 h-8 w-8 {
                                event.type === 'consultation' ? 'bg-blue-100 text-blue-600' :
                                event.type === 'prescription' ? 'bg-green-100 text-green-600' :
                                event.type === 'registration' ? 'bg-purple-100 text-purple-600' :
                                'bg-gray-100 text-gray-500'
                              } rounded-flex items-center justify-center">
                                {event.type === 'consultation' ? (
                                  <Activity className="h-4 w-4" />
                                ) : event.type === 'prescription' ? (
                                  <FileText className="h-4 w-4" />
                                ) : event.type === 'registration' ? (
                                  <Users className="h-4 w-4" />
                                ) : (
                                  <Calendar className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {event.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(event.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-8">No timeline events recorded</p>
                      )}
                    </div>
                  </div>
            )}
            {activeTab === 'attachments' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Attachments</h3>
                      {patient.attachments.length > 0 ? (
                        <div className="space-y-3">
                          {patient.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 text-gray-500 rounded-flex items-center justify-center">
                                <Folder className="h-4 w-4" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {attachment.name}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center space-x-2">
                                  <span className="font-medium">Date:</span> {new Date(attachment.date).toLocaleDateString()}
                                  <span className="mx-2">•</span>
                                  <span className="font-medium">Size:</span> {attachment.size}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-8">No attachments uploaded</p>
                      )}
                    </div>
                  </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}