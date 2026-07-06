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
  station: string;
  river: string;
  water_level: number;
  level_ratio: number;
  status: string;
  measured_at: string;
}

interface FloodAlert {
  id: number;
  river: string;
  station: string;
  alert_level: string;
  water_level: number;
  threshold: number;
  message: string;
  issued_at: string;
}

const MISSION_ICONS: Record<string, string> = {
  water_quality: '💧',
  species_observation: '🦆',
  invasive_species: '🚨',
  cleanup: '🧹',
};

const MISSION_LINKS: Record<string, string> = {
  water_quality: 'https://dorimchun-ai.pages.dev/report',
  species_observation: 'https://dorimchun-ai.pages.dev/report',
  invasive_species: 'https://dorimchun-ai.pages.dev/report',
  cleanup: 'https://dorimchun-ai.pages.dev/mission',
};

const DEFAULT_MISSIONS: Mission[] = [
  { id: -1, title_ko: '도림천 수질 측정', title_en: 'Dorimcheon Water Quality', mission_type: 'water_quality', river: '도림천', status: 'active' },
  { id: -2, title_ko: '도림천 생물 관찰', title_en: 'Dorimcheon Species Observation', mission_type: 'species_observation', river: '도림천', status: 'active' },
  { id: -3, title_ko: '도림천 생태교란종 모니터링', title_en: 'Dorimcheon Invasive Species', mission_type: 'invasive_species', river: '도림천', status: 'active' },
  { id: -4, title_ko: '안양천 생물 관찰', title_en: 'Anyangcheon Species Observation', mission_type: 'species_observation', river: '안양천', status: 'active' },
  { id: -5, title_ko: '안양천 생태교란종 모니터링', title_en: 'Anyangcheon Invasive Species', mission_type: 'invasive_species', river: '안양천', status: 'active' },
  { id: -6, title_ko: '청계천 수질 측정', title_en: 'Cheonggyecheon Water Quality', mission_type: 'water_quality', river: '청계천', status: 'active' },
  { id: -7, title_ko: '청계천 생물 관찰', title_en: 'Cheonggyecheon Species Observation', mission_type: 'species_observation', river: '청계천', status: 'active' },
  { id: -8, title_ko: '중랑천 생태교란종 모니터링', title_en: 'Jungnangcheon Invasive Species', mission_type: 'invasive_species', river: '중랑천', status: 'active' },
  { id: -9, title_ko: '중랑천 생물 관찰', title_en: 'Jungnangcheon Species Observation', mission_type: 'species_observation', river: '중랑천', status: 'active' },
  { id: -10, title_ko: '탄천 수질 측정', title_en: 'Tancheon Water Quality', mission_type: 'water_quality', river: '탄천', status: 'active' },
  { id: -11, title_ko: '탄천 생물 관찰', title_en: 'Tancheon Species Observation', mission_type: 'species_observation', river: '탄천', status: 'active' },
  { id: -12, title_ko: '홍제천 수질 측정', title_en: 'Hongje Stream Water Quality', mission_type: 'water_quality', river: '홍제천', status: 'active' },
  { id: -13, title_ko: '홍제천 생물 관찰', title_en: 'Hongje Stream Species Observation', mission_type: 'species_observation', river: '홍제천', status: 'active' },
  { id: -14, title_ko: '양재천 수질 측정', title_en: 'Yangjae Stream Water Quality', mission_type: 'water_quality', river: '양재천', status: 'active' },
  { id: -15, title_ko: '양재천 생물 관찰', title_en: 'Yangjae Stream Species Observation', mission_type: 'species_observation', river: '양재천', status: 'active' },
  { id: -16, title_ko: '불광천 수질 측정', title_en: 'Bulgwang Stream Water Quality', mission_type: 'water_quality', river: '불광천', status: 'active' },
  { id: -17, title_ko: '불광천 생물 관찰', title_en: 'Bulgwang Stream Species Observation', mission_type: 'species_observation', river: '불광천', status: 'active' },
  { id: -18, title_ko: '우이천 수질 측정', title_en: 'Ui Stream Water Quality', mission_type: 'water_quality', river: '우이천', status: 'active' },
  { id: -19, title_ko: '우이천 생물 관찰', title_en: 'Ui Stream Species Observation', mission_type: 'species_observation', river: '우이천', status: 'active' },
  { id: -20, title_ko: '성북천 수질 측정', title_en: 'Seongbuk Stream Water Quality', mission_type: 'water_quality', river: '성북천', status: 'active' },
  { id: -21, title_ko: '성북천 생물 관찰', title_en: 'Seongbuk Stream Species Observation', mission_type: 'species_observation', river: '성북천', status: 'active' },
];

