import React from 'react';
import {
  AccuracyClass,
  InstrumentModel,
  InstrumentType,
  LoadReceptorGeometry,
  MassUnit,
} from '../../../models';
import {
  evaluateInstrumentClassification,
  getMpeTableBandsForInstrument,
  OIML_TABLE_3_RULES,
} from '../../../rules';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { FieldGroup } from '../../../components/forms/FieldGroup';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { useI18n } from '../../../i18n';

interface InstrumentModuleProps {
  instrument: InstrumentModel;
  inspectionStage: 'Initial Type Evaluation' | 'Initial Verification' | 'In-Service Inspection';
  onChange: (updated: InstrumentModel) => void;
  onRegenerateTestSchedule: () => void;
}

const INSTRUMENT_TYPES: InstrumentType[] = [
  'Electronic Bench Scale',
  'Electronic Platform Scale',
  'Precision Analytical Balance',
  'Road Weighbridge',
  'Hopper / Tank Weighing System',
  'Retail Counter Scale',
];

const GEOMETRY_TYPES: LoadReceptorGeometry[] = [
  'Square / Rectangular (4 Corner + Centre — 5 Points)',
  'Circular / Single Cell (Centre + 4 Quadrants — 5 Points)',
  'Multi-Section Weighbridge (6–8 Support Points)',
];

const ACCURACY_CLASSES: AccuracyClass[] = [
  'Class I',
  'Class II',
  'Class III',
  'Class IIII',
];

const UNITS: MassUnit[] = ['kg', 'g', 'mg', 't'];

