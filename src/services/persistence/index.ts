import { EvaluationRecord } from '../../models';
import { EvaluationService } from '../evaluation';

const STORAGE_KEY = 'metrisense_gov_evaluations_v2';
const LAB_PROFILE_KEY = 'metrisense_gov_lab_profile_v2';

export interface LaboratoryProfileSettings {
  laboratoryName: string;
  laboratoryCode: string;
  regionalDirectorate: string;
  defaultBayLocation: string;
  officerName: string;
  officerDesignation: string;
  officerId: string;
  supervisingOfficerName: string;
  defaultWeightSetId: string;
  defaultCalibrationCertRef: string;
}

export const DEFAULT_LAB_PROFILE: LaboratoryProfileSettings = {
  laboratoryName: 'Regional Reference Standard Laboratory (RRSL), Ahmedabad',
  laboratoryCode: 'RRSL-WR-AHM-01',
  regionalDirectorate: 'Department of Consumer Affairs, Govt. of India (Western Region)',
  defaultBayLocation: 'Mass & NAWI Type Evaluation Bay M-02',
  officerName: 'Sh. R. K. Kulkarni',
  officerDesignation: 'Deputy Director (Legal Metrology)',
  officerId: 'LM-GOI-4418',
  supervisingOfficerName: 'Dr. S. V. Deshpande, Director (RRSL)',
  defaultWeightSetId: 'NPL-F1-SET-2024-09',
  defaultCalibrationCertRef: 'CSIR-NPL/MASS/2025/0881',
};

