import { useTranslation } from 'react-i18next';

const SAMPLE_MISSIONS = [
  { id: 1, icon: '💧', titleKey: 'do.waterQuality', location: '도림천 Dorimcheon' },
  { id: 2, icon: '🦆', titleKey: 'do.speciesObserve', location: '안양천 Anyangcheon' },
];

export default function DoPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('do.title')}</h2>
        <p className="page-subtitle">{t('do.subtitle')}</p>
      </div>

      <h3 className="section-title">{t('do.missions')}</h3>
      <div className="mission-list">
        {SAMPLE_MISSIONS.map((mission) => (
          <div key={mission.id} className="mission-card">
            <span className="mission-icon">{mission.icon}</span>
            <div className="mission-info">
              <strong>{t(mission.titleKey)}</strong>
              <span className="mission-location">📍 {mission.location}</span>
            </div>
            <button className="join-btn">{t('do.join')}</button>
          </div>
        ))}
      </div>

      <div className="riverwatch-link">
        <p>🌊 RiverWatch 데이터 연동</p>
      </div>
    </div>
  );
}
