import { useEffect, useState } from 'react';

// Mock data for medications
const mockMedications = [
  {
    id: '1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brand: 'Amoxil',
    strength: '500mg',
    form: 'Capsule',
    route: 'Oral',
    dose: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    packSize: '21 capsules',
    controlledDrugSchedule: null,
    bnfCode: '0501020F0',
    manufacturer: 'Pfizer',
    warnings: ['May cause nausea', 'Complete the course'],
    maxDose: '4g per day',
    minAge: 12,
    maxAge: null,
    pregnancyCategory: 'B',
    breastfeedingAdvice: 'Generally considered safe',
    renalAdjustment: 'Use with caution in severe renal impairment',
    hepaticAdjustment: 'Use with caution in severe hepatic impairment'
  },
  {
    id: '2',
    name: 'Metformin',
    genericName: 'Metformin',
    brand: 'Glucophage',
    strength: '500mg',
    form: 'Tablet',
    route: 'Oral',
    dose: '500mg',
    frequency: 'Once or twice daily',
    duration: 'Ongoing',
    packSize: '28 tablets',
    controlledDrugSchedule: null,
    bnfCode: '0601021B0',
    manufacturer: 'Merck',
    warnings: ['May cause gastrointestinal upset', 'Take with food'],
    maxDose: '2g per day',
    minAge: 10,
    maxAge: null,
    pregnancyCategory: 'B',
    breastfeedingAdvice: 'Generally considered safe',
    renalAdjustment: 'Contraindicated in severe renal impairment',
    hepaticAdjustment: 'No adjustment necessary'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    brand: 'Lipitor',
    strength: '20mg',
    form: 'Tablet',
    route: 'Oral',
    dose: '10-80mg',
    frequency: 'Once daily',
    duration: 'Ongoing',
    packSize: '28 tablets',
    controlledDrugSchedule: null,
    bnfCode: '0206010B0',
    manufacturer: 'Pfizer',
    warnings: ['May cause muscle pain', 'Avoid grapefruit juice'],
    maxDose: '80mg per day',
    minAge: 10,
    maxAge: null,
    pregnancyCategory: 'X',
    breastfeedingAdvice: 'Contraindicated',
    renalAdjustment: 'No adjustment necessary',
    hepaticAdjustment: 'Use with caution in hepatic impairment'
  }
];

export function useMedication() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMedications(mockMedications);
      } catch (err) {
        setError('Failed to fetch medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  return { medications, loading, error };
}