function buildSeedEvaluations(): EvaluationRecord[] {
  // Record 1: Approved Class III Platform Scale (Compliant)
  const rec1 = EvaluationService.createNewEvaluationRecord(
    'LM/RRSL/2026/0041',
    'F.No. 14(08)/2026-RRSL/AHM'
  );
  rec1.status = 'APPROVED';
  rec1.certificateNumber = 'GOI/LM/OIML-R76/2026/0194';
  rec1.certificateIssuedDate = '2026-09-19';
  rec1.instrument = {
    ...rec1.instrument,
    manufacturer: 'Sansui Electronics Pvt. Ltd.',
    manufacturerAddress: 'MIDC Bhosari, Pune - 411026, Maharashtra',
    modelDesignation: 'SSP-60-IND',
    serialNumber: 'SEP-2026-88412',
    typeApprovalRef: 'IND/09/26/308',
    instrumentType: 'Electronic Platform Scale',
    accuracyClass: 'Class III',
    unit: 'kg',
    maxCapacity: 60,
    minCapacity: 0.4,
    verificationScaleInterval: 0.02,
    actualScaleInterval: 0.02,
    verificationIntervalsN: 3000,
    subtractiveTareMax: 30,
  };
  const rec1Hydrated = EvaluationService.regenerateAllStandardTestSchedules(rec1);
  // Add realistic minor errors within MPE
  rec1Hydrated.errorObservations = rec1Hydrated.errorObservations.map((row, idx) => {
    const slightDelta = idx === 3 ? 0.014 : idx === 4 ? 0.008 : 0.01;
    return {
      ...row,
      deltaLoad: slightDelta,
    };
  });
  rec1Hydrated.officerRemarks =
    'Instrument evaluated across full load range (0.4 kg to 60 kg), 5-point eccentricity at 20 kg, and environmental chamber cycling (-10 °C to +40 °C). All metrological parameters strictly conform to OIML R 76-1 Class III limits.';
  rec1Hydrated.reviewerRemarks =
    'Verified raw observation sheets and CSIR-NPL traceability certificates. Approved for Type Approval Certificate issuance.';

  // Record 2: Class II Precision Analytical Balance (In Progress)
  const rec2 = EvaluationService.createNewEvaluationRecord(
    'LM/RRSL/2026/0042',
    'F.No. 14(11)/2026-RRSL/AHM'
  );
  rec2.status = 'IN PROGRESS';
  rec2.instrument = {
    ...rec2.instrument,
    manufacturer: 'Contech Instruments Ltd.',
    manufacturerAddress: 'EL-221, TTC Industrial Area, Mahape, Navi Mumbai - 400710',
    modelDesignation: 'CA-6002-lab',
    serialNumber: 'CIL-26-09421',
    typeApprovalRef: 'IND/09/26/419',
    instrumentType: 'Precision Analytical Balance',
    accuracyClass: 'Class II',
    unit: 'g',
    maxCapacity: 6000,
    minCapacity: 5,
    verificationScaleInterval: 0.1,
    actualScaleInterval: 0.01,
    verificationIntervalsN: 60000,
    subtractiveTareMax: 6000,
    ratedTempMin: 10,
    ratedTempMax: 30,
  };
  rec2.laboratory.referenceWeightClass = 'OIML Class E2';
  rec2.laboratory.referenceWeightSetId = 'NPL-E2-SET-2025-02';
  const rec2Hydrated = EvaluationService.regenerateAllStandardTestSchedules(rec2);
  rec2Hydrated.officerRemarks =
    'High-resolution Class II laboratory balance (n = 60,000). Weighing performance and eccentricity verified; thermal chamber soak at +30 °C under review.';

  // Record 3: Non-Compliant Class III Bench Scale (Failed at Max Load & Eccentricity Position 4)
  const rec3 = EvaluationService.createNewEvaluationRecord(
    'LM/RRSL/2026/0039',
    'F.No. 14(03)/2026-RRSL/FBD'
  );
  rec3.status = 'REJECTED';
  rec3.instrument = {
    ...rec3.instrument,
    manufacturer: 'Bharat Scale & Engineering Works',
    manufacturerAddress: 'Industrial Estate, Ambala Cantt - 133001, Haryana',
    modelDesignation: 'BSE-150-T',
    serialNumber: 'BSE-2026-1109',
    typeApprovalRef: 'IND/09/26/275',
    instrumentType: 'Electronic Platform Scale',
    accuracyClass: 'Class III',
    unit: 'kg',
    maxCapacity: 150,
    minCapacity: 1.0,
    verificationScaleInterval: 0.05,
    actualScaleInterval: 0.05,
    verificationIntervalsN: 3000,
    subtractiveTareMax: 50,
  };
  rec3.laboratory.laboratoryName = 'Regional Reference Standard Laboratory (RRSL), Faridabad';
  rec3.laboratory.laboratoryCode = 'RRSL-NR-FBD-01';
  const rec3Hydrated = EvaluationService.regenerateAllStandardTestSchedules(rec3);
  // Inject a realistic non-compliant error at Max capacity and Eccentricity pos 4
  rec3Hydrated.errorObservations = rec3Hydrated.errorObservations.map((row) => {
    if (row.appliedLoad === 150) {
      return {
        ...row,
        indicatedValue: 150.1,
        deltaLoad: 0.005, // Causes error > 0.075 kg MPE
      };
    }
    return row;
  });
  rec3Hydrated.eccentricityObservations = rec3Hydrated.eccentricityObservations.map((row) => {
    if (row.positionNumber === 4) {
      return {
        ...row,
        indicatedValue: row.appliedLoad + 0.05,
        deltaLoad: 0.005, // Causes corner error > ±0.025 kg MPE
      };
    }
    return row;
  });
  rec3Hydrated.officerRemarks =
    'NON-COMPLIANT: Exceeded Maximum Permissible Error (±0.075 kg) at Max load (150 kg) with observed Ec = +0.120 kg, and failed Back-Right Quadrant eccentricity test (Position 4). Notice of Non-Compliance issued for load cell corner trimming.';

  // Record 4: Archived Weighbridge Dossier
  const rec4 = EvaluationService.createNewEvaluationRecord(
    'LM/RRSL/2026/0034',
    'F.No. 11(40)/2026-RRSL/BLR'
  );
  rec4.status = 'ARCHIVED';
  rec4.certificateNumber = 'GOI/LM/OIML-R76/2026/0162';
  rec4.certificateIssuedDate = '2026-08-28';
  rec4.instrument = {
    ...rec4.instrument,
    manufacturer: 'Avery India Limited',
    manufacturerAddress: 'Plot 50-59, Sector 25, Ballabgarh - 121004, Haryana',
    modelDesignation: 'T302-WB-60T',
    serialNumber: 'AIL-WB-2026-409',
    typeApprovalRef: 'IND/09/25/890',
    instrumentType: 'Road Weighbridge',
    loadReceptorGeometry: 'Multi-Section Weighbridge (6–8 Support Points)',
    accuracyClass: 'Class III',
    unit: 'kg',
    maxCapacity: 60000,
    minCapacity: 400,
    verificationScaleInterval: 20,
    actualScaleInterval: 20,
    verificationIntervalsN: 3000,
    subtractiveTareMax: 10000,
  };
  rec4.laboratory.laboratoryName = 'Regional Reference Standard Laboratory (RRSL), Bengaluru';
  rec4.laboratory.laboratoryCode = 'RRSL-SR-BLR-01';
  rec4.laboratory.referenceWeightClass = 'OIML Class M1';
  rec4.laboratory.referenceWeightSetId = 'RRSL-BLR-M1-60T-ARRAY';
  const rec4Hydrated = EvaluationService.regenerateAllStandardTestSchedules(rec4);
  rec4Hydrated.officerRemarks =
    '60,000 kg Pitless Electronic Road Weighbridge evaluated per OIML R 76-1. Archived following issuance of statutory Type Approval Certificate.';

  return [
    EvaluationService.recalculateEvaluation(rec2Hydrated),
    EvaluationService.recalculateEvaluation(rec1Hydrated),
    EvaluationService.recalculateEvaluation(rec3Hydrated),
    EvaluationService.recalculateEvaluation(rec4Hydrated),
  ];
}

