import React from 'react';
import {
  AccuracyClass,
  MassUnit,
  TemperatureTestRow,
} from '../../../models';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { formatMassValue, formatSignedError } from '../../../utils/formatters';
import { useI18n } from '../../../i18n';

interface TemperatureModuleProps {
  rows: TemperatureTestRow[];
  e: number;
  unit: MassUnit;
  accuracyClass: AccuracyClass;
  ratedTempMin: number;
  ratedTempMax: number;
  onUpdateRows: (rows: TemperatureTestRow[]) => void;
}

export const TemperatureModule: React.FC<TemperatureModuleProps> = ({
  rows,
  e,
  unit,
  accuracyClass,
  ratedTempMin,
  ratedTempMax,
  onUpdateRows,
}) => {
  const { t } = useI18n();
  const stepIntervalC = accuracyClass === 'Class I' ? 1 : 5;

  const handleRowChange = (
    id: string,
    field: keyof TemperatureTestRow,
    value: number
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

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.temperatureModule.title}
        clauseRef={t.temperatureModule.clause}
        subtitle={`${t.temperatureModule.subtitlePrefix} ${ratedTempMin} °C — +${ratedTempMax} °C. ${t.temperatureModule.subtitleMid} ${stepIntervalC} °C.`}
      >
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t.temperatureModule.colSeq}</th>
                <th>{t.temperatureModule.colTemp}</th>
                <th>{t.temperatureModule.colSoak}</th>
                <th>
                  {t.temperatureModule.colZeroE0} ({unit})
                </th>
                <th>
                  {t.temperatureModule.colRefLoad} ({unit})
                </th>
                <th>
                  {t.temperatureModule.colIndicated} ({unit})
                </th>
                <th>
                  {t.temperatureModule.colDeltaL} ({unit})
                </th>
                <th>
                  {t.temperatureModule.colSpanEc} ({unit})
                </th>
                <th>
                  {t.temperatureModule.colSpanMpe} (±{unit})
                </th>
                <th>
                  {t.temperatureModule.colZeroDrift} (e / {stepIntervalC} °C)
                </th>
                <th>{t.temperatureModule.colSpanStatus}</th>
                <th>{t.temperatureModule.colDriftStatus}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <td className="font-semibold whitespace-nowrap">
                    {t.temperatureModule.stagePrefix} {idx + 1}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      className="gov-input py-1 min-w-[75px]"
                      value={row.chamberTempC}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'chamberTempC',
                          parseFloat(ev.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      className="gov-input py-1 min-w-[75px]"
                      value={row.soakDurationHours}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'soakDurationHours',
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
                      value={row.zeroIndicationE0}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'zeroIndicationE0',
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
                      value={row.referenceTestLoad}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'referenceTestLoad',
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
                      value={row.indicatedValueAtLoad}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'indicatedValueAtLoad',
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
                      value={row.deltaLoadAtLoad}
                      onChange={(ev) =>
                        handleRowChange(
                          row.id,
                          'deltaLoadAtLoad',
                          parseFloat(ev.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="bg-slate-50 font-semibold whitespace-nowrap">
                    {formatSignedError(row.correctedSpanErrorEc, e)}
                  </td>
                  <td className="bg-slate-50 whitespace-nowrap">
                    ±{formatMassValue(row.mpeAtLoad, e)}
                  </td>
                  <td className="bg-slate-50 font-semibold whitespace-nowrap">
                    {idx === 0
                      ? t.temperatureModule.refZeroText
                      : `${row.zeroDriftFromPrevE.toFixed(3)} e`}
                  </td>
                  <td>
                    <StatusIndicator status={row.spanStatus} />
                  </td>
                  <td>
                    <StatusIndicator status={row.zeroDriftStatus} />
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
