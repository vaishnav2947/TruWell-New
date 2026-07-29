import { useEffect, useState } from 'react';
import { usePrescriptionContext } from '@/lib/contexts/PrescriptionContext';

// Mock data for prescriptions
const mockPrescriptions = [
  {
    id: '1',
    prescriptionNumber: 'RX001',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-15',
      nhsNumber: '1234567890'
    },
    medication: {
      id: '1',
      name: 'Amoxicillin',
      strength: '500mg',
      form: 'Capsule'
    },
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    prescriptionNumber: 'RX002',
    patient: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1975-05-22',
      nhsNumber: '0987654321'
    },
    medication: {
      id: '2',
      name: 'Metformin',
      strength: '500mg',
      form: 'Tablet'
    },
    status: 'completed',
    createdAt: '2024-01-14T14:20:00Z'
  }
];

export function usePrescription() {
  const { state, setPrescriptions, setLoading, setError } = usePrescriptionContext();
  const [prescriptions, setPrescriptionsState] = useState<any[]>([]);
  const [loading, setLoadingState] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);

  // Sync with context
  useEffect(() => {
    setPrescriptionsState(state.prescriptions);
  }, [state.prescriptions]);

  useEffect(() => {
    setLoadingState(state.loading);
  }, [state.loading]);

  useEffect(() => {
    setErrorState(state.error);
  }, [state.error]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPrescriptions(mockPrescriptions);
      setPrescriptions(mockPrescriptions); // Update context
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const createPrescription = async (prescriptionData: any) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPrescription = {
        id: Date.now().toString(),
        prescriptionNumber: `RX${Date.now()}`,
        ...prescriptionData,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      // In a real app, we would add to the list via context or API
      setPrescriptions([...prescriptions, newPrescription]);
    } catch (err) {
      setError('Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  // Return the state and actions
  return {
    prescriptions: state.prescriptions,
    loading: state.loading,
    error: state.error,
    fetchPrescriptions,
    createPrescription
  };
}