export type WeightStandardClass = 'OIML Class E1' | 'OIML Class E2' | 'OIML Class F1' | 'OIML Class F2' | 'OIML Class M1';

export interface LaboratoryModel {
  laboratoryName: string;
  laboratoryCode: string; // e.g., RRSL-AHM-02 or NPL-ND-M01
  regionalDirectorate: string;
  testBayLocation: string;
  testingOfficerName: string;
  testingOfficerDesignation: string;
  testingOfficerId: string;
  supervisingOfficerName: string;
  referenceWeightSetId: string;
  referenceWeightClass: WeightStandardClass;
  calibrationCertRef: string;
  calibrationValidUntil: string;
  testDate: string;
  inspectionStage: 'Initial Type Evaluation' | 'Initial Verification' | 'In-Service Inspection';
}

export interface EnvironmentalConditionsModel {
  tempStartC: number;
  tempEndC: number;
  humidityStartPct: number;
  humidityEndPct: number;
  pressureHpa: number;
  mainsVoltageV: number;
  mainsFrequencyHz: number;
  thermalStabilizationHours: number;
  vibrationIsolationVerified: boolean;
  levelIndicatorVerified: boolean;
  warmupTimeMinutes: number;
  environmentalRemarks: string;
}
