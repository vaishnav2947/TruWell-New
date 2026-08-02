// frontend/lib/contexts/ConsultationWizardContext.tsx
"use client";

import { createContext, useContext, useReducer, useEffect, useState, useCallback, Dispatch } from 'react';

export interface ConsultantWizardTimelineEvent {
  event: string;
  timestamp: string; // ISO string
  step: number; // The step during which the event occurred
}

export interface ConsultantWizardAuditEntry {
  action: string; // Created, Edited, Viewed, Auto Saved, Draft Restored, Step Changed, Validation, Completed, Cancelled
  details: string; // Additional details about the action
  timestamp: string; // ISO string
  step: number; // The step during which the action occurred
}

export interface ConsultationWizardState {
  currentStep: number;
  formData: Record<string, any>;
  patient: any | null;
  isLoading: boolean;
  draft: any | null;
  initialPatient: any | null;
  // Save status
  saveStatus: {
    isSaving: boolean;
    lastSaved: number | null; // timestamp
    saveError: string | null;
    isOnline: boolean;
  };
  // For unsaved changes warning
  hasUnsavedChanges: boolean;
  // Timeline and Audit Trail
  timeline: ConsultantWizardTimelineEvent[];
  auditTrail: ConsultantWizardAuditEntry[];
}

export type ConsultationWizardAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: { step: string; data: any } }
  | { type: 'SET_PATIENT'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DRAFT'; payload: any }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_DRAFT' }
  | { type: 'SET_SAVE_STATUS'; payload: Partial<ConsultationWizardState['saveStatus']> }
  | { type: 'SET_HAS_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'ADD_TO_TIMELINE'; payload: ConsultantWizardTimelineEvent }
  | { type: 'ADD_TO_AUDIT_TRAIL'; payload: ConsultantWizardAuditEntry }
  | { type: 'SET_TIMELINE'; payload: ConsultantWizardTimelineEvent[] }
  | { type: 'SET_AUDIT_TRAIL'; payload: ConsultantWizardAuditEntry[] };

const initialState: ConsultationWizardState = {
  currentStep: 1,
  formData: {},
  patient: null,
  isLoading: false,
  draft: null,
  initialPatient: null,
  saveStatus: {
    isSaving: false,
    lastSaved: null,
    saveError: null,
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true
  },
  hasUnsavedChanges: false,
  timeline: [],
  auditTrail: []
};

function consultationWizardReducer(state: ConsultationWizardState, action: ConsultationWizardAction): ConsultationWizardState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      // When step changes, we can add a Step Changed event to audit trail and timeline
      const stepChangeEvent: ConsultantWizardTimelineEvent = {
        event: `Changed to step ${action.payload}`,
        timestamp: new Date().toISOString(),
        step: action.payload
      };
      const stepChangeAudit: ConsultantWizardAuditEntry = {
        action: 'Step Changed',
        details: `Moved to step ${action.payload}`,
        timestamp: new Date().toISOString(),
        step: action.payload
      };
      return {
        ...state,
        currentStep: action.payload,
        timeline: [...state.timeline, stepChangeEvent],
        auditTrail: [...state.auditTrail, stepChangeAudit]
      };
    case 'UPDATE_FORM_DATA':
      if (action.payload.step === 'all') {
        // Replace the entire formData
        return {
          ...state,
          formData: action.payload.data,
          hasUnsavedChanges: true
        };
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.step]: action.payload.data
        },
        hasUnsavedChanges: true // Mark as unsaved when data updates
      };
    case 'SET_PATIENT':
      return {
        ...state,
        patient: action.payload,
        initialPatient: state.initialPatient || action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_DRAFT':
      return {
        ...state,
        draft: action.payload
      };
    case 'RESET_WIZARD':
      return {
        ...initialState,
        patient: state.initialPatient, // Keep the initial patient if we had one
        initialPatient: state.initialPatient,
        saveStatus: {
          ...initialState.saveStatus,
          isOnline: typeof window !== 'undefined' ? navigator.onLine : true
        }
      };
    case 'LOAD_DRAFT':
      // We'll handle loading in the effect, so just return state
      return state;
    case 'SET_SAVE_STATUS':
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          ...action.payload
        }
      };
    case 'SET_HAS_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload
      };
    case 'ADD_TO_TIMELINE':
      return {
        ...state,
        timeline: [...state.timeline, action.payload]
      };
    case 'ADD_TO_AUDIT_TRAIL':
      return {
        ...state,
        auditTrail: [...state.auditTrail, action.payload]
      };
    case 'SET_TIMELINE':
      return {
        ...state,
        timeline: action.payload
      };
    case 'SET_AUDIT_TRAIL':
      return {
        ...state,
        auditTrail: action.payload
      };
    default:
      return state;
  }
}

const ConsultationWizardContext = createContext<{
  state: ConsultationWizardState;
  dispatch: React.Dispatch<ConsultationWizardAction>;
} | null>(null);

