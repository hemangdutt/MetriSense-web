import React from 'react';
import { EvaluationRecord } from '../../../models';
import {
  evaluateRepeatabilityTrials,
  validateCompleteEvaluation,
} from '../../../rules';
import { ReportExportService } from '../../../services';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { AshokaChakraMark } from '../../../components/common/AshokaChakraMark';
import { formatMassValue, formatSignedError } from '../../../utils/formatters';
import { useI18n } from '../../../i18n';

interface ReportCertificateModuleProps {
  record: EvaluationRecord;
}

export const ReportCertificateModule: React.FC<ReportCertificateModuleProps> = ({
  record,
}) => {
  const { t } = useI18n();
  const validation = validateCompleteEvaluation(record);
  const { instrument, laboratory, environment } = record;
  const e = instrument.verificationScaleInterval;
  const unit = instrument.unit;
  const inServiceMult =
    laboratory.inspectionStage === 'In-Service Inspection' ? 2 : 1;
  const { summaries: repSummaries } = evaluateRepeatabilityTrials(
    record.repeatabilityTrials,
    e,
    instrument.accuracyClass,
    inServiceMult
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Action Toolbar (Hidden when printing) */}
      <div className="gov-panel p-3 flex flex-wrap items-center justify-between gap-3 bg-slate-100 no-print">
        <div className="text-xs text-slate-700 min-w-0">
          <span className="font-bold text-slate-950">
            {t.reportModule.toolbarTitle}
          </span>{' '}
          · {t.reportModule.toolbarSubtitle}
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
            onClick={handlePrint}
            className="gov-btn-primary"
          >
            {t.actions.printCertificate}
          </button>
        </div>
      </div>

      {/* Formal Printable Government Certificate Document */}
      <article className="gov-panel p-6 md:p-8 bg-white text-slate-950 space-y-6 min-w-0">
        {/* Formal Departmental Header with Ashoka Chakra */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="flex justify-center mb-1.5">
            <AshokaChakraMark size={34} className="text-[#12355B]" />
          </div>
          <div className="text-xs font-bold tracking-wider uppercase text-slate-800">
            {t.reportModule.govHeaderHi}
          </div>
          <div className="text-xs font-bold uppercase text-slate-900">
            {t.reportModule.ministryHeader}
          </div>
          <div className="text-base font-bold text-slate-950">
            {laboratory.laboratoryName.toUpperCase()}
          </div>
          <div className="text-xs text-slate-700">
            {laboratory.regionalDirectorate} · {t.reportModule.labCodePrefix}{' '}
            {laboratory.laboratoryCode}
          </div>
          <div className="pt-2">
            <span className="inline-block border border-slate-900 px-4 py-1 text-xs font-bold tracking-wider uppercase bg-slate-50">
              {t.reportModule.reportBannerTitle}
            </span>
          </div>
        </div>

        {/* Document Control Metadata Table */}
        <div className="gov-table-wrap">
          <table className="gov-table text-xs">
            <tbody>
              <tr>
                <th className="w-1/6">{t.reportModule.metaDossierId}</th>
                <td className="w-2/6 font-bold">{record.id}</td>
                <th className="w-1/6">{t.reportModule.metaFileNo}</th>
                <td className="w-2/6">{record.fileReferenceNo}</td>
              </tr>
              <tr>
                <th>{t.reportModule.metaCertNo}</th>
                <td className="font-bold">
                  {record.certificateNumber || t.reportModule.metaPendingIssuance}
                </td>
                <th>{t.reportModule.metaEvalDate}</th>
                <td>{laboratory.testDate}</td>
              </tr>
              <tr>
                <th>{t.reportModule.metaEvalStage}</th>
                <td>{laboratory.inspectionStage}</td>
                <th>{t.reportModule.metaOverallDet}</th>
                <td>
                  <StatusIndicator status={validation.overallDisposition} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 1: Instrument Under Test */}
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
            {t.reportModule.sec1Title}
          </h3>
          <div className="gov-table-wrap border-t-0">
            <table className="gov-table text-xs">
              <tbody>
                <tr>
                  <th className="w-1/4">{t.reportModule.sec1Manufacturer}</th>
                  <td className="w-1/4">
                    <div className="font-semibold">{instrument.manufacturer}</div>
                    <div className="text-[11px] text-slate-600">
                      {instrument.manufacturerAddress}
                    </div>
                  </td>
                  <th className="w-1/4">{t.reportModule.sec1Class}</th>
                  <td className="w-1/4 font-bold">{instrument.accuracyClass}</td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec1Model}</th>
                  <td className="font-semibold">{instrument.modelDesignation}</td>
                  <th>{t.reportModule.sec1Max}</th>
                  <td className="font-semibold">
                    {instrument.maxCapacity} {unit}
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec1Sn}</th>
                  <td>{instrument.serialNumber}</td>
                  <th>{t.reportModule.sec1Min}</th>
                  <td>
                    {instrument.minCapacity} {unit} (
                    {Math.round(instrument.minCapacity / e)} e)
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec1Category}</th>
                  <td>{instrument.instrumentType}</td>
                  <th>{t.reportModule.sec1IntervalE}</th>
                  <td className="font-semibold">
                    {e} {unit} (d = {instrument.actualScaleInterval} {unit})
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec1ApprovalRef}</th>
                  <td>{instrument.typeApprovalRef}</td>
                  <th>{t.reportModule.sec1IntervalsN}</th>
                  <td className="font-bold">
                    {instrument.verificationIntervalsN.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec1Software}</th>
                  <td>{instrument.softwareVersion}</td>
                  <th>{t.reportModule.sec1TempRange}</th>
                  <td>
                    {instrument.ratedTempMin} °C — +{instrument.ratedTempMax} °C
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Traceability & Environmental Conditions */}
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
            {t.reportModule.sec2Title}
          </h3>
          <div className="gov-table-wrap border-t-0">
            <table className="gov-table text-xs">
              <tbody>
                <tr>
                  <th className="w-1/4">{t.reportModule.sec2RefWeights}</th>
                  <td className="w-1/4">
                    {laboratory.referenceWeightSetId} ({laboratory.referenceWeightClass})
                  </td>
                  <th className="w-1/4">{t.reportModule.sec2AmbientTemp}</th>
                  <td className="w-1/4">
                    {environment.tempStartC.toFixed(1)} °C —{' '}
                    {environment.tempEndC.toFixed(1)} °C (ΔT ={' '}
                    {Math.abs(environment.tempEndC - environment.tempStartC).toFixed(1)} °C)
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec2CalCert}</th>
                  <td>
                    {laboratory.calibrationCertRef} ({laboratory.calibrationValidUntil})
                  </td>
                  <th>{t.reportModule.sec2RhPressure}</th>
                  <td>
                    {environment.humidityStartPct}%–{environment.humidityEndPct}% RH ·{' '}
                    {environment.pressureHpa} hPa
                  </td>
                </tr>
                <tr>
                  <th>{t.reportModule.sec2TestBay}</th>
                  <td>{laboratory.testBayLocation}</td>
                  <th>{t.reportModule.sec2MainsPower}</th>
                  <td>
                    {environment.mainsVoltageV} V / {environment.mainsFrequencyHz} Hz ·{' '}
                    {environment.warmupTimeMinutes} min
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Weighing Performance Table */}
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
            {t.reportModule.sec3Title}
          </h3>
          <div className="gov-table-wrap border-t-0">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th>{t.errorModule.colStep}</th>
                  <th>{t.errorModule.colStageDesc}</th>
                  <th>{t.errorModule.colDirection}</th>
                  <th>
                    {t.errorModule.colAppliedLoad} ({unit})
                  </th>
                  <th>
                    {t.errorModule.colIndicated} ({unit})
                  </th>
                  <th>ΔL ({unit})</th>
                  <th>
                    {t.errorModule.colCharP} ({unit})
                  </th>
                  <th>
                    {t.errorModule.colCorrectedEc} ({unit})
                  </th>
                  <th>MPE (±{unit})</th>
                  <th>{t.errorModule.colCompliance}</th>
                </tr>
              </thead>
              <tbody>
                {record.errorObservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.stepIndex}</td>
                    <td>{r.loadLabel}</td>
                    <td>{r.direction}</td>
                    <td>{formatMassValue(r.appliedLoad, e)}</td>
                    <td>{formatMassValue(r.indicatedValue, e)}</td>
                    <td>{formatMassValue(r.deltaLoad, e)}</td>
                    <td>{formatMassValue(r.characteristicValueP, e)}</td>
                    <td className="font-bold">
                      {formatSignedError(r.correctedErrorEc, e)}
                    </td>
                    <td>±{formatMassValue(r.mpeLimit, e)}</td>
                    <td>
                      <StatusIndicator status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Repeatability & Eccentricity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <div className="min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
              {t.reportModule.sec4ATitle}
            </h3>
            <div className="gov-table-wrap border-t-0">
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th>Series</th>
                    <th>|Emax−Emin|</th>
                    <th>s</th>
                    <th>|MPE|</th>
                    <th>{t.errorModule.colCompliance}</th>
                  </tr>
                </thead>
                <tbody>
                  {repSummaries.map((s) => (
                    <tr key={s.seriesLabel}>
                      <td>{s.seriesLabel}</td>
                      <td className="font-bold">
                        {formatMassValue(s.spreadPMaxMinusPMin, e)} {unit}
                      </td>
                      <td>
                        {formatMassValue(s.standardDeviation, e)} {unit}
                      </td>
                      <td>
                        {formatMassValue(s.mpeAbsolute, e)} {unit}
                      </td>
                      <td>
                        <StatusIndicator status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
              {t.reportModule.sec4BTitle}
            </h3>
            <div className="gov-table-wrap border-t-0">
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th>{t.eccentricityModule.colPos}</th>
                    <th>Load ({unit})</th>
                    <th>{t.eccentricityModule.colCorrectedEc}</th>
                    <th>MPE (±{unit})</th>
                    <th>{t.eccentricityModule.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {record.eccentricityObservations.map((ec) => (
                    <tr key={ec.id}>
                      <td>Pos {ec.positionNumber}</td>
                      <td>{formatMassValue(ec.appliedLoad, e)}</td>
                      <td className="font-bold">
                        {formatSignedError(ec.correctedErrorEc, e)}
                      </td>
                      <td>±{formatMassValue(ec.mpeLimit, e)}</td>
                      <td>
                        <StatusIndicator status={ec.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 5: Clause Compliance Summary & Remarks */}
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-400 px-3 py-1.5">
            {t.reportModule.sec5Title}
          </h3>
          <div className="border border-t-0 border-slate-400 p-3 text-xs space-y-2">
            <div>
              <span className="font-bold">{t.reportModule.sec5OfficerRemarks} </span>
              <span>{record.officerRemarks || '—'}</span>
            </div>
            {record.reviewerRemarks && (
              <div>
                <span className="font-bold">
                  {t.reportModule.sec5ReviewerRemarks}{' '}
                </span>
                <span>{record.reviewerRemarks}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Official Signatures */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 text-xs">
          <div className="border-t border-slate-900 pt-2">
            <div className="font-bold text-slate-950">
              {laboratory.testingOfficerName}
            </div>
            <div className="text-slate-700">
              {laboratory.testingOfficerDesignation} (ID: {laboratory.testingOfficerId})
            </div>
            <div className="text-slate-600 mt-1">
              {t.reportModule.sigTestingOfficerSub} · {laboratory.laboratoryCode}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-2 sm:text-right">
            <div className="font-bold text-slate-950">
              {laboratory.supervisingOfficerName}
            </div>
            <div className="text-slate-700">
              {t.reportModule.sigControllingAuth}
            </div>
            <div className="text-slate-600 mt-1">
              {t.reportModule.sigDeptFooter}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
