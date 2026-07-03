import { useTranslation } from 'react-i18next';
import { useQuery } from '../hooks/useSupabase';

interface TrustedSource {
  id: number;
  name_ko: string;
  name_en: string;
  category: string;
  url: string;
  phone: string;
  description_ko: string;
  description_en: string;
  is_official: boolean;
}

export default function TrustPage() {
  const { t, i18n } = useTranslation();
  const { data: sources, loading } = useQuery<TrustedSource>('geosigi_trusted_sources', {
    order: { column: 'created_at', ascending: true },
  });
  const lang = i18n.language;

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('trust.title')}</h2>
        <p className="page-subtitle">{t('trust.subtitle')}</p>
      </div>

      <div className="trust-cards">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : sources.length === 0 ? (
          <>
            <div className="info-card verified">
              <span className="card-badge">✅ {t('trust.verified')}</span>
              <h3>1345</h3>
              <p>외국인종합안내센터 / Foreigner Help Center</p>
            </div>
            <div className="info-card verified">
              <span className="card-badge">✅ {t('trust.verified')}</span>
              <h3>Hi Korea</h3>
              <p>immigration.go.kr</p>
            </div>
          </>
        ) : (
          sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div className={`info-card ${s.is_official ? 'verified' : 'warning'}`}>
                <span className="card-badge">
                  {s.is_official ? `✅ ${t('trust.verified')}` : `⚠️ ${t('trust.warning')}`}
                </span>
                <h3>{lang === 'ko' ? s.name_ko : (s.name_en || s.name_ko)}</h3>
                <p>{lang === 'ko' ? s.description_ko : (s.description_en || s.description_ko)}</p>
                {s.phone && <p style={{ marginTop: 4, color: 'var(--accent)' }}>📞 {s.phone}</p>}
              </div>
            </a>
          ))
        )}

        <div className="info-card warning">
          <span className="card-badge">⚠️ {t('trust.warning')}</span>
          <p>{t('trust.subtitle')}</p>
        </div>
      </div>

      <button className="report-btn">
        📞 {t('trust.reportScam')}
      </button>
    </div>
  );
}