export const ConsultationWizardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(consultationWizardReducer, initialState);

  // Save draft to sessionStorage with debounce
  useEffect(() => {
    const saveDraft = () => {
      // We want to save the entire state that can be restored.
      const draftData = {
        currentStep: state.currentStep,
        formData: state.formData,
        patient: state.patient,
        saveStatus: {
          lastSaved: state.saveStatus.lastSaved,
          isOnline: state.saveStatus.isOnline
          // Note: We are not saving isSaving because it's a transient state.
        },
        hasUnsavedChanges: state.hasUnsavedChanges,
        timeline: state.timeline,
        auditTrail: state.auditTrail
      };

      sessionStorage.setItem('consultationWizardDraft', JSON.stringify(draftData));
      dispatch({ type: 'SET_DRAFT', payload: draftData });
      dispatch({ type: 'SET_SAVE_STATUS', payload: {
        isSaving: false,
        lastSaved: Date.now(),
        saveError: null
      } });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
    };

    const handleSave = useCallback(() => {
      dispatch({ type: 'SET_SAVE_STATUS', payload: { isSaving: true } });
      // Simulate save delay
      setTimeout(() => {
        // In a real app, we would make an API call here
        // For now, we'll simulate success
        saveDraft();
      }, 500);
    }, [state.currentStep, state.formData, state.patient, state.hasUnsavedChanges, state.timeline, state.auditTrail, dispatch]);

    // Save on step change or form data change (we'll rely on the reducer setting hasUnsavedChanges)
    // We'll also set up auto-save interval
    const interval = setInterval(() => {
      if (state.hasUnsavedChanges) {
        handleSave();
      }
    }, 20000); // 20 seconds

    // Handle online/offline status
    const handleOnline = () => {
      dispatch({ type: 'SET_SAVE_STATUS', payload: { isOnline: true } });
    };
    const handleOffline = () => {
      dispatch({ type: 'SET_SAVE_STATUS', payload: { isOnline: false } });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load existing draft on mount
    const savedDraft = sessionStorage.getItem('consultationWizardDraft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      // We'll restore the entire state from the draft
      dispatch({ type: 'SET_CURRENT_STEP', payload: parsed.currentStep });
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { step: 'all', data: parsed.formData } });
      dispatch({ type: 'SET_PATIENT', payload: parsed.patient });
      // We'll also restore the saveStatus, hasUnsavedChanges, timeline, and auditTrail
      dispatch({ type: 'SET_SAVE_STATUS', payload: {
        isSaving: false,
        lastSaved: parsed.saveStatus?.lastSaved,
        saveError: null,
        isOnline: parsed.saveStatus?.isOnline
      } });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: parsed.hasUnsavedChanges });
      dispatch({ type: 'SET_TIMELINE', payload: parsed.timeline });
      dispatch({ type: 'SET_AUDIT_TRAIL', payload: parsed.auditTrail });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Also handle beforeunload for unsaved changes warning (handled in page)
    };
  }, [state.currentStep, state.formData, state.patient, state.hasUnsavedChanges, state.timeline, state.auditTrail, dispatch]);

  // Also save when the window loses focus (blur)
  useEffect(() => {
    const handleBlur = () => {
      if (state.hasUnsavedChanges) {
        // Trigger a save
        dispatch({ type: 'SET_SAVE_STATUS', payload: { isSaving: true } });
        setTimeout(() => {
          // Simulate save
          saveDraft();
        }, 500);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [state.hasUnsavedChanges, state.currentStep, state.formData, state.patient, state.timeline, state.auditTrail, dispatch]);

  // Manual save function
  const manualSave = useCallback(() => {
    dispatch({ type: 'SET_SAVE_STATUS', payload: { isSaving: true } });
    setTimeout(() => {
      // Simulate save
      saveDraft();
    }, 500);
  }, [state.currentStep, state.formData, state.patient, state.hasUnsavedChanges, state.timeline, state.auditTrail, dispatch]);

  // Function to clear draft (used when completing or discarding)
  const clearDraft = useCallback(() => {
    sessionStorage.removeItem('consultationWizardDraft');
    dispatch({ type: 'SET_DRAFT', payload: null });
    dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
    // We also clear the timeline and auditTrail by setting them to empty arrays.
    dispatch({ type: 'SET_TIMELINE', payload: [] });
    dispatch({ type: 'SET_AUDIT_TRAIL', payload: [] });
  }, [dispatch]);

  // Function to reset wizard (includes clearing draft)
  const resetWizard = useCallback(() => {
    clearDraft();
    dispatch({ type: 'RESET_WIZARD' });
  }, [clearDraft, dispatch]);

  const value = {
    state,
    dispatch,
    // Expose helper functions
    manualSave,
    clearDraft,
    resetWizard
  };

  return <ConsultationWizardContext.Provider value={value}>{children}</ConsultationWizardContext.Provider>;
};

// Custom hook to use the context
export const useConsultationWizard = () => {
  const context = useContext(ConsultationWizardContext);
  if (!context) {
    throw new Error('useConsultationWizard must be used within a ConsultationWizardProvider');
  }
  return context;
};

// We'll also export the individual dispatch functions for convenience
export const useConsultationWizardActions = () => {
  const { dispatch } = useConsultationWizard();
  return {
    setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    updateFormData: (step: string, data: any) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { step, data } }),
    setPatient: (patient: any) => dispatch({ type: 'SET_PATIENT', payload: patient }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setDraft: (draft: any) => dispatch({ type: 'SET_DRAFT', payload: draft }),
    resetWizard: () => dispatch({ type: 'RESET_WIZARD' }),
    loadDraft: () => dispatch({ type: 'LOAD_DRAFT' }),
    // Expose the helper functions from context
    manualSave: (() => {}) // We'll get this from context directly in components
  };
};