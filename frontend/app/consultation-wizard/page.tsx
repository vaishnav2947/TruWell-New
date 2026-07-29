// frontend/app/consultation-wizard/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useConsultationWizard, useConsultationWizardActions } from '@/lib/contexts/ConsultationWizardContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { Users, ArrowLeft, Save, CheckCircle, Loader2, AlertTriangle, CircleHelp, Info } from 'lucide-react';
import { MdOutlinePerson, MdOutlineLocationOn, MdOutlinePhone, MdOutlineEmail, MdOutlineMedicalInformation, MdOutlineAssessment } from 'react-icons/md';

// Stepper component
const Stepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const steps = [
    { id: 1, label: 'Patient Confirmation' },
    { id: 2, label: 'Identity Verification' },
    { id: 3, label: 'Consultation Details' },
    { id: 4, label: 'Clinical Assessment' },
    { id: 5, label: 'Medical History Review' },
    { id: 6, label: 'Clinical Checks' },
    { id: 7, label: 'Consent' },
    { id: 8, label: 'Consultation Outcome' },
    { id: 9, label: 'Clinical Notes' },
    { id: 10, label: 'Review' },
    { id: 11, label: 'Final Validation' },
    { id: 12, label: 'Complete Consultation' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex-1 h-0.5 bg-gray-200 rounded">
          <div
            className={`h-0.5 bg-primary-600 rounded ${currentStep === totalSteps === 1 ? 'w-0' : `w-[${((currentStep - 1) / (totalSteps - 1)) * 100}%]`}`}
            style={{ height: '0.5px' }}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`col-span-1 flex items-center space-x-2 text-xs font-medium ${
              step.id === currentStep
                ? 'text-primary-600'
                : step.id < currentStep
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                step.id === currentStep
                  ? 'border-primary-600 bg-primary-50'
                  : step.id < currentStep
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              } flex items-center justify-center`}
            >
              {step.id === currentStep ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : step.id < currentStep ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <span className="font-bold">{step.id}</span>
              )}
            </div>
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sticky Patient Banner
const PatientBanner = ({ patient }: { patient: any | null }) => {
  if (!patient) {
    return <div className="mb-6">Loading patient information...</div>;
  }

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="sticky top-0 z-20 bg-white border-b pb-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  MRN: {patient.mrn} | DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} | Age: {age} years
                </p>
                {patient.gender && (
                  <p className="text-sm text-gray-500">Gender: {patient.gender}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Phone: {patient.phone}</span>
              <span>Email: {patient.email}</span>
              <span>Address: {patient.address}</span>
              {patient.gpPractice && <span>GP: {patient.gpPractice}</span>}
              {patient.preferredPharmacy && <span>Pharmacy: {patient.preferredPharmacy}</span>}
            </div>
          </div>
          {/* Warnings */}
          {(
            (patient.allergies && patient.allergies.length > 0) ||
            (patient.highRiskMedicines && patient.highRiskMedicines.length > 0) ||
            (patient.existingConditions && patient.existingConditions.length > 0)
          ) && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <h3 className="font-medium text-yellow-800 flex items-center">
                <span className="mr-2">⚠️</span> Patient Alerts
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {patient.allergies?.map(( allergy: string, index: number ) => (
                  <li key=`allergy-${index}` className="flex items-start">
                    <span className="mr-2">•</span">•</span
Allergy:> >{/*)}

  patient.highRiskMedicines?.map(( med: string, index: number ) => (
    <li key={`hrm-${index}`} className="flex items-start">
      <span className="mr-_2ellipsis">•</span
      <span>High Risk Medicine: {med}</span
    >
    />
  ))}
  patient.existingConditions?.map(( condition: string, index: number ) => (
    <li key={`condition-${index}`} className="flex items-start">
      <span className="mr-_2ellipsis">•</span
      <span>Condition: {condition}</span
    >
    />
  ))}

            </ul>
          </div>
        )
      }
    </div>
  );
};

export default function ConsultationWizardPage() {
  const { state } = useConsultationWizard();
  const {
    setCurrentStep,
    updateFormData,
    setPatient,
    setLoading,
    goToNextStep,
    goToPreviousStep,
    resetWizard,
    manualSave,
    clearDraft
  } = useConsultationWizardActions();
  const router = useRouter();

  // Get patientId from query params or state
  const patientId = new URLSearchParams(window.location.search).get('patientId');

  // Fetch patient data if we have a patientId and don't have patient yet
  useEffect(() => {
    if (patientId && !state.patient) {
      setLoading(true);
      // Simulate fetching patient data
      setTimeout(() => {
        const mockPatient = {
          id: patientId,
          firstName: 'John',
          lastName: 'Doe',
          mrn: 'MRN001',
          dateOfBirth: '1980-01-15',
          phone: '07700 900123',
          email: 'john.doe@example.com',
          address: '123 Pharmacy Street, London, SW1A 1AA',
          gpPractice: 'London Medical Practice',
          preferredPharmacy: 'TruWell Pharmacy',
          allergies: ['Penicillin'],
          highRiskMedicines: ['Warfarin'],
          existingConditions: ['Hypertension', 'Type 2 Diabetes'],
          gender: 'Male',
          // Additional fields for medical history
          medicalConditions: ['Hypertension', 'Type 2 Diabetes'],
          currentMedications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
          ],
          previousPrescriptions: [
            { drug: 'Amoxicillin', date: '2023-05-10', indication: 'Chest infection' },
            { drug: 'Atorvastatin', date: '2022-11-03', indication: 'High cholesterol' }
          ],
          hospitalAdmissions: [
            { date: '2022-03-15', reason: 'Pneumonia', duration: '3 days' }
          ],
          surgeries: [
            { procedure: 'Appendectomy', date: '2010-07-22' }
          ],
          familyHistory: [
            { relation: 'Father', condition: 'Hypertension', ageAtDiagnosis: 58 },
            { relation: 'Mother', condition: 'Breast Cancer', ageAtDiagnosis: 62 }
          ],
          lifestyleFactors: {
            smoking: 'Never',
            alcohol: 'Occasional',
            exercise: '3 times per week',
            pregnancy: 'N/A'
          }
        };
        setPatient(mockPatient);
        setLoading(false);
      }, 500);
    }
  }, [patientId, state.patient, setPatient, setLoading]);

  // Handle beforeunload to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  const handleNextStep = () => {
    // For steps 1-4, we only allow progressing if the step is valid
    // For steps 5-12, we allow progressing without validation (placeholders)
    if (state.currentStep >= 1 && state.currentStep <= 4) {
      // The step component should have handled validation and only called onValidated if valid
      // So we can just proceed
      goToNextStep();
    } else {
      goToNextStep();
    }
  };

  const handlePreviousStep = () => {
    goToPreviousStep();
  };

  const handleSaveDraft = () => {
    manualSave();
  };

  // Handle discarding changes (if needed)
  const handleDiscardChanges = () => {
    if (window.confirm('Are you sure you want to discard all changes? This cannot be undone.')) {
      clearDraft();
      router.push(`/patients/${state.patient?.id}`);
    }
  };

  if (state.isLoading && !state.patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Define step components
  const StepComponents: Record<number, any> = {
    1: ({ patient, onUpdate, onValidated }: { patient: any | null; onUpdate: (data: any) => void; onValidated: () => void }) => (
      <PatientConfirmationStep patient={patient} onUpdate={onUpdate} onValidated={onValidated} />
    ),
    2: ({ patient, onUpdate, onValidated }: { patient: any | null; onUpdate: (data: any) => void; onValidated: () => void }) => (
      <IdentityVerificationStep patient={patient} onUpdate={onUpdate} onValidated={onValidated} />
    ),
    3: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ConsultationDetailsStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    4: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ClinicalAssessmentStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    5: ({ patient, onUpdate, onValidated }: { patient: any | null; onUpdate: (data: any) => void; onValidated: () => void }) => (
      <MedicalHistoryReviewStep patient={patient} onUpdate={onUpdate} onValidated={onValidated} />
    ),
    6: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ClinicalChecksStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    7: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ConsentStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    8: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ConsultationOutcomeStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    9: ({ onUpdate, onValidated }: { onUpdate: (data: any) => void; onValidated: () => void }) => (
      <ClinicalNotesStep onUpdate={onUpdate} onValidated={onValidated} />
    ),
    10: ({ state, onUpdate }: { state: any; onUpdate: (data: any) => void }) => (
      <ReviewStep state={state} onUpdate={onUpdate} />
    ),
    11: ({ state, onUpdate }: { state: any; onUpdate: (data: any) => void }) => (
      <FinalValidationStep state={state} onUpdate={onUpdate} />
    ),
    12: ({ state, onComplete }: { state: any; onComplete: () => void }) => (
      <CompleteConsultationStep state={state} onComplete={onComplete} />
    )
  };

  // Get the current step component
  const CurrentStepComponent = StepComponents[state.currentStep];

  if (!CurrentStepComponent) {
    return <div>Step not found</div>;
  }

  return (
    <ConsultationWizardProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDiscardChanges}
                  className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Discard & Exit</span>
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Consultation Wizard
              </h1>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  size="sm"
                  className={state.saveStatus.isSaving ? 'opacity-50 pointer-events-none' : ''}
                >
                  {state.saveStatus.isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={state.isLoading}
                >
                  {state.isLoading ? 'Saving...' : 'Next Step'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Patient Banner */}
            <PatientBanner patient={state.patient} />

            {/* Stepper */}
            <Stepper currentStep={state.currentStep} totalSteps={12} />

            {/* Step Content */}
            <Card className="mt-6">
              <div className="p-6">
                {state.patient ? (
                  <CurrentStepComponent
                    patient={state.patient}
                    onUpdate={updateFormData}
                    onValidated={goToNextStep} // We'll move to next step when validated
                  />
                ) : (
                  <p>Loading patient data...</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ConsultationWizardProvider>
  );
}

// Step 1: Patient Confirmation
const PatientConfirmationStep = ({ patient, onUpdate, onValidated }: {
  patient: any | null;
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    onUpdate({ confirmed: true, confirmedAt: new Date().toISOString() });
    onValidated();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Patient Confirmation</h2>
      <p className="text-gray-600">
        Please confirm that you are about to conduct a consultation with the following patient:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
        <p className="text-sm text-gray-500">
          MRN: {patient?.mrn} | DOB: {new Date(patient?.dateOfBirth).toLocaleDateString()} | Age: {new Date().getFullYear() - new Date(patient?.dateOfBirth).getFullYear()} years
        </p>
        {patient.gender && (
          <p className="text-sm text-gray-500">Gender: {patient.gender}</p>
        )}
      </div>
      <div className="mt-4">
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={confirmed || !patient}
          className={!patient ? 'opacity-50 pointer-events-none' : ''}
        >
          {confirmed ? 'Confirmed' : 'Confirm Patient'}
        </Button>
        {!patient && (
          <span className="ml-2 text-sm text-red-500">Patient data not available</span>
        )}
      </div>
      {confirmed && (
        <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400">
          <p className="text-sm text-green-800 flex items-center">
            <CheckCircle className="mr-2 h-3 w-3" />
            Patient confirmed. You may proceed to the next step.
          </p>
        </div>
      )}
    </div>
  );
};

// Step 2: Identity Verification
const IdentityVerificationStep = ({ patient, onUpdate, onValidated }: {
  patient: any | null;
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [verification, setVerification] = useState({
    dobVerified: false,
    addressVerified: false,
    nhsNumberVerified: false,
    securityQuestionVerified: false
  });

  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');

  const handleVerify = (type: keyof typeof verification) => {
    setVerification(prev => ({ ...prev, [type]: true }));
    onUpdate({ ...verification, [type]: true });
    // Check if we have at least 2 verifications
    const verifiedCount = Object.values(verification).filter(v => v === true).length;
    if (verifiedCount >= 2) {
      onVerified();
    }
  };

  const onVerified = useCallback(() => {
    onUpdate({ ...verification, verified: true, verifiedAt: new Date().toISOString() });
    onValidated();
  }, [verification, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Identity Verification</h2>
      <p className="text-gray-600">
        Please verify the patient's identity using at least two of the following methods:
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Date of Birth</h3>
          <p className="text-sm text-gray-500">
            {patient?.dateOfBirth ? `Matches records: ${new Date(patient.dateOfBirth).toLocaleDateString()}` : 'No DOB on file'}
          </p>
          <button
            onClick={() => handleVerify('dobVerified')}
            className={`w-full mt-2 px-3 py-2 text-sm font-medium ${
              verification.dobVerified ? 'bg-green-600 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {verification.dobVerified ? 'Verified' : 'Verify DOB'}
          </button>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Address</h3>
          <p className="text-sm text-gray-500">
            {patient?.address ? 'Matches records' : 'No address on file'}
          </p>
          <button
            onClick={() => handleVerify('addressVerified')}
            className={`w-full mt-2 px-3 py-2 text-sm font-medium ${
              verification.addressVerified ? 'bg-green-600 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {verification.addressVerified ? 'Verified' : 'Verify Address'}
          </button>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">NHS Number</h3>
          <p className="text-sm text-gray-500">
            {/* We don't have NHS number in our mock data */}
            Not verified
          </p>
          <button
            onClick={() => handleVerify('nhsNumberVerified')}
            className={`w-full mt-2 px-3 py-2 text-sm font-medium ${
              verification.nhsNumberVerified ? 'bg-green-600 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {verification.nhsNumberVerified ? 'Verified' : 'Verify NHS Number'}
          </button>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Security Question</h3>
          <p className="text-sm text-gray-500">
            What is the patient's mother's maiden name?
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={securityQuestionAnswer}
              onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter answer"
            />
            <button
              onClick={() => {
                if (securityQuestionAnswer.trim() !== '') {
                  setVerification(prev => ({ ...prev, securityQuestionVerified: true }));
                  onUpdate({ ...verification, securityQuestionVerified: true });
                  // Check if we have at least 2 verifications
                  const verifiedCount = Object.values(verification).filter(v => v === true).length;
                  if (verifiedCount >= 2) {
                    onVerified();
                  }
                } else {
                  alert('Please provide an answer to the security question');
                }
              }}
              className={`w-full mt-2 px-3 py-2 text-sm font-medium ${
                verification.securityQuestionVerified ? 'bg-green-600 text-white' : 'bg-white border border-gray-300'
              }`}
            >
              {verification.securityQuestionVerified ? 'Verified' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          <strong>Verification Status:</strong> {Object.values(verification).filter(v => v === true).length}/4 methods verified
        </p>
      </div>
      <div className="mt-4">
        <Button
          variant="primary"
          onClick={() => {
            const verifiedCount = Object.values(verification).filter(v => v === true).length;
            if (verifiedCount >= 2) {
              onVerified();
            } else {
              alert('Please verify at least 2 identity methods');
            }
          }}
          disabled={Object.values(verification).some(v => v === true) ? false : true}
        >
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

// Step 3: Consultation Details
const ConsultationDetailsStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [formData, setFormData] = useState({
    consultationType: 'Face to Face',
    chiefComplaint: '',
    duration: 15,
    symptoms: '',
    history: '',
    notes: ''
  });

  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Validate: chiefComplaint is required
    setIsValid(formData.chiefComplaint.trim().length > 0);
  };

  const handleSubmit = useCallback(() => {
    if (formData.chiefComplaint.trim().length > 0) {
      // Additional validation: duration should be reasonable
      if (formData.duration < 5 || formData.duration > 120) {
        alert('Duration must be between 5 and 120 minutes');
        return;
      }
      onUpdate(formData);
      onValidated();
    } else {
      alert('Please enter the chief complaint');
    }
  }, [formData, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Consultation Details</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
          <select
            value={formData.consultationType}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Face to Face">Face to Face</option>
            <option value="Telephone">Telephone</option>
            <option value="Video">Video</option>
            <option value="Walk In">Walk In</option>
            <option value="Home Visit">Home Visit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="5"
            max="120"
          />
        </div>
      }
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint *</label>
          <textarea
            value={formData.chiefComplaint}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
            placeholder="Enter the chief complaint"
          >
          </textarea>
          {formData.chiefComplaint.trim().length === 0 && (
            <p className="mt-1 text-xs text-red-600">Chief complaint is required</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
          <textarea
            value={formData.symptoms}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">History</label>
          <textarea
            value={formData.history}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
          />
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={false}
        >
          Save Consultation Details
        </Button>
        {isValid && (
          <span className="ml-2 text-sm text-green-600">Valid</span>
        )}
      </div>
    </div>
  );
};

// Step 4: Clinical Assessment
const ClinicalAssessmentStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    temperature: '',
    respirationRate: '',
    oxygenSaturation: '',
    notes: ''
  });

  // No required fields for clinical assessment (all optional)
  const [isValid, setIsValid] = useState(true); // Always valid since optional

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = useCallback(() => {
    // Validate any entered values (e.g., blood pressure should be reasonable if provided)
    const errors: string[] = [];

    if (formData.bloodPressureSystolic !== '') {
      const sys = parseInt(formData.bloodPressureSystolic);
      if (isNaN(sys) || sys < 70 || sys > 250) {
        errors.push('Systolic blood pressure must be between 70 and 250 mmHg');
      }
    }

    if (formData.bloodPressureDiastolic !== '') {
      const dia = parseInt(formData.bloodPressureDiastolic);
      if (isNaN(dia) || dia < 40 || dia > 150) {
        errors.push('Diastolic blood pressure must be between 40 and 150 mmHg');
      }
    }

    if (formData.height !== '') {
      const height = parseInt(formData.height);
      if (isNaN(height) || height < 50 || height > 250) {
        errors.push('Height must be between 50 and 250 cm');
      }
    }

    if (formData.weight !== '') {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight < 1 || weight > 300) {
        errors.push('Weight must be between 1 and 300 kg');
      }
    }

    if (formData.pulse !== '') {
      const pulse = parseInt(formData.pulse);
      if (isNaN(pulse) || pulse < 30 || pulse > 200) {
        errors.push('Pulse must be between 30 and 200 bpm');
      }
    }

    if (formData.temperature !== '') {
      const temp = parseFloat(formData.temperature);
      if (isNaN(temp) || temp < 30 || temp > 45) {
        errors.push('Temperature must be between 30 and 45 °C');
      }
    }

    if (formData.respirationRate !== '') {
      const rr = parseInt(formData.respirationRate);
      if (isNaN(rr) || rr < 5 || rr > 40) {
        errors.push('Respiration rate must be between 5 and 40 breaths/min');
      }
    }

    if (formData.oxygenSaturation !== '') {
      const o2 = parseInt(formData.oxygenSaturation);
      if (isNaN(o2) || o2 < 70 || o2 > 100) {
        errors.push('Oxygen saturation must be between 70 and 100%');
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // If we get here, all validations passed
    onUpdate(formData);
    onValidated();
  }, [formData, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Clinical Assessment</h2>
      <p className="text-gray-600">
        Recording vital signs and observations (all fields are optional)
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BP Systolic</label>
          <input
            type="number"
            value={formData.bloodPressureSystolic}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BP Diastolic</label>
          <input
            type="number"
            value={formData.bloodPressureDiastolic}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (bpm)</label>
          <input
            type="number"
            value={formData.pulse}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
          <input
            type="number"
            value={formData.temperature}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Respiration Rate</label>
          <input
            type="number"
            value={formData.respirationRate}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">O₂ Saturation (%)</label>
          <input
            type="number"
            value={formData.oxygenSaturation}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observations/Notes</label>
        <textarea
          value={formData.notes}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
        />
      </div>
      <Button variant="primary" onClick={handleSubmit}>
        Save Assessment
      </Button>
    </div>
  );
};

// Step 5: Medical History Review
const MedicalHistoryReviewStep = ({ patient, onUpdate, onValidated }: {
  patient: any | null;
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  // Initialize form data from patient medical history if available
  const [formData, setFormData] = useState({
    medicalConditions: patient?.medicalConditions || [],
    currentMedications: patient?.currentMedications || [],
    allergies: patient?.allergies || [],
    previousPrescriptions: patient?.previousPrescriptions || [],
    hospitalAdmissions: patient?.hospitalAdmissions || [],
    surgeries: patient?.surgeries || [],
    familyHistory: patient?.familyHistory || [],
    lifestyleFactors: {
      smoking: patient?.lifestyleFactors?.smoking || 'Never',
      alcohol: patient?.lifestyleFactors?.alcohol || 'Occasional',
      exercise: patient?.lifestyleFactors?.exercise || '3 times per week',
      pregnancy: patient?.lifestyleFactors?.pregnancy || 'N/A'
    }
  });

  // Handle changes for simple fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle changes for array fields (like medical conditions)
  const handleArrayChange = (field: string, value: any[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes for nested object (lifestyleFactors)
  const handleLifestyleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleFactors: {
        ...prev.lifestyleFactors,
        [field]: value
      }
    }));
  };

  // Add item to an array
  const addItem = (field: string, newItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  // Remove item from an array
  const removeItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Validate: at least one medical history item should be present (optional, but we'll check if user wants to proceed)
  const [isValid, setIsValid] = useState(true); // We'll allow proceeding even if empty

  const handleSubmit = useCallback(() => {
    // Perform any validation if needed
    // For now, we'll just save the data and proceed
    onUpdate(formData);
    onValidated();
  }, [formData, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Medical History Review</h2>
      <p className="text-gray-600">
        Review and update the patient's medical history. All sections are expandable/collapsible.
      </p>

      {/* Medical Conditions */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Medical Conditions</h3>
          <button
            onClick={() => {
              const newCondition = prompt('Enter new medical condition:');
              if (newCondition && newCondition.trim() !== '') {
                addItem('medicalConditions', newCondition.trim());
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Condition
          </button>
        </div>
        {formData.medicalConditions.length > 0 ? (
          <ul className="space-y-2">
            {formData.medicalConditions.map((condition: string, index: number) => (
              <div key={`condition-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>{condition}</span>
                <button
                  onClick={() => removeItem('medicalConditions', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No medical conditions recorded</p>
        )}
      </div>

      {/* Current Medications */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Current Medications</h3>
          <button
            onClick={() => {
              const name = prompt('Enter medication name:');
              const dosage = prompt('Enter dosage (e.g., 10mg):');
              const frequency = prompt('Enter frequency (e.g., Once daily):');
              if (name && dosage && frequency) {
                addItem('currentMedications', { name, dosage, frequency });
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Medication
          </button>
        </div>
        {formData.currentMedications.length > 0 ? (
          <ul className="space-y-2">
            {formData.currentMedications.map((med: any, index: number) => (
              <div key={`med-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>
                  {med.name} - {med.dosage} - {med.frequency}
                </span>
                <button
                  onClick={() => removeItem('currentMedications', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No current medications recorded</p>
        )}
      </div>

      {/* Allergies */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Allergies</h3>
          <button
            onClick={() => {
              const allergy = prompt('Enter new allergy:');
              if (allergy && allergy.trim() !== '') {
                addItem('allergies', allergy.trim());
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Allergy
          </button>
        </div>
        {formData.allergies.length > 0 ? (
          <ul className="space-y-2">
            {formData.allergies.map((allergy: string, index: number) => (
              <div key={`allergy-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>{allergy}</span>
                <button
                  onClick={() => removeItem('allergies', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No allergies recorded</p>
        )}
      </div>

      {/* Previous Prescriptions */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Previous Prescriptions</h3>
          <button
            onClick={() => {
              const drug = prompt('Enter drug name:');
              const date = prompt('Enter date (YYYY-MM-DD):');
              const indication = prompt('Enter indication:');
              if (drug && date && indication) {
                addItem('previousPrescriptions', { drug, date, indication });
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Prescription
          </button>
        </div>
        {formData.previousPrescriptions.length > 0 ? (
          <ul className="space-y-2">
            {formData.previousPrescriptions.map((rx: any, index: number) => (
              <div key={`rx-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>
                  {rx.drug} ({rx.date}) - {rx.indication}
                </span>
                <button
                  onClick={() => removeItem('previousPrescriptions', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No previous prescriptions recorded</p>
        )}
      </div>

      {/* Hospital Admissions */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Hospital Admissions</h3>
          <button
            onClick={() => {
              const date = prompt('Enter admission date (YYYY-MM-DD):');
              const reason = prompt('Enter reason for admission:');
              const duration = prompt('Enter duration (e.g., 3 days):');
              if (date && reason && duration) {
                addItem('hospitalAdmissions', { date, reason, duration });
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Admission
          </button>
        </div>
        {formData.hospitalAdmissions.length > 0 ? (
          <ul className="space-y-2">
            {formData.hospitalAdmissions.map((admission: any, index: number) => (
              <div key={`admission-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>
                  {admission.date} - {admission.reason} ({admission.duration})
                </span>
                <button
                  onClick={() => removeItem('hospitalAdmissions', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No hospital admissions recorded</p>
        )}
      </div>

      {/* Surgeries */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Surgeries</h3>
          <button
            onClick={() => {
              const procedure = prompt('Enter procedure name:');
              const date = prompt('Enter date (YYYY-MM-DD):');
              if (procedure && date) {
                addItem('surgeries', { procedure, date });
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Surgery
          </button>
        </div>
        {formData.surgeries.length > 0 ? (
          <ul className="space-y-2">
            {formData.surgeries.map((surgery: any, index: number) => (
              <div key={`surgery-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>
                  {surgery.procedure} ({surgery.date})
                </span>
                <button
                  onClick={() => removeItem('surgeries', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No surgeries recorded</p>
        )}
      </div>

      {/* Family History */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Family History</h3>
          <button
            onClick={() => {
              const relation = prompt('Enter relation (e.g., Father):');
              const condition = prompt('Enter condition:');
              const ageAtDiagnosis = prompt('Enter age at diagnosis:');
              if (relation && condition && ageAtDiagnosis) {
                addItem('familyHistory', { relation, condition, ageAtDiagnosis: parseInt(ageAtDiagnosis) });
              }
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            Add Family History
          </button>
        </div>
        {formData.familyHistory.length > 0 ? (
          <ul className="space-y-2">
            {formData.familyHistory.map((fh: any, index: number) => (
              <div key={`fh-${index}`} className="flex items-start space-x-2">
                <span className="mr-2">•</span>
                <span>
                  {fh.relation}: {fh.condition} (diagnosed at age {fh.ageAtDiagnosis})
                </span>
                <button
                  onClick={() => removeItem('familyHistory', index)}
                  className="ml-auto text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No family history recorded</p>
        )}
      </div>

      {/* Lifestyle Factors */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">Lifestyle Factors</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
            <select
              value={formData.lifestyleFactors.smoking}
              onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Never">Never</option>
              <option value="Former">Former</option>
              <option value="Current">Current</option>
              <option value="Occasional">Occasional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol</label>
            <select
              value={formData.lifestyleFactors.alcohol}
              onChange={(e) => handleLifestyleChange('alcohol', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Never">Never</option>
              <option value="Occasional">Occasional</option>
              <option value="Regular">Regular</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
            <input
              type="text"
              value={formData.lifestyleFactors.exercise}
              onChange={(e) => handleLifestyleChange('exercise', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status</label>
            <select
              value={formData.lifestyleFactors.pregnancy}
              onChange={(e) => handleLifestyleChange('pregnancy', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="N/A">N/A</option>
              <option value="Not Pregnant">Not Pregnant</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Breastfeeding">Breastfeeding</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={false}
        >
          Save Medical History
        </Button>
        {isValid && (
          <span className="ml-2 text-sm text-green-600">Valid</span>
        )}
      </div>
    </div>
  );
};

// Step 6: Clinical Checks (with Clinical Alert Engine)
const ClinicalChecksStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  // We'll simulate clinical checks based on the form data from previous steps
  // In a real app, this would integrate with a CDS engine
  const [alerts, setAlerts] = useState([]);
  const [riskScore, setRiskScore] = useState(0); // 0-100 scale
  const [recommendations, setRecommendations] = useState([]);

  // Simulate running clinical checks when data is updated
  useEffect(() => {
    // This effect would run whenever the form data changes (from previous steps)
    // For now, we'll simulate based on mock data
    const simulatedAlerts = [];
    const simulatedRecommendations = [];

    // Example: Check for warfarin + aspirin interaction (if we had medication data)
    // Since we don't have real data, we'll show some mock alerts
    if (Math.random() > 0.7) {
      simulatedAlerts.push({
        id: 1,
        type: 'warning',
        title: 'Potential Drug Interaction',
        message: 'Patient is on warfarin. Avoid NSAIDs due to increased bleeding risk.',
        severity: 'medium'
      });
      simulatedRecommendations.push('Consider alternative pain management (e.g., paracetamol)');
    }

    // Example: Check for allergy
    if (Math.random() > 0.8) {
      simulatedAlerts.push({
        id: 2,
        type: 'error',
        title: 'Allergy Alert',
        message: 'Patient has documented penicillin allergy. Avoid beta-lactam antibiotics.',
        severity: 'high'
      });
      simulatedRecommendations.push('Use macrolide or fluoroquinolone if antibiotic needed');
    }

    // Example: Check for pregnancy contraindications
    if (Math.random() > 0.9) {
      simulatedAlerts.push({
        id: 3,
        type: 'warning',
        title: 'Pregnancy Consideration',
        message: 'If patient is pregnant or planning pregnancy, review medication safety.',
        severity: 'low'
      });
      simulatedRecommendations.put('Review all medications for teratogenic risk');
    }

    // Calculate a simple risk score (0-100)
    let score = 0;
    simulatedAlerts.forEach(alert => {
      if (alert.severity === 'high') score += 30;
      else if (alert.severity === 'medium') score += 20;
      else if (alert.severity === 'low') score += 10;
    });
    score = Math.min(score, 100); // Cap at 100

    setAlerts(simulatedAlerts);
    setRecommendations(simulatedRecommendations);
    setScore(score);
  }, []); // In reality, this would depend on form data, but we'll run once for demo

  // Handle proceeding to next step
  const handleProceed = useCallback(() => {
    // Save the clinical checks results to form data
    onUpdate({
      clinicalAlerts: alerts,
      clinicalRiskScore: riskScore,
      clinicalRecommendations: recommendations
    });
    onValidated();
  }, [alerts, recommendations, riskScore, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Clinical Checks</h2>
      <p className="text-gray-600">
        Automated clinical decision support checks based on patient data and clinical guidelines.
      </p>

      {/* Clinical Risk Score */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Clinical Risk Score</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 bg-${riskScore < 30 ? 'green-500' : riskScore < 70 ? 'yellow-500' : 'red-500'} rounded-full`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 text-center">
          Risk Level: {riskScore < 30 ? 'Low' : riskScore < 70 ? 'Moderate' : 'High'} ({riskScore}/100)
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 ? (
        <>
          <h3 className="font-medium mb-3">Clinical Alerts</h3>
          <div className="space-y-4">
            {alerts.map((alert: any, index: number) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded bg-gray-50 ${
                  alert.type === 'error'
                    ? 'border-red-500 bg-red-50'
                    : alert.type === 'warning'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {alert.title}
                      {alert.severity === 'high' && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                          HIGH
                        </span>
                      )}
                      {alert.severity === 'medium' && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          MEDIUM
                        </span>
                      )}
                      {alert.severity === 'low' && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                          LOW
                        </span>
                      )}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Alert #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-4 bg-green-50 border-l-4 border-green-400">
          <p className="text-sm text-green-800 flex items-center">
            <CheckCircle className="mr-2 h-3 w-3" />
            No clinical alerts detected
          </p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <>
          <h3 className="font-medium mb-3 mt-6">Recommendations</h3>
          <ul className="space-y-2 list-disc pl-5">
            {recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-gray-700">
                {rec}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleProceed}
          isLoading={false}
        >
          Save Clinical Checks
        </Button>
      </div>
    </div>
  );
};

// Step 7: Consent
const ConsentStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [consent, setConsent] = useState({
    treatmentConsent: false,
    privacyConsent: false,
    ePrescriptionConsent: false,
    remoteConsultationConsent: false,
    marketingConsent: false,
    signature: null, // Would be captured via signature pad in real app
    consentVersion: '1.0',
    consentDate: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsent(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // In a real app, we would capture signature here
  const handleSignature = () => {
    // Simulate signature capture
    setConsent(prev => ({
      ...prev,
      signature: 'signed_' + Date.now() // Placeholder
    }));
  };

  const handleSubmit = useCallback(() => {
    // Validate that required consents are given (treatment and privacy at minimum)
    if (consent.treatmentConsent && consent.privacyConsent) {
      const consentData = {
        ...consent,
        consentDate: new Date().toISOString()
      };
      onUpdate(consentData);
      onValidated();
    } else {
      alert('Please provide consent for treatment and privacy at minimum');
    }
  }, [consent, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Consent</h2>
      <p className="text-gray-600">
        Please review and provide consent for the following:
      </p>

      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={consent.treatmentConsent}
              onChange={handleChange}
              name="treatmentConsent"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              I consent to receive treatment and medical advice during this consultation.
            </span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={consent.privacyConsent>
                onChange={handleChange}
                name="privacyConsent"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                I consent to the collection, use, and disclosure of my personal health information
                in accordance with the clinic's privacy policy and applicable data protection laws.
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={consent.ePrescriptionConsent>
                  onChange={handleChange}
                  name="ePrescriptionConsent"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  I consent to receive electronic prescriptions (e-prescriptions) instead of paper prescriptions.
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={consent.remoteConsultationConsent>
                    onChange={handleChange}
                    name="remoteConsultationConsent"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I consent to conduct this consultation remotely (via telephone or video) if deemed appropriate.
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consent.marketingConsent>
                      onChange={handleChange}
                      name="marketingConsent"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      I consent to receive information about health services, promotions, and educational materials
                      from the clinic.
                    </span>
                  </label>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSignature}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:underline"
                  >
                    {consent.signature ? 'Signature Captured' : 'Capture Signature'}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button
variant="primary"
onClick={handleSubmit}
isLoading={false}
>Save Consent</Button>
</div>
</div>
);
};

// Step 8: Consultation Outcome
const ConsultationOutcomeStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [outcome, setOutcome] = useState({
    outcomeType: '', // suitable, advice_only, refer_gp, refer_specialist, refer_emergency, no_treatment
    outcomeNotes: '',
    followUpRequired: false,
    followUpDetails: '',
    referralReason: '',
    referralNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setOutcome(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = useCallback(() => {
    // Validate that an outcome type is selected
    if (outcome.outcomeType.trim() === '') {
      alert('Please select an consultation outcome');
      return;
    }

    // Additional validation based on outcome type
    if (outcome.outcomeType.startsWith('refer_') && !outcome.referralReason.trim()) {
      alert('Please provide a reason for referral');
      return;
    }

    if (outcome.followUpRequired && !outcome.followUpDetails.trim()) {
      alert('Please provide follow-up details');
      return;
    }

    onUpdate(outcome);
    onValidated();
  }, [outcome, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Consultation Outcome</h2>
      <p className="text-gray-600">
        Select the appropriate outcome for this consultation:
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Outcome *</label>
          <select
            value={outcome.outcomeType}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Select Outcome --</option>
            <option value="suitable">Suitable for Prescription</option>
            <option value="advice_only">Advice Only (No Prescription Needed)</option>
            <option value="refer_gp">Refer to GP</option>
            <option value="refer_specialist">Refer to Specialist</option>
            <option value="refer_emergency">Refer to Emergency Services</option>
            <option value="no_treatment">No Treatment Required</option>
          </select>
        </div>

        {/* Outcome Notes (always shown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outcome Notes</label>
          <textarea
            value={outcome.outcomeNotes}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
          />
        </div>

        {/* Follow-Up Section */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              checked={outcome.followUpRequired}
              onChange={handleChange}
              name="followUpRequired"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">Follow-up required</label>
          </div>
          {outcome.followUpRequired && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Details</label>
                <textarea
                  value={outcome.followUpDetails}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="2"
                  rows="3"
                />
              </div>
            </>
          )}

          {/* Referral Section (shown when outcome is a referral) */}
          {outcome.outcomeType.startsWith('refer_') && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Reason *</label>
                <input
                  type="text"
                  value={outcome.referralReason}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Notes</label>
                <textarea
                  value={outcome.referralNotes}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={false}
        >
          Save Consultation Outcome
        </Button>
      </div>
    </div>
  );
};

// Step 9: Clinical Notes (SOAP format)
const ClinicalNotesStep = ({ onUpdate, onValidated }: {
  onUpdate: (data: any) => void;
  onValidated: () => void;
}) => {
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSoapNotes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(() => {
    // In a real app, we might want to validate that sections are filled
    // For now, we'll allow proceeding even if empty
    onUpdate(soapNotes);
    onValidated();
  }, [soapNotes, onUpdate, onValidated]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Clinical Notes (SOAP Format)</h2>
      <p className="text-gray-600">
        Document the consultation using the SOAP format (Subjective, Objective, Assessment, Plan).
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
          <p className="text-sm text-gray-500">Patient's reported symptoms, concerns, and history.</p>
          <textarea
            value={soapNotes.subjective}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Chief complaint, history of present illness, relevant history..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
          <p className="text-sm text-gray-500">Observable and measurable data (vital signs, exam findings).</p>
          <textarea
            value={soapNotes.objective}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Vital signs, physical examination findings, test results..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
          <p className="text-sm text-gray-500">Clinical assessment or diagnosis based on subjective and objective data.</p>
          <textarea
            value={soapNotes.assessment}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Diagnosis, differential diagnosis, clinical impressions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <p className="text-sm text-gray-500">Treatment plan, prescriptions, follow-up instructions, referrals.</p>
          <textarea
            value={soapNotes.plan}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Medications, lifestyle advice, follow-up appointments, patient education..."
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={false}
        >
          Save Clinical Notes
        </Button>
      </div>
    </div>
  );
};

// Step 10: Review
const ReviewStep = ({ state, onUpdate }: {
  state: any;
  onUpdate: (data: any) => void;
}) => {
  // We'll compile a review from all the form data collected so far
  // In a real app, this would be a summary for the pharmacist to review before finalizing
  const handleConfirmAndProceed = useCallback(() => {
    // We'll just save a marker that the review is complete
    onUpdate({ reviewCompleted: true, reviewedAt: new Date().toISOString() });
    // In a real app, we might want to validate everything is filled
    // For now, we'll proceed
  }, [onUpdate]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Review Consultation</h2>
      <p className="text-gray-600">
        Please review all the information collected during this consultation before finalizing.
      </p>

      {/* We'll show a summary of key information */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Patient Information</h3>
          {state.patient && (
            <>
              <p className="text-sm"><strong>Name:</strong> {state.patient.firstName} {state.patient.lastName}</p>
              <p className="text-sm"><strong>MRN:</strong> {state.patient.mrn}</p>
              <p className="text-sm"><strong>DOB:</strong> {new Date(state.patient.dateOfBirth).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Age:</strong> {new Date().getFullYear() - new Date(state.patient.dateOfBirth).getFullYear()} years</p>
              <p className="text-sm"><strong>Gender:</strong> {state.patient.gender}</p>
            </>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Consultation Details</h3>
          {state.formData?.['3'] && (
            <>
              <p className="text-sm"><strong>Type:</strong> {state.formData['3'].consultationType}</p>
              <p className="text-sm"><strong>Chief Complaint:</strong> {state.formData['3'].chiefComplaint}</p>
              <p className="text-sm"><strong>Duration:</strong> {state.formData['3'].duration} minutes</p>
            </>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Clinical Assessment</h3>
          {state.formData?.['4'] && (
            <>
              {state.formData['4'].height && (
                <p className="text-sm"><strong>Height:</strong> {state.formData['4'].height} cm</p>
              )}
              {state.formData['4'].weight && (
                <p className="text-sm"><strong>Weight:</strong> {state.formData['4'].weight} kg</p>
              )}
              {state.formData['4'].bloodPressureSystolic && state.formData['4'].bloodPressureDiastolic && (
                <p className="text-sm"><strong>Blood Pressure:</strong> {state.formData['4'].bloodPressureSystolic}/{state.formData['4'].bloodPressureDiastolic} mmHg</p>
              )}
              {state.formData['4'].pulse && (
                <p className="text-sm"><strong>Pulse:</strong> {state.formData['4'].pulse} bpm</p>
              )}
              {state.formData['4'].temperature && (
                <p className="text-sm"><strong>Temperature:</strong> {state.formData['4'].temperature} °C</p>
              )}
              {state.formData['4'].respirationRate && (
                <p className="text-sm"><strong>Respiration Rate:</strong> {state.formData['4'].respirationRate} breaths/min</p>
              )}
              {state.formData['4'].oxygenSaturation && (
                <p className="text-sm"><strong>O₂ Saturation:</strong> {state.formData['4'].oxygenSaturation}%</p>
              )}
            </>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Outcome</h3>
          {state.formData?.['8'] && (
            <>
              <p className="text-sm"><strong>Outcome:</strong> {state.formData['8'].outcomeType}</p>
              {state.formData['8'].outcomeNotes && (
                <p className="text-sm"><strong>Notes:</strong> {state.formData['8'].outcomeNotes}</p>
              )}
              {state.formData['8'].followUpRequired && (
                <p className="text-sm"><strong>Follow-up Required:</strong> Yes</p>
                {state.formData['8'].followUpDetails && (
                  <p className="text-sm"><strong>Details:</strong> {state.formData['8'].followUpDetails}</p>
                )}
              )}
              {state.formData['8'].outcomeType.startsWith('refer_') && (
                <p className="text-sm"><strong>Referral Reason:</strong> {state.formData['8'].referralReason}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleConfirmAndProceed}
          isLoading={false}
        >
          Confirm and Complete Consultation
        </Button>
        <Button
          variant="outline"
          onClick={() => {/* go back handled by parent */}}
          className="ml-2"
        >
          Back to Previous Step
        </Button>
      </div>
    </div>
  );
};

// Step 11: Final Validation
const FinalValidationStep = ({ state, onUpdate }: {
  state: any;
  onUpdate: (data: any) => void;
}) => {
  // We'll perform final validation checks here
  // For example, check if a prescription is needed but no medication selected, etc.
  // We'll also compute any final risk scores or recommendations

  const [validationResults, setValidationResults] = useState({
    isValid: true,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    // Run validation checks
    const errors = [];
    const warnings = [];

    // Example: Check if outcome is suitable for prescription but no prescription details (in a real app)
    // We don't have prescription step yet, so we'll skip

    // Example: Check for high risk score from clinical checks
    if (state.formData?.['6']?.clinicalRiskScore && state.formData['6'].clinicalRiskScore > 70) {
      warnings.push('High clinical risk score detected. Please review clinical alerts and recommendations.');
    }

    // Example: Check if consent is missing
    if (!(state.formData?.['7']?.treatmentConsent && state.formData['7'].privacyConsent)) {
      errors.push('Missing required consents (treatment and privacy).');
    }

    // Example: Check if consultation outcome is missing
    if (!state.formData?.['8']?.outcomeType) {
      errors.push('Consultation outcome not selected.');
    }

    setValidationResults({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }, [state.formData]);

  const handleFinalize = useCallback(() => {
    if (validationResults.isValid) {
      // Save final validation results
      onUpdate({ finalValidationCompleted: true, validatedAt: new Date().toISOString() });
      // In a real app, we would proceed to completion
    } else {
      alert('Please resolve the following issues before completing:\n' + validationResults.errors.join('\n'));
    }
  }, [validationResults.isValid, onUpdate]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Final Validation</h2>
      <p className="text-gray-600">
        Automated validation checks to ensure the consultation is complete and ready for finalization.
      </p>

      {/* Validation Results */}
      {validationResults.errors.length > 0 || validationResults.warnings.length > 0 ? (
        <>
          {validationResults.errors.length > 0 && (
            <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-400">
              <h3 className="font-medium mb-2 text-red-800">Validation Errors</h3>
              <ul className="space-y-1 text-sm text-red-700 list-disc pl-5">
                {validationResults.errors.map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {validationResults.warnings.length > 0 && (
            <div className="p-4 mb-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h3 className="font-medium mb-2 text-yellow-800">Warnings</h3>
              <ul className="space-y-1 text-sm text-yellow-700 list-disc pl-5">
                {validationResults.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-green-50 border-l-4 border-green-400">
          <p className="text-sm text-green-800 flex items-center">
            <CheckCircle className="mr-2 h-3 w-3" />
            All validation checks passed
          </p>
        </div>
      )}

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleFinalize}
          isLoading={false}
          disabled={!validationResults.isValid}
        >
          {validationResults.isValid ? 'Finalize Consultation' : 'Fix Issues'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {/* go back handled by parent */}}
          className="ml-2"
        >
          Back to Previous Step
        </Button>
      </div>
    </div>
  );
};

// Step 12: Complete Consultation
const CompleteConsultationStep = ({ state, onComplete }: {
  state: any;
  onComplete: () => void;
}) => {
  // This step would typically involve:
  // - Generating a consultation reference number
  // - Saving the consultation to the database (in a real app)
  // - Clearing the draft
  // - Redirecting to a summary or to the prescription generation step (Phase 4)

  const [isSaving, setIsSaving] = useState(false);
  const [consultationReference, setConsultationReference] = useState(null);

  // Simulate saving the consultation
  const handleCompleteConsultation = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save consultation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a consultation reference (in a real app, this would come from the backend)
      const ref = `CONS-${Date.now().toString().slice(-6)}`;
      setConsultationReference(ref);

      // Clear the draft
      // We would normally call clearDraft() from context, but we don't have access here
      // Instead, we'll simulate and then call onComplete which should handle cleanup

      // Show success message
      alert(`Consultation completed successfully!\nReference Number: ${ref}`);

      // In a real app, we would redirect to a summary or prescription page
      // For now, we'll just call the completion callback
      onComplete();
    } catch (error) {
      alert('Failed to complete consultation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [onComplete]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Complete Consultation</h2>
      <p className="text-gray-600">
        Finalize the consultation and prepare for prescription generation (Phase 4).
      </p>

      {/* Summary of what will be saved */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-3">Consultation Summary</h3>
        <p className="text-sm">The following information will be saved as a completed consultation:</p>
        <ul className="space-y-2 text-sm pl-5">
          <li><strong>Patient:</strong> {state.patient?.firstName} {state.patient?.lastName} (MRN: {state.patient?.mrn})</li>
          <li><strong>Date:</strong> {new Date().toLocaleString()}</li>
          <li><strong>Consultation Type:</strong> {state.formData?.['3']?.consultationType}</li>
          <li><strong>Outcome:</strong> {state.formData?.['8']?.outcomeType}</li>
          {state.formData?.['6']?.clinicalRiskScore !== undefined && (
            <li><strong>Clinical Risk Score:</strong> {state.formData['6'].clinicalRiskScore}/100</li>
          )}
          {state.formData?.['7']?.treatmentConsent && state.formData['7']?.privacyConsent && (
            <li><strong>Consent:</strong> Provided</li>
          )}
        </ul>
      </div>

      {/* Consultation Reference (shown after completion) */}
      {consultationReference && (
        <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-400">
          <h3 className="font-medium mb-2">Consultation Completed</h3>
          <p className="text-sm"><strong>Reference Number:</strong> {consultationReference}</p>
          <p className="text-sm"><strong>Status:</strong> Saved to patient record</p>
          <p className="text-sm mt-2">You may now proceed to prescription generation (Phase 4).</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {/* go back handled by parent */}}
          disabled={isSaving}
        >
          {isSaving ? 'Completing...' : 'Back to Previous Step'}
        </Button>
        <Button
          variant="primary"
          onClick={handleCompleteConsultation}
          isLoading={isSaving}
          disabled={isSaving}
          className="ml-2"
        >
          {isSaving ? 'Completing...' : 'Complete Consultation'}
        </Button>
      </div>
    </div>
  );
}