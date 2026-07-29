"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { usePatient } from '@/lib/hooks/usePatient';
import { useMedication } from '@/lib/hooks/useMedication';
import { ArrowLeft, CheckCircle, Loader2, Zap } from 'lucide-react';

export default function SignaturePage() {
  const router = useRouter();
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const { prescriptions, loading: prescriptionsLoading, error: prescriptionsError } = usePrescription();
  const { patients, loading: patientsLoading, error: patientsError } = usePatient();
  const { medications, loading: medsLoading, error: medsError } = useMedication();

  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null); // Would be a URL or base64 from signature pad
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const loadPrescription = async () => {
      if (!prescriptionId) return;
      setLoadingState(true);
      setErrorState(null);
      try {
        // Find prescription in the list
        const found = prescriptions.find((p: any) => p.id === prescriptionId);
        if (found) {
          // Check if it's in the correct state for signing
          if (found.status === 'locked' || found.status === 'ready_for_signature') {
            setPrescription(found);
          } else {
            setErrorState('Prescription is not ready for signature');
          }
        } else {
          setErrorState('Prescription not found');
        }
      } catch (err) {
        setErrorState('Failed to load prescription');
      } finally {
        setLoadingState(false);
      }
    };

    if (prescriptionId) {
      loadPrescription();
    }
  }, [prescriptionId, prescriptions]);

  const handleSign = async () => {
    setIsSigning(true);
    try {
      // In a real app, we would:
      // 1. Open a signature pad canvas
      // 2. Capture the signature as an image
      // 3. Upload it to the server
      // 4. Update the prescription with signature data and change status
      // For now, we simulate
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate signature captured (in reality, this would come from the canvas)
      const fakeSignatureUrl = `/signature/${prescriptionId}.png`;
      setSignature(fakeSignatureUrl);

      // Update prescription status (in a real app, we'd call an API)
      // For now, we'll just update local state and then redirect
      const updated = {
        ...prescription,
        signature: fakeSignatureUrl,
        signedAt: new Date().toISOString(),
        status: 'signed' // After signing, it moves to signed status
      };
      setPrescription(updated);

      // In a real app, we would update via API and then navigate to next step
      // For now, we'll go to pharmacy selection
      router.push(`/prescription-fulfilment/pharmacy-selection/${prescriptionId}`);
    } catch (err) {
      setError('Failed to capture signature');
    } finally {
      setIsSigning(false);
    }
  };

  if (prescriptionsLoading || patientsLoading || medsLoading) return <Loader />;
  if (prescriptionsError || patientsError || medsError) return <div className="p-4 text-red-500">Error loading data</div>;

  if (!prescription) {
    return <div className="p-4 text-gray-500">Loading prescription...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/prescription-fulfilment')}
              className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Fulfilment</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Digital Signature</h1>
        </div>
        <p className="text-gray-600">Prescription #: {prescription.prescriptionNumber}</p>
      </div>

      <div className="space-y-6">
        {/* Prescription Summary */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Prescription Summary</h2>
          <div className="space-y-2">
            <p><strong>Patient:</strong> {prescription.patient.firstName} {prescription.patient.lastName}</p>
            <p><strong>Date of Birth:</strong> {new Date(prescription.patient.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>NHS Number:</strong> {prescription.patient.nhsNumber}</p>
            <p><strong>Medication:</strong> {prescription.medication.name} {prescription.medication.strength}</p>
            <p><strong>Dosage:</strong> {prescription.dosage}</p>
            <p><strong>Frequency:</strong> {prescription.frequency}</p>
            <p><strong>Duration:</strong> {prescription.duration} days</p>
            <p><strong>Total Quantity:</strong> {prescription.quantity}</p>
          </div>
        </Card>

        {/* Signature Capture */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Sign Prescription</h2>
          <p className="text-gray-600 mb-4">
            Please provide your digital signature to authorize this prescription.
          </p>

          {/* In a real app, we would have a signature pad canvas here */}
          <div className="border border-dashed rounded p-6 text-center">
            {signature ? (
              <>
                <img src={signature} alt="Signature" className="max-w-full h-auto mb-4" />
                <p className="text-green-600 font-medium">Signature captured</p>
              </>
            ) : (
              <>
                <div className="h-40 flex items-center justify-center border-2 border-dashed rounded">
                  <div className="text-center">
                    <Zap className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Draw your signature here</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="primary"
                    onClick={handleSign}
                    isLoading={isSigning}
                    disabled={isSigning}
                  >
                    {isSigning ? 'Signing...' : 'Sign Prescription'}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Signature details */}
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p><strong>Pharmacist:</strong> John Smith (Pharmacist)</p>
            <p><strong>GPhC Number:</strong> 123456</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>Reason:</strong> Authorisation for private prescription</p>
          </div>

          {/* Confirmation checkbox */}
          <div className="mt-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span>
                I confirm that I am authorised to sign this prescription and that the information
                above is correct.
              </span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}