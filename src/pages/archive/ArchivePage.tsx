import React, { useState } from 'react';
import { EvaluationRecord } from '../../models';
import { ReportExportService } from '../../services';
import { SectionPanel } from '../../components/common/SectionPanel';
import { StatusIndicator } from '../../components/feedback/StatusIndicator';
import { formatIsoDate } from '../../utils/formatters';
import { useI18n } from '../../i18n';

interface ArchivePageProps {
  evaluations: EvaluationRecord[];
  onOpenEvaluation: (id: string, tabIdx?: number) => void;
  onImportEvaluation: (record: EvaluationRecord) => void;
  onDeleteEvaluation: (id: string) => void;
}

export const ArchivePage: React.FC<ArchivePageProps> = ({
  evaluations,
  onOpenEvaluation,
  onImportEvaluation,
  onDeleteEvaluation,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const filtered = evaluations.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      r.fileReferenceNo.toLowerCase().includes(q) ||
      r.instrument.manufacturer.toLowerCase().includes(q) ||
      r.instrument.serialNumber.toLowerCase().includes(q) ||
      (r.certificateNumber || '').toLowerCase().includes(q)
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const candidate: EvaluationRecord = parsed.evaluation || parsed;
        if (!candidate.id || !candidate.instrument) {
          throw new Error('Invalid METRISENSE JSON dossier structure.');
        }
        onImportEvaluation(candidate);
        setImportSuccess(`Successfully imported dossier ${candidate.id}.`);
      } catch (err) {
        setImportError(
          err instanceof Error ? err.message : 'Could not parse JSON dossier.'
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 min-w-0">
      <SectionPanel
        title={t.archivePage.title}
        clauseRef={t.archivePage.clause}
        subtitle={t.archivePage.subtitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-slate-50 p-3 border border-slate-300 min-w-0">
          <div className="md:col-span-2 min-w-0">
            <label className="gov-label">{t.archivePage.searchLabel}</label>
            <input
              type="text"
              className="gov-input"
              placeholder={t.archivePage.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="min-w-0">
            <label className="gov-label">{t.archivePage.importLabel}</label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="gov-input text-xs py-1"
            />
          </div>
        </div>

        {importError && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-300 text-xs text-red-800">
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
            {importSuccess}
          </div>
        )}

        <div className="gov-table-wrap">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>{t.archivePage.colDossierId}</th>
                <th>{t.archivePage.colFileRef}</th>
                <th>{t.archivePage.colCertNo}</th>
                <th>{t.archivePage.colInstrumentSn}</th>
                <th>{t.archivePage.colLab}</th>
                <th>{t.archivePage.colStatus}</th>
                <th>{t.archivePage.colDisposition}</th>
                <th>{t.archivePage.colDate}</th>
                <th>{t.archivePage.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-bold text-slate-950">{rec.id}</td>
                  <td>{rec.fileReferenceNo}</td>
                  <td>{rec.certificateNumber || '—'}</td>
                  <td>
                    <div className="font-semibold">
                      {rec.instrument.manufacturer} (
                      {rec.instrument.modelDesignation})
                    </div>
                    <div className="text-[11px] text-slate-600">
                      S/N: {rec.instrument.serialNumber}
                    </div>
                  </td>
                  <td>{rec.laboratory.laboratoryCode}</td>
                  <td>
                    <StatusIndicator status={rec.status} />
                  </td>
                  <td>
                    <StatusIndicator status={rec.disposition} />
                  </td>
                  <td className="whitespace-nowrap">
                    {formatIsoDate(rec.updatedAt)}
                  </td>
                  <td className="whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => onOpenEvaluation(rec.id, 0)}
                      className="font-bold text-[#12355B] hover:underline cursor-pointer"
                    >
                      {t.actions.openRecord}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        ReportExportService.exportEvaluationJson(rec)
                      }
                      className="text-slate-700 font-semibold hover:underline cursor-pointer"
                    >
                      JSON
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        ReportExportService.exportObservationsCsv(rec)
                      }
                      className="text-slate-700 font-semibold hover:underline cursor-pointer"
                    >
                      CSV
                    </button>
                    {evaluations.length > 1 && (
                      <>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => onDeleteEvaluation(rec.id)}
                          className="text-red-700 font-semibold hover:underline cursor-pointer"
                        >
                          {t.actions.deleteRecord}
                        </button>
                      </>
                    )}
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
