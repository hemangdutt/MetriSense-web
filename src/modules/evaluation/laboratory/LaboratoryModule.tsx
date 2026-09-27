import React from 'react';
import { LaboratoryModel, WeightStandardClass } from '../../../models';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { FieldGroup } from '../../../components/forms/FieldGroup';
import { useI18n } from '../../../i18n';

interface LaboratoryModuleProps {
  laboratory: LaboratoryModel;
  onChange: (updated: LaboratoryModel) => void;
}

const WEIGHT_CLASSES: WeightStandardClass[] = [
  'OIML Class E1',
  'OIML Class E2',
  'OIML Class F1',
  'OIML Class F2',
  'OIML Class M1',
];

const INDIAN_GOV_LAB_PRESETS = [
  {
    name: 'Regional Reference Standard Laboratory (RRSL), Ahmedabad',
    code: 'RRSL-WR-AHM-01',
    directorate: 'Western Region Directorate, Department of Consumer Affairs',
  },
  {
    name: 'Regional Reference Standard Laboratory (RRSL), Faridabad',
    code: 'RRSL-NR-FBD-01',
    directorate: 'Northern Region Directorate, Department of Consumer Affairs',
  },
  {
    name: 'Regional Reference Standard Laboratory (RRSL), Bengaluru',
    code: 'RRSL-SR-BLR-01',
    directorate: 'Southern Region Directorate, Department of Consumer Affairs',
  },
  {
    name: 'Regional Reference Standard Laboratory (RRSL), Bhubaneswar',
    code: 'RRSL-ER-BBS-01',
    directorate: 'Eastern Region Directorate, Department of Consumer Affairs',
  },
  {
    name: 'Regional Reference Standard Laboratory (RRSL), Guwahati',
    code: 'RRSL-NER-GHY-01',
    directorate: 'North-Eastern Region Directorate, Department of Consumer Affairs',
  },
  {
    name: 'CSIR — National Physical Laboratory (NPL), New Delhi',
    code: 'CSIR-NPL-ND-M01',
    directorate: 'National Metrology Institute (NMI) — Mass Standards Division',
  },
];

export const LaboratoryModule: React.FC<LaboratoryModuleProps> = ({
  laboratory,
  onChange,
}) => {
  const { t } = useI18n();

  const handleField = <K extends keyof LaboratoryModel>(
    key: K,
    value: LaboratoryModel[K]
  ) => {
    onChange({
      ...laboratory,
      [key]: value,
    });
  };

  const applyPreset = (presetIndex: number) => {
    const p = INDIAN_GOV_LAB_PRESETS[presetIndex];
    if (!p) return;
    onChange({
      ...laboratory,
      laboratoryName: p.name,
      laboratoryCode: p.code,
      regionalDirectorate: p.directorate,
    });
  };

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.laboratoryModule.partATitle}
        clauseRef={t.laboratoryModule.partAClause}
        subtitle={t.laboratoryModule.partASubtitle}
        rightActions={
          <select
            className="gov-input text-xs w-auto max-w-full"
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (!isNaN(idx)) applyPreset(idx);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              {t.laboratoryModule.presetPlaceholder}
            </option>
            {INDIAN_GOV_LAB_PRESETS.map((p, idx) => (
              <option key={p.code} value={idx}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
          <FieldGroup label={t.laboratoryModule.labNameLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.laboratoryName}
              onChange={(e) => handleField('laboratoryName', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.labCodeLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.laboratoryCode}
              onChange={(e) => handleField('laboratoryCode', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup
            label={t.laboratoryModule.stageLabel}
            required
            hint={t.laboratoryModule.stageHint}
          >
            <select
              className="gov-input font-semibold"
              value={laboratory.inspectionStage}
              onChange={(e) =>
                handleField(
                  'inspectionStage',
                  e.target.value as LaboratoryModel['inspectionStage']
                )
              }
            >
              <option value="Initial Type Evaluation">
                {t.laboratoryModule.stageTypeEval}
              </option>
              <option value="Initial Verification">
                {t.laboratoryModule.stageInitialVer}
              </option>
              <option value="In-Service Inspection">
                {t.laboratoryModule.stageInService}
              </option>
            </select>
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.directorateLabel}>
            <input
              type="text"
              className="gov-input"
              value={laboratory.regionalDirectorate}
              onChange={(e) => handleField('regionalDirectorate', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.bayLocationLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.testBayLocation}
              onChange={(e) => handleField('testBayLocation', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.testDateLabel} required>
            <input
              type="date"
              className="gov-input"
              value={laboratory.testDate}
              onChange={(e) => handleField('testDate', e.target.value)}
            />
          </FieldGroup>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.laboratoryModule.partBTitle}
        clauseRef={t.laboratoryModule.partBClause}
        subtitle={t.laboratoryModule.partBSubtitle}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <FieldGroup label={t.laboratoryModule.officerNameLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.testingOfficerName}
              onChange={(e) => handleField('testingOfficerName', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.officerDesigLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.testingOfficerDesignation}
              onChange={(e) =>
                handleField('testingOfficerDesignation', e.target.value)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.officerIdLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.testingOfficerId}
              onChange={(e) => handleField('testingOfficerId', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.supervisorLabel}>
            <input
              type="text"
              className="gov-input"
              value={laboratory.supervisingOfficerName}
              onChange={(e) =>
                handleField('supervisingOfficerName', e.target.value)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.weightSetIdLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.referenceWeightSetId}
              onChange={(e) =>
                handleField('referenceWeightSetId', e.target.value)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.weightClassLabel} required>
            <select
              className="gov-input"
              value={laboratory.referenceWeightClass}
              onChange={(e) =>
                handleField(
                  'referenceWeightClass',
                  e.target.value as WeightStandardClass
                )
              }
            >
              {WEIGHT_CLASSES.map((wc) => (
                <option key={wc} value={wc}>
                  {wc}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.certRefLabel} required>
            <input
              type="text"
              className="gov-input"
              value={laboratory.calibrationCertRef}
              onChange={(e) => handleField('calibrationCertRef', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.laboratoryModule.certValidLabel} required>
            <input
              type="date"
              className="gov-input"
              value={laboratory.calibrationValidUntil}
              onChange={(e) =>
                handleField('calibrationValidUntil', e.target.value)
              }
            />
          </FieldGroup>
        </div>
      </SectionPanel>
    </div>
  );
};
