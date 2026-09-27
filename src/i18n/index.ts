import React, { createContext, useContext, useState } from 'react';
import { enTranslations, TranslationDictionary } from './en';
import { hiTranslations } from './hi';

export type SupportedLocale = 'en' | 'hi';

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: enTranslations,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const t = locale === 'hi' ? hiTranslations : enTranslations;

  return React.createElement(
    I18nContext.Provider,
    { value: { locale, setLocale, t } },
    children
  );
};

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
