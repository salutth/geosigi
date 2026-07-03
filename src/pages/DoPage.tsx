import { useTranslation } from 'react-i18next';
import { useQuery } from '../hooks/useSupabase';

interface Mission {
  id: number;
  title_ko: string;
  title_en: string;
  mission_type: string;
  river: string;
  status: string;
}

interface RiverReading {
  id: number;
  river_name: string;
  ph: number;
  do_level: number;
  bod: number;
  collected_at: string;
}

const MISSION_ICONS: Record<string, string> = {
  water_quality: '💧',
  species_observation: '🦆',
  cleanup: '🧹',
};

export default function DoPage() {
  const { t, i18n } = useTranslation();
  const { data: missions, loading: missionsLoading } = useQuery<Mission>('geosigi_missions', {
    eq: { column: 'status', value: 'active' },
    order: { column: 'created_at', ascending: false },
  });
  const { data: readings, loading: readingsLoading } = useQuery<RiverReading>('river_readings', {
    order: { column: 'collected_at', ascending: false },
    limit: 3,
  });

  const lang = i18n.language;

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('do.title')}</h2>
        <p className="page-subtitle">{t('do.subtitle')}</p>
      </div>

      <h3 className="section-title">{t('do.missions')}</h3>
      <div className="mission-list">
        {missionsLoading ? (
          <div className="empty-state">Loading...</div>
        ) : missions.length === 0 ? (
          <div className="empty-state">{t('common.noData')}</div>
        ) : (
          missions.map((m) => (
            <div key={m.id} className="mission-card">
              <span className="mission-icon">{MISSION_ICONS[m.mission_type] || '🌿'}</span>
              <div className="mission-info">
                <strong>{lang === 'ko' ? m.title_ko : (m.title_en || m.title_ko)}</strong>
                <span className="mission-location">📍 {m.river}</span>
              </div>
              <button className="join-btn">{t('do.join')}</button>
            </div>
          ))
        )}
      </div>

      <h3 className="section-title" style={{ marginTop: 20 }}>🌊 RiverWatch {t('do.recentData')}</h3>
      <div className="mission-list">
        {readingsLoading ? (
          <div className="empty-state">Loading...</div>
        ) : readings.length === 0 ? (
          <div className="empty-state">{t('common.noData')}</div>
        ) : (
          readings.map((r) => (
            <div key={r.id} className="mission-card">
              <span className="mission-icon">📊</span>
              <div className="mission-info">
                <strong>{r.river_name}</strong>
                <span className="mission-location">
                  pH {r.ph} · DO {r.do_level} · BOD {r.bod}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <a
        href="https://sakyowon-ai.pages.dev/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="riverwatch-link"
        style={{ display: 'block', textDecoration: 'none' }}
      >
        🌊 RiverWatch Dashboard →
      </a>
    </div>
  );
}
