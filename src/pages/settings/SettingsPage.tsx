import React, { useState } from 'react';
import { LaboratoryProfileSettings } from '../../services';
import { SectionPanel } from '../../components/common/SectionPanel';
import { FieldGroup } from '../../components/forms/FieldGroup';
import { useI18n } from '../../i18n';

interface SettingsPageProps {
  profile: LaboratoryProfileSettings;
  onSaveProfile: (updated: LaboratoryProfileSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  onSaveProfile,
  onResetDemoData,
}) => {
  const { t } = useI18n();
  const [draft, setDraft] = useState<LaboratoryProfileSettings>(profile);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleField = <K extends keyof LaboratoryProfileSettings>(
    key: K,
    value: LaboratoryProfileSettings[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSavedBanner(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(draft);
    setSavedBanner(true);
  };

  return (
    <div className="space-y-4 min-w-0">
      <form onSubmit={handleSubmit}>
        <SectionPanel
          title={t.settingsPage.title}
          clauseRef={t.settingsPage.clause}
          subtitle={t.settingsPage.subtitle}
          rightActions={
            <button type="submit" className="gov-btn-primary">
              {t.settingsPage.saveBtn}
            </button>
          }
        >
          {savedBanner && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900">
              {t.settingsPage.savedConfirm}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
            <FieldGroup label={t.settingsPage.labNameLabel} required>
              <input
                type="text"
                className="gov-input"
                value={draft.laboratoryName}
                onChange={(e) => handleField('laboratoryName', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.labCodeLabel} required>
              <input
                type="text"
                className="gov-input"
                value={draft.laboratoryCode}
                onChange={(e) => handleField('laboratoryCode', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.directorateLabel}>
              <input
                type="text"
                className="gov-input"
                value={draft.regionalDirectorate}
                onChange={(e) =>
                  handleField('regionalDirectorate', e.target.value)
                }
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.bayLabel}>
              <input
                type="text"
                className="gov-input"
                value={draft.defaultBayLocation}
                onChange={(e) =>
                  handleField('defaultBayLocation', e.target.value)
                }
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.officerNameLabel} required>
              <input
                type="text"
                className="gov-input"
                value={draft.officerName}
                onChange={(e) => handleField('officerName', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.officerDesigLabel} required>
              <input
                type="text"
                className="gov-input"
                value={draft.officerDesignation}
                onChange={(e) =>
                  handleField('officerDesignation', e.target.value)
                }
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.officerIdLabel} required>
              <input
                type="text"
                className="gov-input"
                value={draft.officerId}
                onChange={(e) => handleField('officerId', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.supervisorLabel}>
              <input
                type="text"
                className="gov-input"
                value={draft.supervisingOfficerName}
                onChange={(e) =>
                  handleField('supervisingOfficerName', e.target.value)
                }
              />
            </FieldGroup>

            <FieldGroup label={t.settingsPage.weightSetLabel}>
              <input
                type="text"
                className="gov-input"
                value={draft.defaultWeightSetId}
                onChange={(e) =>
                  handleField('defaultWeightSetId', e.target.value)
                }
              />
            </FieldGroup>
          </div>
        </SectionPanel>
      </form>

      <SectionPanel
        title={t.settingsPage.seedTitle}
        subtitle={t.settingsPage.seedSubtitle}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            {t.settingsPage.seedDesc}
          </div>
          <button
            type="button"
            onClick={onResetDemoData}
            className="gov-btn-danger"
          >
            {t.settingsPage.seedResetBtn}
          </button>
        </div>
      </SectionPanel>
    </div>
  );
};
