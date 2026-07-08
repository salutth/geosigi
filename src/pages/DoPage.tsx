import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

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

const DEFAULT_MISSIONS: Mission[] = [
  { id: -1, title_ko: '도림천 수질 측정', title_en: 'Dorimcheon Water Quality', mission_type: 'water_quality', river: '도림천', status: 'active' },
  { id: -2, title_ko: '안양천 생물 관찰', title_en: 'Anyangcheon Species Observation', mission_type: 'species_observation', river: '안양천', status: 'active' },
  { id: -3, title_ko: '청계천 수질 측정', title_en: 'Cheonggyecheon Water Quality', mission_type: 'water_quality', river: '청계천', status: 'active' },
  { id: -4, title_ko: '중랑천 생태교란종 모니터링', title_en: 'Jungnangcheon Invasive Species', mission_type: 'invasive_species', river: '중랑천', status: 'active' },
  { id: -5, title_ko: '탄천 수질 측정', title_en: 'Tancheon Water Quality', mission_type: 'water_quality', river: '탄천', status: 'active' },
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

function ReportForm({ mission, onClose, lang }: { mission: Mission; onClose: () => void; lang: string }) {
  const { t } = useTranslation();
  const [species, setSpecies] = useState('');
  const [observer, setObserver] = useState('');
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const handleSubmit = async () => {
    if (!species.trim()) return;
    setSubmitting(true);
    try {
      const row: Record<string, unknown> = {
        taxon_name: species.trim(),
        river: mission.river,
        source: 'geosigi',
        observer: observer.trim() || null,
        memo: memo.trim() || null,
      };
      if (gps) {
        row.latitude = gps.lat;
        row.longitude = gps.lng;
      }
      const { error } = await supabase.from('species_observations').insert([row]);
      setResult(error ? 'error' : 'success');
    } catch {
      setResult('error');
    }
    setSubmitting(false);
  };

  if (result === 'success') {
    return (
      <div className="report-form-overlay" onClick={onClose}>
        <div className="report-form" onClick={e => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t('do.reportSuccess')}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16 }}>
              📍 {mission.river} · {species}
            </div>
            <button className="submit-btn" onClick={onClose}>{t('common.confirm')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-form-overlay" onClick={onClose}>
      <div className="report-form" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            {MISSION_ICONS[mission.mission_type] || '🌿'} {t('do.reportTitle')}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div className="form-field">
          <label>{t('do.river')}</label>
          <div className="form-value">📍 {mission.river}</div>
        </div>

        <div className="form-field">
          <label>{t('do.missionType')}</label>
          <div className="form-value">{lang === 'ko' ? mission.title_ko : (mission.title_en || mission.title_ko)}</div>
        </div>

        <div className="form-field">
          <label>{t('do.speciesName')} *</label>
          <input
            type="text"
            className="form-input"
            value={species}
            onChange={e => setSpecies(e.target.value)}
            placeholder={t('do.speciesPlaceholder')}
          />
        </div>

        <div className="form-field">
          <label>{t('do.observer')}</label>
          <input
            type="text"
            className="form-input"
            value={observer}
            onChange={e => setObserver(e.target.value)}
            placeholder={t('do.observerPlaceholder')}
          />
        </div>

        <div className="form-field">
          <label>{t('do.memo')}</label>
          <textarea
            className="form-input form-textarea"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder={t('do.memoPlaceholder')}
            rows={3}
          />
        </div>

        <div className="form-field">
          <label>GPS</label>
          <div className="form-value" style={{ fontSize: 12 }}>
            {gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : t('do.gpsWaiting')}
          </div>
        </div>

        {result === 'error' && (
          <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 8 }}>{t('common.error')}</div>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting || !species.trim()}
        >
          {submitting ? t('common.loading') : t('do.submit')}
        </button>
      </div>
    </div>
  );
}

export default function DoPage() {
  const { t, i18n } = useTranslation();
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
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
              <button
                className="join-btn"
                onClick={() => setActiveMission(m)}
              >{t('do.join')}</button>
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

      {activeMission && (
        <ReportForm
          mission={activeMission}
          onClose={() => setActiveMission(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