const ALERT_STYLES: Record<string, { icon: string; label: string; color: string }> = {
  critical: { icon: '🔴', label: '긴급', color: '#ff4444' },
  danger: { icon: '🟠', label: '위험', color: '#ff8800' },
  warning: { icon: '🟡', label: '주의', color: '#ffaa00' },
};

function mergeMissions(dbMissions: Mission[], defaults: Mission[]): Mission[] {
  const seen = new Set(dbMissions.map(m => `${m.river}:${m.mission_type}`));
  const extra = defaults.filter(d => !seen.has(`${d.river}:${d.mission_type}`));
  return [...dbMissions, ...extra];
}

export default function DoPage() {
  const { t, i18n } = useTranslation();
  const { data: missions, loading: missionsLoading } = useQuery<Mission>('geosigi_missions', {
    eq: { column: 'status', value: 'active' },
    order: { column: 'created_at', ascending: false },
  });
  const { data: readings, loading: readingsLoading } = useQuery<RiverReading>('river_readings', {
    select: 'id,station,river,water_level,level_ratio,status,measured_at',
    order: { column: 'measured_at', ascending: false },
    limit: 5,
  });
  const { data: alerts, loading: alertsLoading } = useQuery<FloodAlert>('flood_alerts', {
    order: { column: 'collected_at', ascending: false },
    limit: 10,
  });

  const lang = i18n.language;
  const allMissions = mergeMissions(missions, DEFAULT_MISSIONS);

  const rivers = [...new Set(allMissions.map(m => m.river))];

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('do.title')}</h2>
        <p className="page-subtitle">{t('do.subtitle')}</p>
      </div>

      {!alertsLoading && alerts.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #2a1a1a, #1a0a0a)',
          border: '1px solid #ff4444',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#ff6b6b', marginBottom: 8 }}>
            🚨 {t('do.floodAlert', '침수 위험 경보')}
          </div>
          {alerts.map((a) => {
            const style = ALERT_STYLES[a.alert_level] || ALERT_STYLES.warning;
            return (
              <div key={a.id} style={{ fontSize: 13, lineHeight: 1.6, color: '#ddd' }}>
                {style.icon} <strong style={{ color: style.color }}>[{style.label}]</strong>{' '}
                {a.station} ({a.river}) — {a.message}
              </div>
            );
          })}
          <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
            {alerts[0]?.issued_at && new Date(alerts[0].issued_at).toLocaleString('ko-KR')}
          </div>
        </div>
      )}

      <h3 className="section-title">{t('do.missions')}</h3>
      <p style={{ fontSize: 13, color: '#888', margin: '-4px 0 12px' }}>
        {rivers.length}개 하천 · {allMissions.length}개 미션
      </p>
      <div className="mission-list">
        {missionsLoading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          allMissions.map((m) => (
            <div key={m.id} className="mission-card">
              <span className="mission-icon">{MISSION_ICONS[m.mission_type] || '🌿'}</span>
              <div className="mission-info">
                <strong>{lang === 'ko' ? m.title_ko : (m.title_en || m.title_ko)}</strong>
                <span className="mission-location">📍 {m.river}</span>
              </div>
              <a
                href={MISSION_LINKS[m.mission_type] || 'https://dorimchun-ai.pages.dev/report'}
                target="_blank"
                rel="noopener noreferrer"
                className="join-btn"
                style={{ textDecoration: 'none' }}
              >{t('do.join')}</a>
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
                <strong>{r.station} ({r.river})</strong>
                <span className="mission-location">
                  수위 {r.water_level}m · {r.status || `${r.level_ratio}%`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <a
        href="https://dorimchun-ai.pages.dev/dashboard"
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
