import { useTranslation } from 'react-i18next';

export default function StoryPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('story.title')}</h2>
        <p className="page-subtitle">{t('story.subtitle')}</p>
      </div>

      <div className="story-sections">
        <div className="section-card">
          <span className="section-icon">📊</span>
          <h3>{t('story.myActivities')}</h3>
          <p className="empty-state">—</p>
        </div>

        <button className="create-story-btn">
          ✨ {t('story.createStory')}
        </button>
      </div>
    </div>
  );
}
