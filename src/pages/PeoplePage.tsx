import { useTranslation } from 'react-i18next';

export default function PeoplePage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('people.title')}</h2>
        <p className="page-subtitle">{t('people.subtitle')}</p>
      </div>

      <div className="people-sections">
        <div className="section-card">
          <span className="section-icon">🏘️</span>
          <h3>{t('people.groups')}</h3>
          <p>건강한도림천을만드는주민모임</p>
          <p>서울하천네트워크</p>
        </div>

        <div className="section-card">
          <span className="section-icon">💬</span>
          <h3>{t('people.chat')}</h3>
          <p>6 languages real-time</p>
        </div>

        <div className="section-card">
          <span className="section-icon">📍</span>
          <h3>{t('people.nearby')}</h3>
        </div>
      </div>
    </div>
  );
}
