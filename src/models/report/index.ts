import { ComplianceResult } from '../observation';

export interface ClauseComplianceItem {
  clauseRef: string; // e.g., "OIML R 76-1 Cl. 3.2"
  clauseTitle: string;
  requirementSummary: string;
  observedSummary: string;
  status: ComplianceResult;
}

export interface EvaluationValidationReport {
  evaluationId: string;
  isInstrumentSpecValid: boolean;
  instrumentSpecErrors: string[];
  isEnvironmentValid: boolean;
  environmentWarnings: string[];
  weighingPerformanceStatus: ComplianceResult;
  maxObservedAbsError: number;
  repeatabilityStatus: ComplianceResult;
  maxRepeatabilitySpread: number;
  eccentricityStatus: ComplianceResult;
  maxEccentricityAbsError: number;
  temperatureStatus: ComplianceResult;
  maxThermalDriftPerStepE: number;
  clauseMatrix: ClauseComplianceItem[];
  overallDisposition: 'COMPLIANT' | 'NON-COMPLIANT' | 'INCOMPLETE';
}
