import React from 'react';
import { EvaluationRecord } from '../../models';
import { EvaluationService, ReportExportService } from '../../services';
import { validateCompleteEvaluation } from '../../rules';
import { StatusIndicator } from '../../components/feedback/StatusIndicator';
import { InstrumentModule } from '../../modules/evaluation/instrument/InstrumentModule';
import { LaboratoryModule } from '../../modules/evaluation/laboratory/LaboratoryModule';
import { EnvironmentalModule } from '../../modules/evaluation/environmental/EnvironmentalModule';
import { ErrorTestModule } from '../../modules/evaluation/error/ErrorTestModule';
import { RepeatabilityModule } from '../../modules/evaluation/repeatability/RepeatabilityModule';
import { EccentricityModule } from '../../modules/evaluation/eccentricity/EccentricityModule';
import { TemperatureModule } from '../../modules/evaluation/temperature/TemperatureModule';
import { ReviewModule } from '../../modules/evaluation/review/ReviewModule';
import { ReportCertificateModule } from '../../modules/evaluation/report/ReportCertificateModule';
import { useI18n } from '../../i18n';

interface EvaluationWorkbenchPageProps {
  record: EvaluationRecord;
  activeStageIndex: number;
  onChangeStageIndex: (idx: number) => void;
  onUpdateRecord: (updated: EvaluationRecord) => void;
  onBackToRegister: () => void;
}

