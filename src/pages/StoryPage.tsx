import { useTranslation } from 'react-i18next';
import { useQuery } from '../hooks/useSupabase';

interface Story {
  id: number;
  title: string;
  body: string;
  activity_type: string;
  created_at: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  water_quality: '💧',
  species: '🦆',
  community: '🤝',
  settle: '🏠',
};

export default function StoryPage() {
  const { t } = useTranslation();
  const { data: stories, loading } = useQuery<Story>('geosigi_stories', {
    eq: { column: 'shared', value: true },
    order: { column: 'created_at', ascending: false },
    limit: 10,
  });

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
          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : stories.length === 0 ? (
            <p className="empty-state">—</p>
          ) : (
            stories.map((s) => (
              <div key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 14 }}>
                  {ACTIVITY_ICONS[s.activity_type] || '✨'} {s.title}
                </strong>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        <button className="create-story-btn">
          ✨ {t('story.createStory')}
        </button>
      </div>
    </div>
  );
}
