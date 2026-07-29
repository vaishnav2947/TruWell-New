import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { useSelectedPrescription } from '@/lib/contexts/SelectedPrescriptionContext';
import { usePatient } from '@/lib/hooks/usePatient';
import { useMedication } from '@/lib/hooks/useMedication';

export default function PrescriptionDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { selectedPrescription, setSelectedPrescription } = useSelectedPrescription();
  const { prescriptions, loading: prescriptionsLoading, error: prescriptionsError } = usePrescription();
  const { patients, loading: patientsLoading, error: patientsError } = usePatient();
  const { medications, loading: medsLoading, error: medsError } = useMedication();

  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setSelectedPrescription(id);
    }
  }, [id, setSelectedPrescription]);

  useEffect(() => {
    if (selectedPrescription) {
      const found = prescriptions.find((p: any) => p.id === selectedPrescription);
      if (found) {
        setPrescription(found);
        setErrorState(null);
      } else {
        setPrescription(null);
        setErrorState('Prescription not found');
      }
    }
  }, [selectedPrescription, prescriptions]);

  if (prescriptionsLoading || patientsLoading || medsLoading) return <Loader />;
  if (prescriptionsError || patientsError || medsError) return <div className="p-4 text-red-500">Error loading data</div>;

  if (!prescription) {
    return <div className="p-4 text-gray-500">Loading prescription...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescription Details</h1>
        <p className="text-gray-600">Prescription #: {prescription.prescriptionNumber}</p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Patient Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {prescription.patient.firstName} {prescription.patient.lastName}</p>
            <p><strong>Date of Birth:</strong> {new Date(prescription.patient.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>NHS Number:</strong> {prescription.patient.nhsNumber}</p>
            <p><strong>Gender:</strong> {prescription.patient.gender}</p>
            <p><strong>Address:</strong> {prescription.patient.address}</p>
            <p><strong>Phone:</strong> {prescription.patient.phone}</p>
            <p><strong>Email:</strong> {prescription.patient.email}</p>
            <p><strong>GP Practice:</strong> {prescription.patient.gpPractice}</p>
            <p><strong>Preferred Pharmacy:</strong> {prescription.patient.preferredPharmacy}</p>
          </div>
        </Card>

        {/* Medication Information */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Medication Information</h2>
          <div className="space-y-2">
            <p><strong>Medication:</strong> {prescription.medication.name}</p>
            <p><strong>Generic Name:</strong> {prescription.medication.genericName}</p>
            <p><strong>Brand:</strong> {prescription.medication.brand}</p>
            <p><strong>Strength:</strong> {prescription.medication.strength}</p>
            <p><strong>Form:</strong> {prescription.medication.form}</p>
            <p><strong>Route:</strong> {prescription.medication.route}</p>
            <p><strong>Dose:</strong> {prescription.medication.dose}</p>
            <p><strong>Frequency:</strong> {prescription.medication.frequency}</p>
            <p><strong>Duration:</strong> {prescription.medication.duration}</p>
            <p><strong>Pack Size:</strong> {prescription.medication.packSize}</p>
          </div>
        </Card>

        {/* Prescription Details */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Prescription Details</h2>
          <div className="space-y-2">
            <p><strong>Dosage:</strong> {prescription.dosage}</p>
            <p><strong>Frequency:</strong> {prescription.frequency}</p>
            <p><strong>Duration (days):</strong> {prescription.duration}</p>
            <p><strong>Start Date:</strong> {new Date(prescription.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {prescription.endDate ? new Date(prescription.endDate).toLocaleDateString() : 'Not specified'}</p>
            <p><strong>Instructions:</strong> {prescription.instructions}</p>
            <p><strong>Refills:</strong> {prescription.refills}</p>
            <p><strong>Status:</strong>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                prescription.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : prescription.status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : prescription.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : prescription.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {prescription.status}
              </span>
            </p>
            <p><strong>Created:</strong> {new Date(prescription.createdAt).toLocaleString()}</p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push('/prescription')}>
            Back to List
          </Button>
          {prescription.status === 'draft' && (
            <>
              <Button variant="outline" onClick={() => {
                // In a real app, navigate to edit page
                alert('Edit functionality would go here');
              }}>
                Edit
              </Button>
              <Button variant="primary" onClick={() => {
                // Submit for review
                alert('Submitting for review would go here');
              }}>
                Submit for Review
              </Button>
            </>
          )}
          {prescription.status === 'active' && (
            <Button variant="outline" onClick={() => {
              if (window.confirm('Are you sure you want to delete this prescription?')) {
                // Delete functionality
                alert('Delete functionality would go here');
                router.push('/prescription');
              }
            }}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}