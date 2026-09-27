import React, { useState } from 'react';
import { EvaluationRecord } from '../../models';
import {
  EvaluationService,
  LaboratoryProfileSettings,
  PersistenceService,
} from '../../services';
import {
  AppRoute,
  DepartmentalHeader,
} from '../../components/layout/DepartmentalHeader';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { EvaluationWorkbenchPage } from '../../pages/evaluations/EvaluationWorkbenchPage';
import { InstrumentsRegistryPage } from '../../pages/instruments/InstrumentsRegistryPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { ArchivePage } from '../../pages/archive/ArchivePage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { useI18n } from '../../i18n';

export const AppRouter: React.FC = () => {
  const { t } = useI18n();
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() =>
    PersistenceService.getEvaluations()
  );
  const [labProfile, setLabProfile] = useState<LaboratoryProfileSettings>(() =>
    PersistenceService.getLabProfile()
  );
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [activeEvaluationId, setActiveEvaluationId] = useState<string>(
    () => evaluations[0]?.id || ''
  );
  const [activeWorkbenchStage, setActiveWorkbenchStage] = useState<number>(0);

  const activeRecord =
    evaluations.find((r) => r.id === activeEvaluationId) || evaluations[0];

  const handleOpenEvaluation = (id: string, initialTab = 0) => {
    setActiveEvaluationId(id);
    setActiveWorkbenchStage(initialTab);
    setCurrentRoute('workbench');
  };

  const handleCreateNewEvaluation = () => {
    const { id, fileReferenceNo } = PersistenceService.generateNextIdentifiers();
    const created = EvaluationService.createNewEvaluationRecord(
      id,
      fileReferenceNo,
      labProfile.laboratoryName,
      labProfile.laboratoryCode,
      labProfile.officerName,
      labProfile.officerDesignation,
      labProfile.officerId
    );
    const updatedList = PersistenceService.saveSingleEvaluation(created);
    setEvaluations(updatedList);
    setActiveEvaluationId(created.id);
    setActiveWorkbenchStage(0);
    setCurrentRoute('workbench');
  };

  const handleCloneEvaluation = (source: EvaluationRecord) => {
    const { id, fileReferenceNo } = PersistenceService.generateNextIdentifiers();
    const cloned: EvaluationRecord = {
      ...source,
      id,
      fileReferenceNo,
      status: 'IN PROGRESS',
      certificateNumber: undefined,
      certificateIssuedDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instrument: {
        ...source.instrument,
        serialNumber: `${source.instrument.serialNumber}-COPY`,
      },
    };
    const updatedList = PersistenceService.saveSingleEvaluation(cloned);
    setEvaluations(updatedList);
    setActiveEvaluationId(cloned.id);
    setActiveWorkbenchStage(0);
    setCurrentRoute('workbench');
  };

  const handleUpdateRecord = (updated: EvaluationRecord) => {
    const nextList = PersistenceService.saveSingleEvaluation(updated);
    setEvaluations(nextList);
  };

  const handleDeleteEvaluation = (id: string) => {
    const nextList = PersistenceService.deleteEvaluation(id);
    setEvaluations(nextList);
    if (activeEvaluationId === id && nextList.length > 0) {
      setActiveEvaluationId(nextList[0].id);
    }
  };

  const handleSaveProfile = (profile: LaboratoryProfileSettings) => {
    PersistenceService.saveLabProfile(profile);
    setLabProfile(profile);
  };

  const handleResetDemoData = () => {
    const seed = PersistenceService.resetToDepartmentalSeed();
    setEvaluations(seed);
    if (seed[0]) {
      setActiveEvaluationId(seed[0].id);
    }
    setCurrentRoute('dashboard');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F3F4F6] text-slate-900">
      <DepartmentalHeader
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        onCreateNewEvaluation={handleCreateNewEvaluation}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full min-w-0 mx-auto px-4 md:px-6 py-4">
        {currentRoute === 'dashboard' && (
          <DashboardPage
            evaluations={evaluations}
            labProfile={labProfile}
            onOpenEvaluation={handleOpenEvaluation}
            onCreateNew={handleCreateNewEvaluation}
            onCloneEvaluation={handleCloneEvaluation}
            onNavigate={setCurrentRoute}
          />
        )}

        {currentRoute === 'workbench' && activeRecord && (
          <EvaluationWorkbenchPage
            record={activeRecord}
            activeStageIndex={activeWorkbenchStage}
            onChangeStageIndex={setActiveWorkbenchStage}
            onUpdateRecord={handleUpdateRecord}
            onBackToRegister={() => setCurrentRoute('dashboard')}
          />
        )}

        {currentRoute === 'instruments' && (
          <InstrumentsRegistryPage
            evaluations={evaluations}
            onOpenEvaluation={(id) => handleOpenEvaluation(id, 0)}
          />
        )}

        {currentRoute === 'reports' && (
          <ReportsPage
            evaluations={evaluations}
            onOpenInWorkbench={(id) => handleOpenEvaluation(id, 0)}
          />
        )}

        {currentRoute === 'archive' && (
          <ArchivePage
            evaluations={evaluations}
            onOpenEvaluation={handleOpenEvaluation}
            onImportEvaluation={handleUpdateRecord}
            onDeleteEvaluation={handleDeleteEvaluation}
          />
        )}

        {currentRoute === 'settings' && (
          <SettingsPage
            profile={labProfile}
            onSaveProfile={handleSaveProfile}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Quiet Departmental Footer */}
      <footer className="border-t border-slate-300 bg-white py-3 px-6 text-xs text-slate-600 no-print w-full max-w-full">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>{t.footerLeft}</div>
          <div className="font-medium text-slate-700">{t.footerRight}</div>
        </div>
      </footer>
    </div>
  );
};
