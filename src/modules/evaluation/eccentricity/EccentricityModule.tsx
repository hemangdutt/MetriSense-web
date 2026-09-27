import React from 'react';
import {
  EccentricityPositionRow,
  LoadReceptorGeometry,
  MassUnit,
} from '../../../models';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { formatMassValue, formatSignedError } from '../../../utils/formatters';
import { useI18n } from '../../../i18n';

interface EccentricityModuleProps {
  rows: EccentricityPositionRow[];
  e: number;
  unit: MassUnit;
  maxCapacity: number;
  geometry: LoadReceptorGeometry;
  onUpdateRows: (rows: EccentricityPositionRow[]) => void;
}

export const EccentricityModule: React.FC<EccentricityModuleProps> = ({
  rows,
  e,
  unit,
  maxCapacity,
  geometry,
  onUpdateRows,
}) => {
  const { t } = useI18n();

  const handleRowChange = (
    id: string,
    field: keyof EccentricityPositionRow,
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

  const applyUniformLoad = (newLoad: number) => {
    const updated = rows.map((r) => ({
      ...r,
      appliedLoad: newLoad,
    }));
    onUpdateRows(updated);
  };

  const failCount = rows.filter((r) => r.status === 'FAIL').length;

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.eccentricityModule.title}
        clauseRef={t.eccentricityModule.clause}
        subtitle={`${t.eccentricityModule.subtitlePrefix} (${Number(
          (maxCapacity / 3).toFixed(3)
        )} ${unit}) ${t.eccentricityModule.subtitleMid} (${geometry}).`}
        rightActions={
          <button
            type="button"
            onClick={() =>
              applyUniformLoad(
                e > 0
                  ? Number((Math.round(maxCapacity / 3 / e) * e).toFixed(4))
                  : Number((maxCapacity / 3).toFixed(4))
              )
            }
            className="gov-btn-secondary"
          >
            {t.eccentricityModule.setThirdMaxBtn}
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 min-w-0">
          {/* Technical Load Receptor Quadrant Schematic (SVG) */}
          <div className="border border-slate-300 bg-slate-50 p-3 flex flex-col justify-between min-w-0">
            <div className="text-xs font-semibold text-slate-800 mb-2">
              {t.eccentricityModule.schematicTitle}
            </div>
            <svg
              viewBox="0 0 220 140"
              className="w-full h-32 border border-slate-400 bg-white"
              aria-label="OIML R 76 5-Point Load Receptor Schematic"
            >
              <line
                x1="110"
                y1="0"
                x2="110"
                y2="140"
                stroke="#94A3B8"
                strokeDasharray="3,3"
              />
              <line
                x1="0"
                y1="70"
                x2="220"
                y2="70"
                stroke="#94A3B8"
                strokeDasharray="3,3"
              />
              {/* 3: Back-Left */}
              <rect
                x="18"
                y="12"
                width="38"
                height="24"
                fill="#F1F5F9"
                stroke="#334155"
              />
              <text
                x="37"
                y="28"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-900"
              >
                Pos 3
              </text>
              {/* 4: Back-Right */}
              <rect
                x="164"
                y="12"
                width="38"
                height="24"
                fill="#F1F5F9"
                stroke="#334155"
              />
              <text
                x="183"
                y="28"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-900"
              >
                Pos 4
              </text>
              {/* 1: Centre */}
              <rect
                x="91"
                y="58"
                width="38"
                height="24"
                fill="#DBEAFE"
                stroke="#12355B"
              />
              <text
                x="110"
                y="74"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-950"
              >
                Pos 1
              </text>
              {/* 2: Front-Left */}
              <rect
                x="18"
                y="104"
                width="38"
                height="24"
                fill="#F1F5F9"
                stroke="#334155"
              />
              <text
                x="37"
                y="120"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-900"
              >
                Pos 2
              </text>
              {/* 5: Front-Right */}
              <rect
                x="164"
                y="104"
                width="38"
                height="24"
                fill="#F1F5F9"
                stroke="#334155"
              />
              <text
                x="183"
                y="120"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-900"
              >
                Pos 5
              </text>
            </svg>
            <div className="text-[11px] text-slate-600 mt-2">
              {t.eccentricityModule.schematicLegend}
            </div>
          </div>

          <div className="lg:col-span-3 gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t.eccentricityModule.colPos}</th>
                  <th>{t.eccentricityModule.colQuadrant}</th>
                  <th>
                    {t.eccentricityModule.colAppliedLoad} ({unit})
                  </th>
                  <th>
                    {t.eccentricityModule.colIndicated} ({unit})
                  </th>
                  <th>
                    {t.eccentricityModule.colDeltaL} ({unit})
                  </th>
                  <th>
                    {t.eccentricityModule.colCharP} ({unit})
                  </th>
                  <th>
                    {t.eccentricityModule.colCorrectedEc} ({unit})
                  </th>
                  <th>
                    {t.eccentricityModule.colMpe} (±{unit})
                  </th>
                  <th>{t.eccentricityModule.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isFail = row.status === 'FAIL';
                  return (
                    <tr
                      key={row.id}
                      className={isFail ? 'bg-red-50/70' : undefined}
                    >
                      <td className="font-bold whitespace-nowrap">
                        Pos {row.positionNumber}
                      </td>
                      <td className="text-xs">{row.positionName}</td>
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
                      <td className="bg-slate-50 whitespace-nowrap">
                        {formatMassValue(row.characteristicValueP, e)}
                      </td>
                      <td
                        className={`bg-slate-50 font-bold whitespace-nowrap ${
                          isFail ? 'text-red-800' : 'text-slate-950'
                        }`}
                      >
                        {formatSignedError(row.correctedErrorEc, e)}
                      </td>
                      <td className="bg-slate-50 whitespace-nowrap">
                        ±{formatMassValue(row.mpeLimit, e)}
                      </td>
                      <td>
                        <StatusIndicator status={row.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="text-slate-800">
            {t.eccentricityModule.maxCornerDevLabel}{' '}
            <span className="font-bold text-slate-950">
              {rows.length > 0
                ? formatMassValue(
                    Math.max(...rows.map((r) => Math.abs(r.correctedErrorEc))),
                    e
                  )
                : '0.000'}{' '}
              {unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {t.eccentricityModule.clauseDeterminationLabel}
            </span>
            <StatusIndicator
              status={failCount === 0 ? 'COMPLIANT' : 'NON-COMPLIANT'}
            />
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};
