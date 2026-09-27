import { InstrumentModel } from '../instrument';
import { EnvironmentalConditionsModel, LaboratoryModel } from '../laboratory';
import {
  EccentricityPositionRow,
  ErrorObservationRow,
  RepeatabilityTrialRow,
  TemperatureTestRow,
} from '../observation';

export type EvaluationStatus =
  | 'DRAFT'
  | 'IN PROGRESS'
  | 'UNDER REVIEW'
  | 'APPROVED'
  | 'ARCHIVED'
  | 'REJECTED';

export type ComplianceDisposition =
  | 'COMPLIANT'
  | 'NON-COMPLIANT'
  | 'INCOMPLETE';

export interface EvaluationRecord {
  id: string; // e.g., LM/RRSL/NAWI/2026/0042
  fileReferenceNo: string; // e.g., F.No. 14(22)/2026-LM/RRSL
  createdAt: string;
  updatedAt: string;
  status: EvaluationStatus;
  disposition: ComplianceDisposition;
  instrument: InstrumentModel;
  laboratory: LaboratoryModel;
  environment: EnvironmentalConditionsModel;
  errorObservations: ErrorObservationRow[];
  repeatabilityTrials: RepeatabilityTrialRow[];
  eccentricityObservations: EccentricityPositionRow[];
  temperatureObservations: TemperatureTestRow[];
  officerRemarks: string;
  reviewerRemarks: string;
  certificateNumber?: string;
  certificateIssuedDate?: string;
}
