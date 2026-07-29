"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { usePatient } from '@/lib/hooks/usePatient';
import { useMedication } from '@/lib/hooks/useMedication';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const { createPrescription } = usePrescription();
  const { patients, loading: patientsLoading, error: patientsError } = usePatient();
  const { medications, loading: medsLoading, error: medsError } = useMedication();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (patientsLoading || medsLoading) return <Loader />;
  if (patientsError || medsError) return <div className="p-4 text-red-500">Error loading data</div>;

  const [formData, setFormData] = useState({
    patientId: '',
    medicationId: '',
    dosage: '',
    frequency: '',
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    refills: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call the prescription service to create a new prescription
      await createPrescription({
        patientId: formData.patientId,
        medicationId: formData.medicationId,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        instructions: formData.instructions,
        refills: formData.refills,
      });
      // In a real app, we would call the API and then redirect
      router.push('/prescription');
    } catch (err) {
      setError('Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Prescription</h1>
        <p className="text-gray-600">Create a new prescription for a patient</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} ({patient.mrn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
              <select
                name="medicationId"
                value={formData.medicationId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a medication</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} ({med.strength})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 10mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Once daily"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="1"
                max="365"
              />
            </div
Let's continue writing the file. We'll cut off here and continue in the next response<tool_call>
<function=Write>
<parameter=content>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="3"
                placeholder="Special instructions for the patient"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Refills</label>
              <input
                type="number"
                name="refills"
                value={formData.refills}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="0"
                max="11"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <Button type="submit" variant="primary" isLoading={loading}>
              {loading ? 'Creating...' : 'Create Prescription'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/prescription')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}