export const EvaluationWorkbenchPage: React.FC<EvaluationWorkbenchPageProps> = ({
  record,
  activeStageIndex,
  onChangeStageIndex,
  onUpdateRecord,
  onBackToRegister,
}) => {
  const { t } = useI18n();
  const validation = validateCompleteEvaluation(record);
  const inServiceMult =
    record.laboratory.inspectionStage === 'In-Service Inspection' ? 2 : 1;

  const stages = [
    { idx: 0, label: t.stages.s1_instrument },
    { idx: 1, label: t.stages.s2_laboratory },
    { idx: 2, label: t.stages.s3_environment },
    { idx: 3, label: t.stages.s4_error },
    { idx: 4, label: t.stages.s5_repeatability },
    { idx: 5, label: t.stages.s6_eccentricity },
    { idx: 6, label: t.stages.s7_temperature },
    { idx: 7, label: t.stages.s8_review },
    { idx: 8, label: t.stages.s9_report },
  ];

  const handleRecalculateAndSave = (next: EvaluationRecord) => {
    const recalculated = EvaluationService.recalculateEvaluation(next);
    onUpdateRecord(recalculated);
  };

  const handleRegenerateAllSchedules = () => {
    const regenerated = EvaluationService.regenerateAllStandardTestSchedules(record);
    onUpdateRecord(regenerated);
  };

  const handleApproveCertificate = () => {
    const year = new Date().getFullYear();
    const certNo =
      record.certificateNumber ||
      `GOI/LM/OIML-R76/${year}/${Math.floor(1000 + Math.random() * 8999)}`;
    const today = new Date().toISOString().slice(0, 10);
    handleRecalculateAndSave({
      ...record,
      status: 'APPROVED',
      certificateNumber: certNo,
      certificateIssuedDate: today,
    });
    onChangeStageIndex(8);
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Persistent Engineering Dossier Context Bar */}
      <div className="gov-panel bg-white p-3.5 no-print min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-300">
          <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
            <button
              type="button"
              onClick={onBackToRegister}
              className="text-[#12355B] font-bold hover:underline cursor-pointer"
            >
              {t.actions.backToRegister}
            </button>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-slate-950 text-sm">
              {record.id}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 font-medium">
              {record.fileReferenceNo}
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-semibold text-slate-900">
              {record.instrument.manufacturer} — {record.instrument.modelDesignation} (S/N:{' '}
              {record.instrument.serialNumber})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => ReportExportService.exportObservationsCsv(record)}
              className="gov-btn-secondary"
            >
              {t.actions.exportCsv}
            </button>
            <button
              type="button"
              onClick={() => ReportExportService.exportEvaluationJson(record)}
              className="gov-btn-secondary"
            >
              {t.actions.exportJson}
            </button>
            <button
              type="button"
              onClick={() => handleRecalculateAndSave(record)}
              className="gov-btn-primary"
            >
              {t.actions.saveRecord}
            </button>
          </div>
        </div>

        {/* Live Telemetry & Specification Summary Strip */}
        <div className="pt-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Class: <strong className="text-slate-950">{record.instrument.accuracyClass}</strong>
            </span>
            <span>·</span>
            <span>
              Max:{' '}
              <strong className="text-slate-950">
                {record.instrument.maxCapacity} {record.instrument.unit}
              </strong>
            </span>
            <span>·</span>
            <span>
              Min:{' '}
              <strong className="text-slate-950">
                {record.instrument.minCapacity} {record.instrument.unit}
              </strong>
            </span>
            <span>·</span>
            <span>
              e:{' '}
              <strong className="text-slate-950">
                {record.instrument.verificationScaleInterval} {record.instrument.unit}
              </strong>
            </span>
            <span>·</span>
            <span>
              n:{' '}
              <strong className="text-slate-950">
                {record.instrument.verificationIntervalsN.toLocaleString()}
              </strong>
            </span>
            <span>·</span>
            <span>
              Lab: <strong className="text-slate-950">{record.laboratory.laboratoryCode}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">{t.stages.fileStatusLabel}</span>
              <StatusIndicator status={record.status} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">{t.stages.ruleEngineLabel}</span>
              <StatusIndicator status={validation.overallDisposition} />
            </div>
          </div>
        </div>

        {/* 9-Stage Procedure Navigation Bar */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
          {stages.map((st) => {
            const isActive = st.idx === activeStageIndex;
            return (
              <button
                key={st.idx}
                type="button"
                onClick={() => onChangeStageIndex(st.idx)}
                className={`px-2.5 py-1.5 text-xs border transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#12355B] text-white border-[#0D2642] font-bold'
                    : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100 font-medium'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Content Viewport */}
      <div className="min-w-0">
        {activeStageIndex === 0 && (
          <InstrumentModule
            instrument={record.instrument}
            inspectionStage={record.laboratory.inspectionStage}
            onChange={(updatedInstrument) =>
              handleRecalculateAndSave({
                ...record,
                instrument: updatedInstrument,
              })
            }
            onRegenerateTestSchedule={handleRegenerateAllSchedules}
          />
        )}

        {activeStageIndex === 1 && (
          <LaboratoryModule
            laboratory={record.laboratory}
            onChange={(updatedLaboratory) =>
              handleRecalculateAndSave({
                ...record,
                laboratory: updatedLaboratory,
              })
            }
          />
        )}

        {activeStageIndex === 2 && (
          <EnvironmentalModule
            environment={record.environment}
            onChange={(updatedEnvironment) =>
              handleRecalculateAndSave({
                ...record,
                environment: updatedEnvironment,
              })
            }
          />
        )}

        {activeStageIndex === 3 && (
          <ErrorTestModule
            rows={record.errorObservations}
            e={record.instrument.verificationScaleInterval}
            unit={record.instrument.unit}
            accuracyClass={record.instrument.accuracyClass}
            maxCapacity={record.instrument.maxCapacity}
            onUpdateRows={(updatedRows) =>
              handleRecalculateAndSave({
                ...record,
                errorObservations: updatedRows,
              })
            }
            onResetStandardSchedule={handleRegenerateAllSchedules}
          />
        )}

        {activeStageIndex === 4 && (
          <RepeatabilityModule
            trials={record.repeatabilityTrials}
            e={record.instrument.verificationScaleInterval}
            unit={record.instrument.unit}
            accuracyClass={record.instrument.accuracyClass}
            inServiceMultiplier={inServiceMult}
            onUpdateTrials={(updatedTrials) =>
              handleRecalculateAndSave({
                ...record,
                repeatabilityTrials: updatedTrials,
              })
            }
          />
        )}

        {activeStageIndex === 5 && (
          <EccentricityModule
            rows={record.eccentricityObservations}
            e={record.instrument.verificationScaleInterval}
            unit={record.instrument.unit}
            maxCapacity={record.instrument.maxCapacity}
            geometry={record.instrument.loadReceptorGeometry}
            onUpdateRows={(updatedRows) =>
              handleRecalculateAndSave({
                ...record,
                eccentricityObservations: updatedRows,
              })
            }
          />
        )}

        {activeStageIndex === 6 && (
          <TemperatureModule
            rows={record.temperatureObservations}
            e={record.instrument.verificationScaleInterval}
            unit={record.instrument.unit}
            accuracyClass={record.instrument.accuracyClass}
            ratedTempMin={record.instrument.ratedTempMin}
            ratedTempMax={record.instrument.ratedTempMax}
            onUpdateRows={(updatedRows) =>
              handleRecalculateAndSave({
                ...record,
                temperatureObservations: updatedRows,
              })
            }
          />
        )}

        {activeStageIndex === 7 && (
          <ReviewModule
            record={record}
            onUpdateMeta={(updates) =>
              handleRecalculateAndSave({
                ...record,
                ...updates,
              })
            }
            onApproveAndIssueCertificate={handleApproveCertificate}
            onOpenReportTab={() => onChangeStageIndex(8)}
          />
        )}

        {activeStageIndex === 8 && <ReportCertificateModule record={record} />}
      </div>

      {/* Bottom Stage Stepper Controls */}
      <div className="gov-panel p-3 bg-white flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          type="button"
          disabled={activeStageIndex === 0}
          onClick={() => onChangeStageIndex(Math.max(0, activeStageIndex - 1))}
          className="gov-btn-secondary"
        >
          {t.actions.prevStage}
        </button>

        <div className="text-xs font-semibold text-slate-700">
          {t.stages.stageProgressPrefix} {activeStageIndex + 1} / {stages.length} ·{' '}
          {stages[activeStageIndex]?.label}
        </div>

        <button
          type="button"
          disabled={activeStageIndex === stages.length - 1}
          onClick={() =>
            onChangeStageIndex(Math.min(stages.length - 1, activeStageIndex + 1))
          }
          className="gov-btn-primary"
        >
          {t.actions.nextStage}
        </button>
      </div>
    </div>
  );
};
