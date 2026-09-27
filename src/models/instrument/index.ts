export type AccuracyClass = 'Class I' | 'Class II' | 'Class III' | 'Class IIII';

export type MassUnit = 'kg' | 'g' | 'mg' | 't';

export type InstrumentType =
  | 'Electronic Bench Scale'
  | 'Electronic Platform Scale'
  | 'Precision Analytical Balance'
  | 'Road Weighbridge'
  | 'Hopper / Tank Weighing System'
  | 'Retail Counter Scale';

export type LoadReceptorGeometry =
  | 'Square / Rectangular (4 Corner + Centre — 5 Points)'
  | 'Circular / Single Cell (Centre + 4 Quadrants — 5 Points)'
  | 'Multi-Section Weighbridge (6–8 Support Points)';

export interface InstrumentModel {
  manufacturer: string;
  manufacturerAddress: string;
  modelDesignation: string;
  serialNumber: string;
  typeApprovalRef: string;
  softwareVersion: string;
  instrumentType: InstrumentType;
  loadReceptorGeometry: LoadReceptorGeometry;
  accuracyClass: AccuracyClass;
  unit: MassUnit;
  maxCapacity: number; // Max
  minCapacity: number; // Min
  verificationScaleInterval: number; // e
  actualScaleInterval: number; // d
  verificationIntervalsN: number; // n = Max / e
  subtractiveTareMax: number; // T = -...
  ratedTempMin: number; // °C (e.g. -10 or +10)
  ratedTempMax: number; // °C (e.g. +40 or +30)
  zeroSettingDevice: 'Non-automatic' | 'Semi-automatic' | 'Automatic' | 'Initial Zero-Setting';
  zeroTrackingEnabled: boolean;
}
