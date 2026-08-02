"use client";

import { createContext, useContext, useState } from 'react';

interface SelectedPrescriptionContextProps {
  selectedPrescription: string | null;
  setSelectedPrescription: (id: string | null) => void;
}

const SelectedPrescriptionContext = createContext<SelectedPrescriptionContextProps | undefined>(undefined);

export const SelectedPrescriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  return (
    <SelectedPrescriptionContext.Provider value={{ selectedPrescription, setSelectedPrescription }}>
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