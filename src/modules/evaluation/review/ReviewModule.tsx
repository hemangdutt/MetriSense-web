import React from 'react';
import { EvaluationRecord, EvaluationStatus } from '../../../models';
import { validateCompleteEvaluation } from '../../../rules';
import { SectionPanel } from '../../../components/common/SectionPanel';
import { FieldGroup } from '../../../components/forms/FieldGroup';
import { StatusIndicator } from '../../../components/feedback/StatusIndicator';
import { useI18n } from '../../../i18n';

interface ReviewModuleProps {
  record: EvaluationRecord;
  onUpdateMeta: (
    updates: Partial<
      Pick<
        EvaluationRecord,
        | 'status'
        | 'officerRemarks'
        | 'reviewerRemarks'
        | 'certificateNumber'
        | 'certificateIssuedDate'
      >
    >
  ) => void;
  onApproveAndIssueCertificate: () => void;
  onOpenReportTab: () => void;
}

const STATUS_OPTIONS: EvaluationStatus[] = [
  'DRAFT',
  'IN PROGRESS',
  'UNDER REVIEW',
  'APPROVED',
  'REJECTED',
  'ARCHIVED',
];

export const ReviewModule: React.FC<ReviewModuleProps> = ({
  record,
  onUpdateMeta,
  onApproveAndIssueCertificate,
  onOpenReportTab,
}) => {
  const { locale, t } = useI18n();
  const validation = validateCompleteEvaluation(record);

  const hiClauseLabels: Record<string, { title: string; req: string }> = {
    'OIML R 76-1 Cl. 3.1.1 & Table 3': {
      title: 'मापिकी वर्गीकरण एवं स्केल अंतराल संख्या (n = Max / e)',
      req: `${record.instrument.accuracyClass}: सारणी 3 की सीमाओं के भीतर n एवं न्यूनतम क्षमता (Min)`,
    },
    'OIML R 76-1 Cl. 4.5.2 & A.4.2': {
      title: 'शून्य-सेटिंग एवं शून्य-ट्रैकिंग यथार्थता',
      req: 'प्रारंभिक शून्य संकेतन पर |E₀| ≤ 0.25 e',
    },
    'OIML R 76-1 Cl. 3.5.1 & Table 6': {
      title: 'तौल निष्पादन — संकेतन त्रुटि (आरोही एवं अवरोही भार)',
      req: 'Min से Max तक सभी भार चरणों पर |Ec| ≤ MPE',
    },
    'OIML R 76-1 Cl. 3.6.1 & A.4.10': {
      title: '~0.5 Max एवं ~Max पर पुनरावृत्ति परीक्षण (Repeatability)',
      req: 'बारंबार भारण के लिए फैलाव |E_max − E_min| ≤ |MPE|',
    },
    'OIML R 76-1 Cl. 3.6.2 & A.4.7': {
      title: 'उत्केंद्रित भारण परीक्षण (भार ग्राही के 5 चतुर्थांश)',
      req: 'L ≈ Max / 3 भार पर सभी 5 स्थितियों में |Ec| ≤ MPE',
    },
    'OIML R 76-1 Cl. 3.9.2.2 & 3.9.2.3': {
      title: 'स्थैतिक तापमान एवं शून्य-भार तापीय विचलन',
      req: `स्पैन त्रुटि |Ec| ≤ MPE; शून्य विचलन ≤ 1.0 e प्रति ${
        record.instrument.accuracyClass === 'Class I' ? 1 : 5
      } °C`,
    },
  };

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.reviewModule.partATitle}
        clauseRef={t.reviewModule.partAClause}
        subtitle={t.reviewModule.partASubtitle}
        rightActions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onApproveAndIssueCertificate}
              className="gov-btn-primary"
            >
              {t.actions.approveAndIssue}
            </button>
            <button
              type="button"
              onClick={onOpenReportTab}
              className="gov-btn-secondary"
            >
              {t.actions.proceedToReport}
            </button>
          </div>
        }
      >
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t.reviewModule.colClauseRef}</th>
                <th>{t.reviewModule.colParameter}</th>
                <th>{t.reviewModule.colRequirement}</th>
                <th>{t.reviewModule.colObserved}</th>
                <th>{t.reviewModule.colDetermination}</th>
              </tr>
            </thead>
            <tbody>
              {validation.clauseMatrix.map((item) => {
                const hiOverride =
                  locale === 'hi' ? hiClauseLabels[item.clauseRef] : undefined;
                return (
                  <tr key={item.clauseRef}>
                    <td className="font-semibold text-slate-900 whitespace-nowrap">
                      {item.clauseRef}
                    </td>
                    <td className="font-semibold text-slate-950">
                      {hiOverride ? hiOverride.title : item.clauseTitle}
                    </td>
                    <td className="text-xs text-slate-700">
                      {hiOverride ? hiOverride.req : item.requirementSummary}
                    </td>
                    <td className="text-xs font-medium text-slate-900">
                      {item.observedSummary}
                    </td>
                    <td>
                      <StatusIndicator status={item.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 border border-slate-300 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-700">
              {t.reviewModule.overallDispositionLabel}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {t.reviewModule.fileRefPrefix}{' '}
              <span className="font-semibold text-slate-900">
                {record.fileReferenceNo}
              </span>{' '}
              · {t.reviewModule.evalIdPrefix}{' '}
              <span className="font-semibold text-slate-900">{record.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusIndicator status={validation.overallDisposition} />
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        title={t.reviewModule.partBTitle}
        clauseRef={t.reviewModule.partBClause}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 min-w-0">
          <FieldGroup label={t.reviewModule.fileStatusLabel} required>
            <select
              className="gov-input font-semibold"
              value={record.status}
              onChange={(e) =>
                onUpdateMeta({ status: e.target.value as EvaluationStatus })
              }
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {t.status[st] || st}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup
            label={t.reviewModule.certNoLabel}
            hint={t.reviewModule.certNoHint}
          >
            <input
              type="text"
              className="gov-input"
              placeholder="GOI/LM/OIML-R76/2026/..."
              value={record.certificateNumber || ''}
              onChange={(e) =>
                onUpdateMeta({ certificateNumber: e.target.value })
              }
            />
          </FieldGroup>

          <FieldGroup label={t.reviewModule.certDateLabel}>
            <input
              type="date"
              className="gov-input"
              value={record.certificateIssuedDate || ''}
              onChange={(e) =>
                onUpdateMeta({ certificateIssuedDate: e.target.value })
              }
            />
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <FieldGroup label={t.reviewModule.officerRemarksLabel}>
            <textarea
              rows={4}
              className="gov-input"
              value={record.officerRemarks}
              onChange={(e) => onUpdateMeta({ officerRemarks: e.target.value })}
            />
          </FieldGroup>

          <FieldGroup label={t.reviewModule.reviewerRemarksLabel}>
            <textarea
              rows={4}
              className="gov-input"
              placeholder={t.reviewModule.reviewerRemarksPlaceholder}
              value={record.reviewerRemarks}
              onChange={(e) =>
                onUpdateMeta({ reviewerRemarks: e.target.value })
              }
            />
          </FieldGroup>
        </div>
      </SectionPanel>
    </div>
  );
};
