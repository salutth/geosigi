import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { key: 'housing', icon: '🏠' },
  { key: 'essentials', icon: '🛒' },
  { key: 'transport', icon: '🚇' },
  { key: 'hospital', icon: '🏥' },
  { key: 'legal', icon: '📋' },
  { key: 'manners', icon: '🙏' },
] as const;

export default function SettlePage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('settle.title')}</h2>
        <p className="page-subtitle">{t('settle.subtitle')}</p>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <button key={cat.key} className="category-card">
            <span className="category-icon">{cat.icon}</span>
            <span className="category-label">
              {t(`settle.categories.${cat.key}`)}
            </span>
          </button>
        ))}
      </div>

      <div className="chatbot-section">
        <button className="chatbot-btn">
          💬 {t('settle.chatbot')}
        </button>
      </div>
    </div>
  );
}
