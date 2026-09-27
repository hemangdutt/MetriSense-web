import React from 'react';
import { useI18n } from '../../i18n';
import { AshokaChakraMark } from '../common/AshokaChakraMark';

export type AppRoute =
  | 'dashboard'
  | 'workbench'
  | 'instruments'
  | 'reports'
  | 'archive'
  | 'settings';

interface DepartmentalHeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onCreateNewEvaluation: () => void;
}

export const DepartmentalHeader: React.FC<DepartmentalHeaderProps> = ({
  currentRoute,
  onNavigate,
  onCreateNewEvaluation,
}) => {
  const { locale, setLocale, t } = useI18n();

  const navItems: Array<{ id: AppRoute; label: string }> = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'workbench', label: t.nav.workbench },
    { id: 'instruments', label: t.nav.instruments },
    { id: 'reports', label: t.nav.reports },
    { id: 'archive', label: t.nav.archive },
    { id: 'settings', label: t.nav.settings },
  ];

  return (
    <header className="bg-[#12355B] text-white border-b-2 border-[#D97706] no-print w-full max-w-full">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Government Identity + METRISENSE */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left cursor-pointer shrink-0 group"
        >
          <AshokaChakraMark size={30} className="text-amber-400" />
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-white">
              METRISENSE
            </div>
            <div className="text-[11px] font-normal text-slate-200">
              {t.headerMinistryLine}
            </div>
          </div>
        </button>

        {/* Primary Departmental Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex flex-wrap items-center gap-4 xl:gap-5 text-xs font-medium text-slate-100 min-w-0"
        >
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-white font-bold border-amber-400'
                    : 'border-transparent text-slate-200 hover:text-white hover:border-slate-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Language Toggle & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0D2642] border border-slate-500 hover:border-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            {locale === 'en' ? 'हिन्दी / EN' : 'EN / हिन्दी'}
          </button>
          <button
            type="button"
            onClick={onCreateNewEvaluation}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            + {t.actions.newEvaluation}
          </button>
        </div>
      </div>

      {/* Compact Secondary Navigation Bar for medium screens (<1024px) */}
      <div className="lg:hidden bg-[#0D2642] border-t border-slate-700 px-4 py-1.5 flex flex-wrap items-center gap-2 text-xs">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-2 py-1 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
