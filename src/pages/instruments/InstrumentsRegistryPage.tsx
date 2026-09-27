import React, { useState } from 'react';
import { AccuracyClass, EvaluationRecord } from '../../models';
import {
  calculateLoadInE,
  calculateMpeFactorInE,
  calculateMpeValue,
  calculateVerificationIntervals,
} from '../../calculations';
import { SectionPanel } from '../../components/common/SectionPanel';
import { FieldGroup } from '../../components/forms/FieldGroup';
import { useI18n } from '../../i18n';

interface InstrumentsRegistryPageProps {
  evaluations: EvaluationRecord[];
  onOpenEvaluation: (id: string) => void;
}

export const InstrumentsRegistryPage: React.FC<InstrumentsRegistryPageProps> = ({
  evaluations,
  onOpenEvaluation,
}) => {
  const { t } = useI18n();
  const [calcClass, setCalcClass] = useState<AccuracyClass>('Class III');
  const [calcMax, setCalcMax] = useState<number>(30);
  const [calcE, setCalcE] = useState<number>(0.01);
  const [calcLoad, setCalcLoad] = useState<number>(15);
  const [calcUnit, setCalcUnit] = useState<'kg' | 'g'>('kg');

  const nIntervals = calculateVerificationIntervals(calcMax, calcE);
  const loadInE = calculateLoadInE(calcLoad, calcE);
  const mpeFactorInit = calculateMpeFactorInE(calcLoad, calcE, calcClass, 1);
  const mpeValInit = calculateMpeValue(calcLoad, calcE, calcClass, 1);
  const mpeValInService = calculateMpeValue(calcLoad, calcE, calcClass, 2);

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.referencePage.calcTitle}
        clauseRef={t.referencePage.calcClause}
        subtitle={t.referencePage.calcSubtitle}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-0">
          <FieldGroup label={t.referencePage.classLabel}>
            <select
              className="gov-input font-semibold"
              value={calcClass}
              onChange={(e) => setCalcClass(e.target.value as AccuracyClass)}
            >
              <option value="Class I">Class I (Special)</option>
              <option value="Class II">Class II (High)</option>
              <option value="Class III">Class III (Medium)</option>
              <option value="Class IIII">Class IIII (Ordinary)</option>
            </select>
          </FieldGroup>

          <FieldGroup label={t.referencePage.unitLabel}>
            <select
              className="gov-input"
              value={calcUnit}
              onChange={(e) => setCalcUnit(e.target.value as 'kg' | 'g')}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          </FieldGroup>

          <FieldGroup label={t.referencePage.maxLabel} unit={calcUnit}>
            <input
              type="number"
              step="any"
              className="gov-input"
              value={calcMax}
              onChange={(e) => setCalcMax(parseFloat(e.target.value) || 0)}
            />
          </FieldGroup>

          <FieldGroup label={t.referencePage.eLabel} unit={calcUnit}>
            <input
              type="number"
              step="any"
              className="gov-input"
              value={calcE}
              onChange={(e) => setCalcE(parseFloat(e.target.value) || 0)}
            />
          </FieldGroup>

          <FieldGroup label={t.referencePage.loadLabel} unit={calcUnit}>
            <input
              type="number"
              step="any"
              className="gov-input"
              value={calcLoad}
              onChange={(e) => setCalcLoad(parseFloat(e.target.value) || 0)}
            />
          </FieldGroup>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.referencePage.resNLabel}
            </div>
            <div className="text-lg font-bold text-slate-950 mt-1">
              {nIntervals.toLocaleString()} e
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.referencePage.resMLabel}
            </div>
            <div className="text-lg font-bold text-slate-950 mt-1">
              {loadInE.toLocaleString()} e
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.referencePage.resInitMpeLabel}
            </div>
            <div className="text-lg font-bold text-[#12355B] mt-1">
              ± {mpeValInit} {calcUnit} (±{mpeFactorInit} e)
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.referencePage.resInServiceMpeLabel}
            </div>
            <div className="text-lg font-bold text-slate-950 mt-1">
              ± {mpeValInService} {calcUnit} (±{mpeFactorInit * 2} e)
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.referencePage.scheduleTitle}
        clauseRef={t.referencePage.scheduleClause}
      >
        <div className="gov-table-wrap">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>{t.referencePage.colClass}</th>
                <th>{t.referencePage.colE}</th>
                <th>{t.referencePage.colNMin}</th>
                <th>{t.referencePage.colNMax}</th>
                <th>{t.referencePage.colMinCap}</th>
                <th>{t.referencePage.colMpe05}</th>
                <th>{t.referencePage.colMpe10}</th>
                <th>{t.referencePage.colMpe15}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Class I (Special)</td>
                <td>0.001 g ≤ e</td>
                <td>50,000</td>
                <td>Unlimited</td>
                <td>100 e</td>
                <td>0 ≤ m ≤ 50,000 e</td>
                <td>50,000 &lt; m ≤ 200,000 e</td>
                <td>200,000 e &lt; m</td>
              </tr>
              <tr>
                <td className="font-bold">Class II (High)</td>
                <td>0.001 g ≤ e ≤ 0.05 g / 0.1 g ≤ e</td>
                <td>100 / 5,000</td>
                <td>100,000</td>
                <td>20 e / 50 e</td>
                <td>0 ≤ m ≤ 5,000 e</td>
                <td>5,000 &lt; m ≤ 20,000 e</td>
                <td>20,000 &lt; m ≤ 100,000 e</td>
              </tr>
              <tr>
                <td className="font-bold">Class III (Medium)</td>
                <td>0.1 g ≤ e ≤ 2 g / 5 g ≤ e</td>
                <td>100 / 500</td>
                <td>10,000</td>
                <td>20 e</td>
                <td>0 ≤ m ≤ 500 e</td>
                <td>500 &lt; m ≤ 2,000 e</td>
                <td>2,000 &lt; m ≤ 10,000 e</td>
              </tr>
              <tr>
                <td className="font-bold">Class IIII (Ordinary)</td>
                <td>5 g ≤ e</td>
                <td>100</td>
                <td>1,000</td>
                <td>10 e</td>
                <td>0 ≤ m ≤ 50 e</td>
                <td>50 &lt; m ≤ 200 e</td>
                <td>200 &lt; m ≤ 1,000 e</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.referencePage.patternsTitle}
        subtitle={t.referencePage.patternsSubtitle}
      >
        <div className="gov-table-wrap">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>{t.referencePage.colApprovalRef}</th>
                <th>{t.referencePage.colManufacturer}</th>
                <th>{t.referencePage.colModel}</th>
                <th>{t.referencePage.colCategory}</th>
                <th>{t.referencePage.colClass}</th>
                <th>{t.referencePage.colMaxCap}</th>
                <th>{t.referencePage.colIntervalE}</th>
                <th>{t.referencePage.colIntervalsN}</th>
                <th>{t.referencePage.colDossierLink}</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-semibold text-slate-900">
                    {rec.instrument.typeApprovalRef}
                  </td>
                  <td>{rec.instrument.manufacturer}</td>
                  <td className="font-bold">{rec.instrument.modelDesignation}</td>
                  <td>{rec.instrument.instrumentType}</td>
                  <td>{rec.instrument.accuracyClass}</td>
                  <td>
                    {rec.instrument.maxCapacity} {rec.instrument.unit}
                  </td>
                  <td>
                    {rec.instrument.verificationScaleInterval}{' '}
                    {rec.instrument.unit}
                  </td>
                  <td>
                    {rec.instrument.verificationIntervalsN.toLocaleString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onOpenEvaluation(rec.id)}
                      className="text-[#12355B] font-bold hover:underline cursor-pointer"
                    >
                      {t.actions.openRecord} {rec.id}
                    </button>
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
