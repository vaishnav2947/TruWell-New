import { PrescriptionProvider } from '@/lib/contexts/PrescriptionContext';
import { SelectedPrescriptionProvider } from '@/lib/contexts/SelectedPrescriptionContext';

export const metadata = {
  title: 'Prescriptions',
  description: 'Prescription management for TruWell Pharmacy',
};

export default function PrescriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrescriptionProvider>
      <SelectedPrescriptionProvider>
        {children}
      </SelectedPrescriptionProvider>
    </PrescriptionProvider>
  );
}