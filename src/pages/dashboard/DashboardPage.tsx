import React, { useMemo, useRef, useState } from 'react';
import { AccuracyClass, EvaluationRecord } from '../../models';
import { LaboratoryProfileSettings } from '../../services';
import { SectionPanel } from '../../components/common/SectionPanel';
import { StatusIndicator } from '../../components/feedback/StatusIndicator';
import { AshokaChakraMark } from '../../components/common/AshokaChakraMark';
import { AppRoute } from '../../components/layout/DepartmentalHeader';
import { formatIsoDate } from '../../utils/formatters';
import { useI18n } from '../../i18n';

interface DashboardPageProps {
  evaluations: EvaluationRecord[];
  labProfile: LaboratoryProfileSettings;
  onOpenEvaluation: (id: string, initialTab?: number) => void;
  onCreateNew: () => void;
  onCloneEvaluation: (record: EvaluationRecord) => void;
  onNavigate: (route: AppRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  evaluations,
  labProfile,
  onOpenEvaluation,
  onCreateNew,
  onCloneEvaluation,
  onNavigate,
}) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [dispositionFilter, setDispositionFilter] = useState<string>('ALL');
  const registerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return evaluations.filter((rec) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        rec.id.toLowerCase().includes(q) ||
        rec.fileReferenceNo.toLowerCase().includes(q) ||
        rec.instrument.manufacturer.toLowerCase().includes(q) ||
        rec.instrument.modelDesignation.toLowerCase().includes(q) ||
        rec.instrument.serialNumber.toLowerCase().includes(q) ||
        rec.laboratory.laboratoryCode.toLowerCase().includes(q);

      const matchesClass =
        classFilter === 'ALL' || rec.instrument.accuracyClass === classFilter;
      const matchesDisposition =
        dispositionFilter === 'ALL' || rec.disposition === dispositionFilter;

      return matchesQuery && matchesClass && matchesDisposition;
    });
  }, [evaluations, searchQuery, classFilter, dispositionFilter]);

  const activeWorkFiles = useMemo(() => {
    return evaluations.filter(
      (e) =>
        e.status === 'IN PROGRESS' ||
        e.status === 'DRAFT' ||
        e.status === 'UNDER REVIEW'
    );
  }, [evaluations]);

  const totalCount = evaluations.length;
  const inProgressCount = activeWorkFiles.length;
  const compliantCount = evaluations.filter(
    (e) => e.disposition === 'COMPLIANT'
  ).length;
  const nonCompliantCount = evaluations.filter(
    (e) => e.disposition === 'NON-COMPLIANT'
  ).length;

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* 1. Restrained Left-Aligned Departmental Hero / Introduction Section */}
      <section className="gov-panel bg-white border-t-4 border-t-[#12355B] p-5 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-300">
          <div className="space-y-1.5 max-w-4xl min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#12355B]">
              <AshokaChakraMark size={18} className="text-[#12355B]" />
              <span>{t.deptHeader}</span>
              <span>·</span>
              <span>{t.deptSubHeader}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight">
              {t.hero.title}
            </h1>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              {t.hero.description}
            </p>
          </div>

          {/* Direct Departmental Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onCreateNew}
              className="gov-btn-primary"
            >
              + {t.actions.newEvaluation}
            </button>
            <button
              type="button"
              onClick={scrollToRegister}
              className="gov-btn-secondary"
            >
              {t.nav.dashboard}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('instruments')}
              className="gov-btn-secondary"
            >
              {t.nav.instruments}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="gov-btn-secondary"
            >
              {t.nav.reports}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('archive')}
              className="gov-btn-secondary"
            >
              {t.nav.archive}
            </button>
          </div>
        </div>

        {/* Institutional Scope & Standard Metadata Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
          <div className="border-l-2 border-[#12355B] pl-3">
            <div className="font-bold text-slate-800">{t.hero.metaWhatLabel}</div>
            <div className="text-slate-600 mt-0.5">{t.hero.metaWhatValue}</div>
          </div>
          <div className="border-l-2 border-[#12355B] pl-3">
            <div className="font-bold text-slate-800">{t.hero.metaWhoLabel}</div>
            <div className="text-slate-600 mt-0.5">{t.hero.metaWhoValue}</div>
          </div>
          <div className="border-l-2 border-[#12355B] pl-3">
            <div className="font-bold text-slate-800">
              {t.hero.metaStandardLabel}
            </div>
            <div className="text-slate-600 mt-0.5">
              {t.hero.metaStandardValue}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Administrative Split Workspace: Left = Current Evaluation Work, Right = Laboratory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
        {/* LEFT (8 cols): Current Evaluation Work & Pending Dossiers */}
        <div className="lg:col-span-8 min-w-0">
          <SectionPanel
            title={t.dashboard.activeWorkTitle}
            subtitle={t.dashboard.activeWorkSubtitle}
          >
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>{t.dashboard.colDossierId}</th>
                    <th>{t.dashboard.colModelSn}</th>
                    <th>{t.dashboard.colClass}</th>
                    <th>{t.dashboard.colCapacity}</th>
                    <th>{t.dashboard.colFileStatus}</th>
                    <th>{t.dashboard.colDisposition}</th>
                    <th>{t.dashboard.colOperations}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeWorkFiles.map((rec) => (
                    <tr
                      key={rec.id}
                      onClick={() => onOpenEvaluation(rec.id, 0)}
                      className="cursor-pointer"
                    >
                      <td>
                        <div className="font-bold text-[#12355B]">{rec.id}</div>
                        <div className="text-[11px] text-slate-600">
                          {rec.fileReferenceNo}
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">
                          {rec.instrument.manufacturer} —{' '}
                          {rec.instrument.modelDesignation}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          S/N: {rec.instrument.serialNumber}
                        </div>
                      </td>
                      <td className="font-semibold whitespace-nowrap">
                        {rec.instrument.accuracyClass}
                      </td>
                      <td className="text-xs whitespace-nowrap">
                        <div>
                          {rec.instrument.maxCapacity} {rec.instrument.unit} / e={' '}
                          {rec.instrument.verificationScaleInterval}{' '}
                          {rec.instrument.unit}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          n = {rec.instrument.verificationIntervalsN.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <StatusIndicator status={rec.status} />
                      </td>
                      <td>
                        <StatusIndicator status={rec.disposition} />
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="whitespace-nowrap space-x-2"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenEvaluation(rec.id, 0)}
                          className="text-xs font-bold text-[#12355B] hover:underline cursor-pointer"
                        >
                          {t.actions.openWorkbench}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => onOpenEvaluation(rec.id, 8)}
                          className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                        >
                          {t.actions.openReport}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeWorkFiles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-600">
                        {t.dashboard.noActiveWork}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        </div>

        {/* RIGHT (4 cols): Laboratory Status & Duty Summary */}
        <div className="lg:col-span-4 min-w-0">
          <SectionPanel
            title={t.dashboard.labStatusTitle}
            subtitle={t.dashboard.labStatusSubtitle}
          >
            <div className="space-y-3 text-xs">
              <div className="border border-slate-300 bg-slate-50 p-3 space-y-2">
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600 font-medium">
                    {t.dashboard.stationCodeLabel}:
                  </span>
                  <span className="font-bold text-slate-950 text-right">
                    {labProfile.laboratoryCode}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600 font-medium">
                    {t.dashboard.dutyOfficerLabel}:
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    {labProfile.officerName} ({labProfile.officerId})
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600 font-medium">
                    {t.dashboard.refStandardLabel}:
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    {labProfile.defaultWeightSetId}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-600 font-medium">
                    {t.dashboard.calValidityLabel}:
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    {labProfile.defaultCalibrationCertRef}
                  </span>
                </div>
              </div>

              {/* Register Summary Table */}
              <table className="gov-table border border-slate-300">
                <tbody>
                  <tr>
                    <th className="w-2/3">{t.dashboard.totalDossiersLabel}</th>
                    <td className="font-bold text-right text-slate-950">
                      {totalCount}
                    </td>
                  </tr>
                  <tr>
                    <th>{t.dashboard.activeEvaluationsLabel}</th>
                    <td className="font-bold text-right text-amber-800">
                      {inProgressCount}
                    </td>
                  </tr>
                  <tr>
                    <th>{t.dashboard.compliantCountLabel}</th>
                    <td className="font-bold text-right text-emerald-800">
                      {compliantCount}
                    </td>
                  </tr>
                  <tr>
                    <th>{t.dashboard.nonCompliantCountLabel}</th>
                    <td className="font-bold text-right text-red-800">
                      {nonCompliantCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionPanel>
        </div>
      </div>

      {/* 3. Master NAWI Metrological Evaluation Register */}
      <div ref={registerRef} className="min-w-0">
        <SectionPanel
          title={t.dashboard.masterRegisterTitle}
          clauseRef={t.dashboard.masterRegisterClause}
          subtitle={t.dashboard.masterRegisterSubtitle}
        >
          {/* Filter & Search Bar */}
          <div className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 border border-slate-300 min-w-0">
            <div className="md:col-span-2 min-w-0">
              <label className="gov-label">{t.dashboard.searchLabel}</label>
              <input
                type="text"
                className="gov-input"
                placeholder={t.dashboard.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="min-w-0">
              <label className="gov-label">{t.dashboard.filterClassLabel}</label>
              <select
                className="gov-input"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="ALL">{t.dashboard.allClasses}</option>
                {(
                  ['Class I', 'Class II', 'Class III', 'Class IIII'] as AccuracyClass[]
                ).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="gov-label">
                {t.dashboard.filterDispositionLabel}
              </label>
              <select
                className="gov-input"
                value={dispositionFilter}
                onChange={(e) => setDispositionFilter(e.target.value)}
              >
                <option value="ALL">{t.dashboard.allDispositions}</option>
                <option value="COMPLIANT">{t.status.COMPLIANT}</option>
                <option value="NON-COMPLIANT">{t.status['NON-COMPLIANT']}</option>
                <option value="INCOMPLETE">{t.status.INCOMPLETE}</option>
              </select>
            </div>
          </div>

          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t.dashboard.colDossierId}</th>
                  <th>{t.dashboard.colModelSn}</th>
                  <th>{t.dashboard.colManufacturer}</th>
                  <th>{t.dashboard.colClass}</th>
                  <th>{t.dashboard.colCapacity}</th>
                  <th>{t.dashboard.colLab}</th>
                  <th>{t.dashboard.colFileStatus}</th>
                  <th>{t.dashboard.colDisposition}</th>
                  <th>{t.dashboard.colUpdated}</th>
                  <th>{t.dashboard.colOperations}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => onOpenEvaluation(rec.id, 0)}
                    className="cursor-pointer"
                  >
                    <td>
                      <div className="font-bold text-[#12355B]">{rec.id}</div>
                      <div className="text-[11px] text-slate-600">
                        {rec.fileReferenceNo}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-950">
                        {rec.instrument.modelDesignation}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        S/N: {rec.instrument.serialNumber}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-slate-900">
                        {rec.instrument.manufacturer}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {rec.instrument.instrumentType}
                      </div>
                    </td>
                    <td className="font-semibold whitespace-nowrap">
                      {rec.instrument.accuracyClass}
                    </td>
                    <td className="text-xs whitespace-nowrap">
                      <div>
                        Max: {rec.instrument.maxCapacity} {rec.instrument.unit} · e:{' '}
                        {rec.instrument.verificationScaleInterval}{' '}
                        {rec.instrument.unit}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        n = {rec.instrument.verificationIntervalsN.toLocaleString()}
                      </div>
                    </td>
                    <td className="text-xs">
                      <div className="font-semibold text-slate-900">
                        {rec.laboratory.laboratoryCode}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {rec.laboratory.testingOfficerName}
                      </div>
                    </td>
                    <td>
                      <StatusIndicator status={rec.status} />
                    </td>
                    <td>
                      <StatusIndicator status={rec.disposition} />
                    </td>
                    <td className="text-xs text-slate-700 whitespace-nowrap">
                      {formatIsoDate(rec.updatedAt)}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="whitespace-nowrap space-x-2"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenEvaluation(rec.id, 0)}
                        className="text-xs font-bold text-[#12355B] hover:underline cursor-pointer"
                      >
                        {t.actions.openWorkbench}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => onOpenEvaluation(rec.id, 8)}
                        className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                      >
                        {t.actions.openReport}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => onCloneEvaluation(rec)}
                        className="text-xs text-slate-600 hover:underline cursor-pointer"
                      >
                        {t.actions.cloneEvaluation}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-slate-600">
                      {t.dashboard.emptyFilterResult}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};
