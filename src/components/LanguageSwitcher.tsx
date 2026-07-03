import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[1];

  return (
    <div className="lang-switcher">
      <button
        className="lang-btn"
        onClick={() => setOpen(!open)}
        aria-label="Change language"
      >
        {current.flag} {current.code.toUpperCase()}
      </button>
      {open && (
        <ul className="lang-dropdown">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                className={`lang-option ${lang.code === i18n.language ? 'selected' : ''}`}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setOpen(false);
                }}
              >
                {lang.flag} {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