export class PersistenceService {
  static getEvaluations(): EvaluationRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    const seed = buildSeedEvaluations();
    this.saveEvaluations(seed);
    return seed;
  }

  static saveEvaluations(records: EvaluationRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn('PersistenceService write error:', err);
    }
  }

  static saveSingleEvaluation(record: EvaluationRecord): EvaluationRecord[] {
    const recalculated = EvaluationService.recalculateEvaluation(record);
    const list = this.getEvaluations();
    const index = list.findIndex((r) => r.id === recalculated.id);
    let updated: EvaluationRecord[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = recalculated;
    } else {
      updated = [recalculated, ...list];
    }
    this.saveEvaluations(updated);
    return updated;
  }

  static deleteEvaluation(id: string): EvaluationRecord[] {
    const list = this.getEvaluations().filter((r) => r.id !== id);
    this.saveEvaluations(list);
    return list;
  }

  static generateNextIdentifiers(): { id: string; fileReferenceNo: string } {
    const list = this.getEvaluations();
    const year = new Date().getFullYear();
    const seq = String(list.length + 43).padStart(4, '0');
    return {
      id: `LM/RRSL/${year}/${seq}`,
      fileReferenceNo: `F.No. 14(${list.length + 12})/${year}-LM/RRSL`,
    };
  }

  static resetToDepartmentalSeed(): EvaluationRecord[] {
    const seed = buildSeedEvaluations();
    this.saveEvaluations(seed);
    return seed;
  }

  static getLabProfile(): LaboratoryProfileSettings {
    try {
      const raw = localStorage.getItem(LAB_PROFILE_KEY);
      if (raw) {
        return { ...DEFAULT_LAB_PROFILE, ...JSON.parse(raw) };
      }
    } catch {}
    return DEFAULT_LAB_PROFILE;
  }

  static saveLabProfile(profile: LaboratoryProfileSettings): void {
    try {
      localStorage.setItem(LAB_PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  }
}
