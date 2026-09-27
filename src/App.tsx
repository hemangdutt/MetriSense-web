import React from 'react';
import { I18nProvider } from './i18n';
import { AppRouter } from './app/routes/AppRouter';

export function App() {
  return (
    <I18nProvider>
      <AppRouter />
    </I18nProvider>
  );
}

export default App;
