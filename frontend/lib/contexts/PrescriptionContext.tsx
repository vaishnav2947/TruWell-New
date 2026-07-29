import { createContext, useContext, useState, ReactNode } from 'react';

interface PrescriptionContextProps {
  selectedPrescription: string | null;
  setSelectedPrescription: (id: string | null) => void;
}

const PrescriptionContext = createContext<PrescriptionContextProps | undefined>(undefined);

export const PrescriptionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  return (
    <PrescriptionContext.Provider value={{ selectedPrescription, setSelectedPrescription }}>
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescriptionContext must be used within a PrescriptionProvider');
  }
  return context;
};