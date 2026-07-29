import { createContext, useContext, useState } from 'react';

interface SelectedPrescriptionContextProps {
  selectedPrescriptionId: string | null;
  setSelectedPrescriptionId: (id: string | null) => void;
}

const SelectedPrescriptionContext = createContext<SelectedPrescriptionContextProps | undefined>(undefined);

export const SelectedPrescriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

  return (
    <SelectedPrescriptionContext.Provider value={{ selectedPrescriptionId, setSelectedPrescriptionId }}>
      {children}
    </SelectedPrescriptionContext.Provider>
  );
};

export const useSelectedPrescription = () => {
  const context = useContext(SelectedPrescriptionContext);
  if (!context) {
    throw new Error('useSelectedPrescription must be used within a SelectedPrescriptionProvider');
  }
  return context;
};