export const InstrumentModule: React.FC<InstrumentModuleProps> = ({
  instrument,
  inspectionStage,
  onChange,
  onRegenerateTestSchedule,
}) => {
  const { t } = useI18n();
  const classification = evaluateInstrumentClassification(instrument);
  const inServiceMult = inspectionStage === 'In-Service Inspection' ? 2 : 1;
  const mpeBands = getMpeTableBandsForInstrument(
    instrument.accuracyClass,
    instrument.verificationScaleInterval,
    instrument.maxCapacity,
    instrument.unit,
    inServiceMult
  );
  const classRules = OIML_TABLE_3_RULES[instrument.accuracyClass];

  const handleField = <K extends keyof InstrumentModel>(
    key: K,
    value: InstrumentModel[K]
  ) => {
    onChange({
      ...instrument,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.instrumentModule.partATitle}
        clauseRef={t.instrumentModule.partAClause}
        subtitle={t.instrumentModule.partASubtitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
          <FieldGroup label={t.instrumentModule.manufacturerLabel} required>
            <input
              type="text"
              className="gov-input"
              value={instrument.manufacturer}
              onChange={(e) => handleField('manufacturer', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.modelLabel} required>
            <input
              type="text"
              className="gov-input"
              value={instrument.modelDesignation}
              onChange={(e) => handleField('modelDesignation', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.serialLabel} required>
            <input
              type="text"
              className="gov-input"
              value={instrument.serialNumber}
              onChange={(e) => handleField('serialNumber', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.addressLabel}>
            <input
              type="text"
              className="gov-input"
              value={instrument.manufacturerAddress}
              onChange={(e) => handleField('manufacturerAddress', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.approvalRefLabel}
            hint={t.instrumentModule.approvalRefHint}
          >
            <input
              type="text"
              className="gov-input"
              value={instrument.typeApprovalRef}
              onChange={(e) => handleField('typeApprovalRef', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.softwareLabel}
            hint={t.instrumentModule.softwareHint}
          >
            <input
              type="text"
              className="gov-input"
              value={instrument.softwareVersion}
              onChange={(e) => handleField('softwareVersion', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.categoryLabel}>
            <select
              className="gov-input"
              value={instrument.instrumentType}
              onChange={(e) =>
                handleField('instrumentType', e.target.value as InstrumentType)
              }
            >
              {INSTRUMENT_TYPES.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.geometryLabel}
            hint={t.instrumentModule.geometryHint}
          >
            <select
              className="gov-input"
              value={instrument.loadReceptorGeometry}
              onChange={(e) =>
                handleField(
                  'loadReceptorGeometry',
                  e.target.value as LoadReceptorGeometry
                )
              }
            >
              {GEOMETRY_TYPES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.zeroDeviceLabel}>
            <select
              className="gov-input"
              value={instrument.zeroSettingDevice}
              onChange={(e) =>
                handleField(
                  'zeroSettingDevice',
                  e.target.value as InstrumentModel['zeroSettingDevice']
                )
              }
            >
              <option value="Semi-automatic">Semi-automatic</option>
              <option value="Automatic">Automatic</option>
              <option value="Non-automatic">Non-automatic</option>
              <option value="Initial Zero-Setting">Initial Zero-Setting</option>
            </select>
          </FieldGroup>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.instrumentModule.partBTitle}
        clauseRef={t.instrumentModule.partBClause}
        subtitle={t.instrumentModule.partBSubtitle}
        rightActions={
          <button
            type="button"
            onClick={onRegenerateTestSchedule}
            className="gov-btn-secondary"
          >
            {t.instrumentModule.rebuildScheduleBtn}
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <FieldGroup label={t.instrumentModule.accuracyClassLabel} required>
            <select
              className="gov-input font-semibold"
              value={instrument.accuracyClass}
              onChange={(e) =>
                handleField('accuracyClass', e.target.value as AccuracyClass)
              }
            >
              {ACCURACY_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label={t.instrumentModule.unitLabel} required>
            <select
              className="gov-input"
              value={instrument.unit}
              onChange={(e) => handleField('unit', e.target.value as MassUnit)}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.maxCapLabel}
            unit={instrument.unit}
            required
          >
            <input
              type="number"
              step="any"
              className="gov-input"
              value={instrument.maxCapacity}
              onChange={(e) =>
                handleField('maxCapacity', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.minCapLabel}
            unit={instrument.unit}
            hint={`${t.instrumentModule.minCapHintPrefix} ${classRules.minCapacityInE} e`}
            required
          >
            <input
              type="number"
              step="any"
              className="gov-input"
              value={instrument.minCapacity}
              onChange={(e) =>
                handleField('minCapacity', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.eIntervalLabel}
            unit={instrument.unit}
            required
          >
            <input
              type="number"
              step="any"
              className="gov-input"
              value={instrument.verificationScaleInterval}
              onChange={(e) =>
                handleField(
                  'verificationScaleInterval',
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.dIntervalLabel}
            unit={instrument.unit}
            hint={t.instrumentModule.dIntervalHint}
          >
            <input
              type="number"
              step="any"
              className="gov-input"
              value={instrument.actualScaleInterval}
              onChange={(e) =>
                handleField('actualScaleInterval', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.tareRangeLabel}
            unit={instrument.unit}
          >
            <input
              type="number"
              step="any"
              className="gov-input"
              value={instrument.subtractiveTareMax}
              onChange={(e) =>
                handleField('subtractiveTareMax', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.instrumentModule.tempRangeLabel}
            unit="°C"
            hint={t.instrumentModule.tempRangeHint}
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="gov-input"
                value={instrument.ratedTempMin}
                onChange={(e) =>
                  handleField('ratedTempMin', parseFloat(e.target.value) || 0)
                }
              />
              <input
                type="number"
                className="gov-input"
                value={instrument.ratedTempMax}
                onChange={(e) =>
                  handleField('ratedTempMax', parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </FieldGroup>
        </div>

        {/* Computed Rule Engine Strip */}
        <div className="mt-4 pt-4 border-t border-slate-300 grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs text-slate-700 font-semibold">
              {t.instrumentModule.computedNLabel}
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-slate-950">
                {classification.calculatedN.toLocaleString()}
              </span>
              <span className="text-xs text-slate-600">
                {t.instrumentModule.table3RangePrefix} {classRules.minN.toLocaleString()}{' '}
                {t.instrumentModule.toText}{' '}
                {classRules.maxN ? classRules.maxN.toLocaleString() : '∞'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs text-slate-700 font-semibold">
              {t.instrumentModule.computedMinLabel}
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-slate-950">
                {classification.calculatedMinInE.toLocaleString()} e
              </span>
              <span className="text-xs text-slate-600">
                {t.instrumentModule.table3MinPrefix} {classRules.minCapacityInE} e
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 flex flex-col justify-between min-w-0">
            <div className="text-xs text-slate-700 font-semibold">
              {t.instrumentModule.table3ConformanceLabel}
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <StatusIndicator
                status={classification.isValid ? 'COMPLIANT' : 'NON-COMPLIANT'}
              />
              <span className="text-xs text-slate-600">{classRules.description}</span>
            </div>
          </div>
        </div>

        {!classification.isValid && (
          <div className="mt-3 p-3 bg-red-50 border border-red-300 text-xs text-red-900 space-y-1">
            <div className="font-bold">
              {t.instrumentModule.nonConformanceAlertTitle}
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {classification.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </SectionPanel>

      <SectionPanel
        title={t.instrumentModule.partCTitle}
        clauseRef={t.instrumentModule.partCClause}
        subtitle={`${t.instrumentModule.partCSubtitlePrefix} ${instrument.accuracyClass} (e = ${instrument.verificationScaleInterval} ${instrument.unit}) — ${inspectionStage}.`}
      >
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t.instrumentModule.colBand}</th>
                <th>{t.instrumentModule.colPermissibleE}</th>
                <th>{t.instrumentModule.colLoadIntervalE}</th>
                <th>
                  {t.instrumentModule.colLoadRangeUnit} ({instrument.unit})
                </th>
                <th>
                  {t.instrumentModule.colAbsMpe} (± {instrument.unit})
                </th>
              </tr>
            </thead>
            <tbody>
              {mpeBands.map((band) => (
                <tr key={band.bandIndex}>
                  <td>
                    {t.instrumentModule.bandPrefix} {band.bandIndex}
                  </td>
                  <td className="font-semibold text-slate-900">{band.mpeInE}</td>
                  <td>{band.loadRangeInE}</td>
                  <td>{band.loadRangeInUnit}</td>
                  <td className="font-bold text-[#12355B]">
                    ± {band.mpeValueInUnit} {instrument.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </div>
  );
};
