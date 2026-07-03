import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <h1 className="app-title">{t('app.name')}</h1>
      <LanguageSwitcher />
    </header>
  );
}
