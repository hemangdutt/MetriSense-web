import React from 'react';
import {
  AccuracyClass,
  ErrorObservationRow,
  LoadDirection,
  MassUnit,
} from '../../../models';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { formatMassValue, formatSignedError } from '../../../utils/formatters';
import { useI18n } from '../../../i18n';

interface ErrorTestModuleProps {
  rows: ErrorObservationRow[];
  e: number;
  unit: MassUnit;
  accuracyClass: AccuracyClass;
  maxCapacity: number;
  onUpdateRows: (rows: ErrorObservationRow[]) => void;
  onResetStandardSchedule: () => void;
}

export const ErrorTestModule: React.FC<ErrorTestModuleProps> = ({
  rows,
  e,
  unit,
  accuracyClass,
  maxCapacity,
  onUpdateRows,
  onResetStandardSchedule,
}) => {
  const { t } = useI18n();

  const handleRowChange = (
    id: string,
    field: keyof ErrorObservationRow,
    value: string | number
  ) => {
    const updated = rows.map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        [field]: value,
      };
    });
    onUpdateRows(updated);
  };

  const handleAddRow = (direction: LoadDirection) => {
    const newRow: ErrorObservationRow = {
      id: `err-custom-${Date.now()}`,
      stepIndex: rows.length + 1,
      loadLabel: `Custom Load Stage`,
      direction,
      appliedLoad: Number((maxCapacity * 0.25).toFixed(4)),
      indicatedValue: Number((maxCapacity * 0.25).toFixed(4)),
      deltaLoad: Number((0.5 * e).toFixed(6)),
      characteristicValueP: 0,
      uncorrectedErrorE: 0,
      correctedErrorEc: 0,
      mpeLimit: 0,
      status: 'PASS',
    };
    onUpdateRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    onUpdateRows(rows.filter((r) => r.id !== id));
  };

  const passCount = rows.filter((r) => r.status === 'PASS').length;
  const failCount = rows.filter((r) => r.status === 'FAIL').length;

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.errorModule.title}
        clauseRef={t.errorModule.clause}
        subtitle={`${t.errorModule.subtitlePrefix} (e = ${e} ${unit}, ${accuracyClass}).`}
        rightActions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddRow('INCREASING')}
              className="gov-btn-secondary"
            >
              {t.errorModule.addIncreasingBtn}
            </button>
            <button
              type="button"
              onClick={() => handleAddRow('DECREASING')}
              className="gov-btn-secondary"
            >
              {t.errorModule.addDecreasingBtn}
            </button>
            <button
              type="button"
              onClick={onResetStandardSchedule}
              className="gov-btn-secondary"
            >
              {t.actions.resetStandardLoads}
            </button>
          </div>
        }
      >
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-10">{t.errorModule.colStep}</th>
                <th>{t.errorModule.colStageDesc}</th>
                <th>{t.errorModule.colDirection}</th>
                <th>
                  {t.errorModule.colAppliedLoad} ({unit})
                </th>
                <th>
                  {t.errorModule.colIndicated} ({unit})
                </th>
                <th>
                  {t.errorModule.colDeltaL} ({unit})
                </th>
                <th>
                  {t.errorModule.colCharP} ({unit})
                </th>
                <th>
                  {t.errorModule.colErrorE} ({unit})
                </th>
                <th>
                  {t.errorModule.colCorrectedEc} ({unit})
                </th>
                <th>
                  {t.errorModule.colMpe} (±{unit})
                </th>
                <th>{t.errorModule.colCompliance}</th>
                <th className="no-print">{t.errorModule.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isFail = row.status === 'FAIL';
                return (
                  <tr
                    key={row.id}
                    className={isFail ? 'bg-red-50/70' : undefined}
                  >
                    <td className="text-slate-600 font-semibold">{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="gov-input text-xs py-1 min-w-[130px]"
                        value={row.loadLabel}
                        onChange={(ev) =>
                          handleRowChange(row.id, 'loadLabel', ev.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="gov-input text-xs py-1 min-w-[135px]"
                        value={row.direction}
                        onChange={(ev) =>
                          handleRowChange(
                            row.id,
                            'direction',
                            ev.target.value as LoadDirection
                          )
                        }
                      >
                        <option value="INCREASING">
                          {t.errorModule.dirIncreasing}
                        </option>
                        <option value="DECREASING">
                          {t.errorModule.dirDecreasing}
                        </option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="gov-input py-1 min-w-[90px]"
                        value={row.appliedLoad}
                        onChange={(ev) =>
                          handleRowChange(
                            row.id,
                            'appliedLoad',
                            parseFloat(ev.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="gov-input py-1 min-w-[90px]"
                        value={row.indicatedValue}
                        onChange={(ev) =>
                          handleRowChange(
                            row.id,
                            'indicatedValue',
                            parseFloat(ev.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="gov-input py-1 min-w-[85px]"
                        value={row.deltaLoad}
                        onChange={(ev) =>
                          handleRowChange(
                            row.id,
                            'deltaLoad',
                            parseFloat(ev.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td className="bg-slate-50 text-slate-800 whitespace-nowrap">
                      {formatMassValue(row.characteristicValueP, e)}
                    </td>
                    <td className="bg-slate-50 text-slate-800 whitespace-nowrap">
                      {formatSignedError(row.uncorrectedErrorE, e)}
                    </td>
                    <td
                      className={`bg-slate-50 font-bold whitespace-nowrap ${
                        isFail ? 'text-red-800' : 'text-slate-950'
                      }`}
                    >
                      {formatSignedError(row.correctedErrorEc, e)}
                    </td>
                    <td className="bg-slate-50 text-slate-800 whitespace-nowrap">
                      ±{formatMassValue(row.mpeLimit, e)}
                    </td>
                    <td>
                      <StatusIndicator status={row.status} />
                    </td>
                    <td className="no-print">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                      >
                        {t.actions.removeRow}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Technical Error Curve Envelope Summary */}
        <div className="mt-4 pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.errorModule.totalStagesLabel}
            </div>
            <div className="mt-1 text-base font-bold text-slate-950">
              {rows.length} {t.errorModule.stagesWord} ({passCount} PASS / {failCount} FAIL)
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.errorModule.initialZeroErrorLabel}
            </div>
            <div className="mt-1 text-base font-bold text-slate-950">
              {rows.length > 0
                ? `${formatSignedError(rows[0].uncorrectedErrorE, e)} ${unit}`
                : '0.000'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.errorModule.maxAbsErrorLabel}
            </div>
            <div className="mt-1 text-base font-bold text-slate-950">
              {rows.length > 0
                ? `${formatMassValue(
                    Math.max(...rows.map((r) => Math.abs(r.correctedErrorEc))),
                    e
                  )} ${unit}`
                : '0.000'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 flex flex-col justify-between min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.errorModule.clauseDeterminationLabel}
            </div>
            <div className="mt-1">
              <StatusIndicator status={failCount === 0 ? 'COMPLIANT' : 'NON-COMPLIANT'} />
            </div>
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};
