import React, { useState } from 'react';
import { EvaluationRecord } from '../../models';
import { SectionPanel } from '../../components/common/SectionPanel';
import { StatusIndicator } from '../../components/feedback/StatusIndicator';
import { ReportCertificateModule } from '../../modules/evaluation/report/ReportCertificateModule';
import { useI18n } from '../../i18n';

interface ReportsPageProps {
  evaluations: EvaluationRecord[];
  onOpenInWorkbench: (id: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  evaluations,
  onOpenInWorkbench,
}) => {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>(
    evaluations[0]?.id || ''
  );

  const selectedRecord =
    evaluations.find((r) => r.id === selectedId) || evaluations[0];

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.reportsPage.title}
        clauseRef={t.reportsPage.clause}
        subtitle={t.reportsPage.subtitle}
        className="no-print"
      >
        <div className="gov-table-wrap">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>{t.reportsPage.colEvalId}</th>
                <th>{t.reportsPage.colCertNo}</th>
                <th>{t.reportsPage.colManufModel}</th>
                <th>{t.reportsPage.colClassCap}</th>
                <th>{t.reportsPage.colOfficer}</th>
                <th>{t.reportsPage.colDetermination}</th>
                <th>{t.reportsPage.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((rec) => {
                const isSelected = rec.id === selectedRecord?.id;
                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedId(rec.id)}
                    className={`cursor-pointer ${
                      isSelected ? 'bg-blue-50/80' : ''
                    }`}
                  >
                    <td className="font-bold text-[#12355B]">{rec.id}</td>
                    <td>
                      {rec.certificateNumber || t.reportsPage.draftReportText}
                    </td>
                    <td>
                      <span className="font-semibold">
                        {rec.instrument.manufacturer}
                      </span>{' '}
                      — <span>{rec.instrument.modelDesignation}</span>
                    </td>
                    <td>
                      {rec.instrument.accuracyClass} ·{' '}
                      {rec.instrument.maxCapacity} {rec.instrument.unit}
                    </td>
                    <td>{rec.laboratory.testingOfficerName}</td>
                    <td>
                      <StatusIndicator status={rec.disposition} />
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="whitespace-nowrap space-x-2"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(rec.id)}
                        className="font-bold text-[#12355B] hover:underline cursor-pointer"
                      >
                        {t.reportsPage.previewReportBtn}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => onOpenInWorkbench(rec.id)}
                        className="text-slate-700 font-semibold hover:underline cursor-pointer"
                      >
                        {t.reportsPage.editDossierBtn}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionPanel>

      {selectedRecord && <ReportCertificateModule record={selectedRecord} />}
    </div>
  );
};
