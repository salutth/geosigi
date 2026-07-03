import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', key: 'settle', icon: '🏠' },
  { path: '/trust', key: 'trust', icon: '🛡️' },
  { path: '/do', key: 'do', icon: '🔬' },
  { path: '/people', key: 'people', icon: '👥' },
  { path: '/story', key: 'story', icon: '📖' },
] as const;

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
          end={tab.path === '/'}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{t(`tabs.${tab.key}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
