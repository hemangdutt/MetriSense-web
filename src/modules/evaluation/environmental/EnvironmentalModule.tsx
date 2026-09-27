import React from 'react';
import { EnvironmentalConditionsModel } from '../../../models';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { FieldGroup } from '../../../components/forms/FieldGroup';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { useI18n } from '../../../i18n';

interface EnvironmentalModuleProps {
  environment: EnvironmentalConditionsModel;
  onChange: (updated: EnvironmentalConditionsModel) => void;
}

export const EnvironmentalModule: React.FC<EnvironmentalModuleProps> = ({
  environment,
  onChange,
}) => {
  const { t } = useI18n();

  const handleField = <K extends keyof EnvironmentalConditionsModel>(
    key: K,
    value: EnvironmentalConditionsModel[K]
  ) => {
    onChange({
      ...environment,
      [key]: value,
    });
  };

  const tempDiff = Math.abs(environment.tempEndC - environment.tempStartC);
  const humidityMean = (
    (environment.humidityStartPct + environment.humidityEndPct) /
    2
  ).toFixed(1);
  const isTempStable = tempDiff <= 2.0;
  const isPreCheckComplete =
    environment.vibrationIsolationVerified &&
    environment.levelIndicatorVerified &&
    environment.warmupTimeMinutes >= 15;

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.environmentalModule.partATitle}
        clauseRef={t.environmentalModule.partAClause}
        subtitle={t.environmentalModule.partASubtitle}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <FieldGroup label={t.environmentalModule.tempStartLabel} unit="°C" required>
            <input
              type="number"
              step="0.1"
              className="gov-input"
              value={environment.tempStartC}
              onChange={(e) =>
                handleField('tempStartC', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.environmentalModule.tempEndLabel} unit="°C" required>
            <input
              type="number"
              step="0.1"
              className="gov-input"
              value={environment.tempEndC}
              onChange={(e) =>
                handleField('tempEndC', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.environmentalModule.rhStartLabel} unit="%" required>
            <input
              type="number"
              step="0.5"
              className="gov-input"
              value={environment.humidityStartPct}
              onChange={(e) =>
                handleField('humidityStartPct', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.environmentalModule.rhEndLabel} unit="%" required>
            <input
              type="number"
              step="0.5"
              className="gov-input"
              value={environment.humidityEndPct}
              onChange={(e) =>
                handleField('humidityEndPct', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup label={t.environmentalModule.pressureLabel} unit="hPa" required>
            <input
              type="number"
              step="0.1"
              className="gov-input"
              value={environment.pressureHpa}
              onChange={(e) =>
                handleField('pressureHpa', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.environmentalModule.voltageLabel}
            unit="V"
            hint={t.environmentalModule.voltageHint}
          >
            <input
              type="number"
              step="0.1"
              className="gov-input"
              value={environment.mainsVoltageV}
              onChange={(e) =>
                handleField('mainsVoltageV', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.environmentalModule.freqLabel}
            unit="Hz"
            hint={t.environmentalModule.freqHint}
          >
            <input
              type="number"
              step="0.1"
              className="gov-input"
              value={environment.mainsFrequencyHz}
              onChange={(e) =>
                handleField('mainsFrequencyHz', parseFloat(e.target.value) || 0)
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t.environmentalModule.soakLabel}
            unit="h"
            hint={t.environmentalModule.soakHint}
          >
            <input
              type="number"
              step="0.5"
              className="gov-input"
              value={environment.thermalStabilizationHours}
              onChange={(e) =>
                handleField(
                  'thermalStabilizationHours',
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </FieldGroup>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.environmentalModule.excursionTitle}
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-lg font-bold text-slate-950">
                {tempDiff.toFixed(2)} °C
              </span>
              <StatusIndicator status={isTempStable ? 'PASS' : 'FAIL'} />
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {t.environmentalModule.excursionHint}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.environmentalModule.meanRhTitle}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-slate-950">
                {humidityMean} % RH
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {environment.pressureHpa.toFixed(1)} hPa
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {t.environmentalModule.meanRhHint}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.environmentalModule.preCheckTitle}
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">
                {t.environmentalModule.warmupPrefix} {environment.warmupTimeMinutes} min
              </span>
              <StatusIndicator status={isPreCheckComplete ? 'PASS' : 'PENDING'} />
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {t.environmentalModule.preCheckHint}
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.environmentalModule.partBTitle}
        clauseRef={t.environmentalModule.partBClause}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center min-w-0">
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 border border-slate-300 bg-slate-50">
            <input
              type="checkbox"
              checked={environment.levelIndicatorVerified}
              onChange={(e) =>
                handleField('levelIndicatorVerified', e.target.checked)
              }
              className="h-4 w-4 accent-[#12355B] shrink-0"
            />
            <span>{t.environmentalModule.levelCheckLabel}</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 border border-slate-300 bg-slate-50">
            <input
              type="checkbox"
              checked={environment.vibrationIsolationVerified}
              onChange={(e) =>
                handleField('vibrationIsolationVerified', e.target.checked)
              }
              className="h-4 w-4 accent-[#12355B] shrink-0"
            />
            <span>{t.environmentalModule.vibrationCheckLabel}</span>
          </label>

          <FieldGroup label={t.environmentalModule.warmupInputLabel} unit="min">
            <input
              type="number"
              className="gov-input"
              value={environment.warmupTimeMinutes}
              onChange={(e) =>
                handleField('warmupTimeMinutes', parseInt(e.target.value, 10) || 0)
              }
            />
          </FieldGroup>
        </div>

        <div className="mt-4">
          <FieldGroup label={t.environmentalModule.remarksLabel}>
            <textarea
              rows={2}
              className="gov-input"
              value={environment.environmentalRemarks}
              onChange={(e) =>
                handleField('environmentalRemarks', e.target.value)
              }
            />
          </FieldGroup>
        </div>
      </SectionPanel>
    </div>
  );
};
