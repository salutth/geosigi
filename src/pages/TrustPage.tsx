import { useTranslation } from 'react-i18next';

export default function TrustPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('trust.title')}</h2>
        <p className="page-subtitle">{t('trust.subtitle')}</p>
      </div>

      <div className="trust-cards">
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
