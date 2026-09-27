import React from 'react';
import {
  AccuracyClass,
  MassUnit,
  RepeatabilityTrialRow,
} from '../../../models';
import { evaluateRepeatabilityTrials } from '../../../rules';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { formatMassValue, formatSignedError } from '../../../utils/formatters';
import { useI18n } from '../../../i18n';

interface RepeatabilityModuleProps {
  trials: RepeatabilityTrialRow[];
  e: number;
  unit: MassUnit;
  accuracyClass: AccuracyClass;
  inServiceMultiplier: number;
  onUpdateTrials: (trials: RepeatabilityTrialRow[]) => void;
}

export const RepeatabilityModule: React.FC<RepeatabilityModuleProps> = ({
  trials,
  e,
  unit,
  accuracyClass,
  inServiceMultiplier,
  onUpdateTrials,
}) => {
  const { t } = useI18n();
  const { summaries } = evaluateRepeatabilityTrials(
    trials,
    e,
    accuracyClass,
    inServiceMultiplier
  );

  const handleTrialChange = (
    id: string,
    field: keyof RepeatabilityTrialRow,
    value: number
  ) => {
    const updated = trials.map((tr) => {
      if (tr.id !== id) return tr;
      return {
        ...tr,
        [field]: value,
      };
    });
    onUpdateTrials(updated);
  };

  return (
    <div className="space-y-4 min-w-0">
      {summaries.map((series) => (
        <SectionPanel
          key={series.seriesLabel}
          title={`${t.repeatabilityModule.titlePrefix} ${series.seriesLabel}`}
          clauseRef={t.repeatabilityModule.clause}
          subtitle={`${t.repeatabilityModule.subtitlePrefix} ${series.appliedLoad} ${unit}.`}
        >
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t.repeatabilityModule.colTrial}</th>
                  <th>
                    {t.repeatabilityModule.colTestLoad} ({unit})
                  </th>
                  <th>
                    {t.repeatabilityModule.colZeroI0} ({unit})
                  </th>
                  <th>
                    {t.repeatabilityModule.colLoadedI} ({unit})
                  </th>
                  <th>
                    {t.repeatabilityModule.colDeltaL} ({unit})
                  </th>
                  <th>
                    {t.repeatabilityModule.colCharP} ({unit})
                  </th>
                  <th>
                    {t.repeatabilityModule.colErrorE} ({unit})
                  </th>
                </tr>
              </thead>
              <tbody>
                {series.trials.map((tr) => (
                  <tr key={tr.id}>
                    <td className="font-semibold whitespace-nowrap">
                      {t.repeatabilityModule.runPrefix} {tr.trialNumber}
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="gov-input py-1 min-w-[90px]"
                        value={tr.appliedLoad}
                        onChange={(ev) =>
                          handleTrialChange(
                            tr.id,
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
                        value={tr.zeroIndicationI0}
                        onChange={(ev) =>
                          handleTrialChange(
                            tr.id,
                            'zeroIndicationI0',
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
                        value={tr.loadIndicationI}
                        onChange={(ev) =>
                          handleTrialChange(
                            tr.id,
                            'loadIndicationI',
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
                        value={tr.deltaLoad}
                        onChange={(ev) =>
                          handleTrialChange(
                            tr.id,
                            'deltaLoad',
                            parseFloat(ev.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td className="bg-slate-50 whitespace-nowrap">
                      {formatMassValue(tr.characteristicValueP, e)}
                    </td>
                    <td className="bg-slate-50 font-semibold whitespace-nowrap">
                      {formatSignedError(tr.errorE, e)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
            <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
              <div className="text-xs font-semibold text-slate-700">
                {t.repeatabilityModule.spreadLabel}
              </div>
              <div className="mt-1 text-base font-bold text-slate-950">
                {formatMassValue(series.spreadPMaxMinusPMin, e)} {unit}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
              <div className="text-xs font-semibold text-slate-700">
                {t.repeatabilityModule.stdDevLabel}
              </div>
              <div className="mt-1 text-base font-bold text-slate-950">
                {formatMassValue(series.standardDeviation, e)} {unit}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
              <div className="text-xs font-semibold text-slate-700">
                {t.repeatabilityModule.mpeLimitLabel}
              </div>
              <div className="mt-1 text-base font-bold text-[#12355B]">
                {formatMassValue(series.mpeAbsolute, e)} {unit}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-3 flex flex-col justify-between min-w-0">
              <div className="text-xs font-semibold text-slate-700">
                {t.repeatabilityModule.seriesComplianceLabel}
              </div>
              <div className="mt-1">
                <StatusIndicator status={series.status} />
              </div>
            </div>
          </div>
        </SectionPanel>
      ))}
    </div>
  );
};
