import { useEffect, useState } from 'react';

// Mock data for patients
const mockPatients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-01-15',
    nhsNumber: '1234567890',
    phone: '07700 900123',
    email: 'john.doe@example.com',
    address: '123 Pharmacy Street, London, SW1A 1AA',
    gpPractice: 'London Medical Practice',
    preferredPharmacy: 'TruWell Pharmacy',
    allergies: ['Penicillin'],
    highRiskMedicines: ['Warfarin'],
    existingConditions: ['Hypertension', 'Type 2 Diabetes'],
    gender: 'Male'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1975-05-22',
    nhsNumber: '0987654321',
    phone: '07700 900456',
    email: 'jane.smith@example.com',
    address: '456 Health Avenue, Manchester, M1 1AA',
    gpPractice: 'Manchester Health Centre',
    preferredPharmacy: 'TruWell Pharmacy',
    allergies: ['Peanuts'],
    highRiskMedicines: [],
    existingConditions: ['Asthma'],
    gender: 'Female'
  }
];

export function usePatient() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setPatients(mockPatients);
      } catch (err) {
        setError('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, loading, error };
}