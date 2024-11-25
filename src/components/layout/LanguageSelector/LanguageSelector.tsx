import React from 'react';

export interface LanguageSelectorProps {
  currentLanguage?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage = 'en-AU' 
}) => {
  const languages = [
    { code: 'en-AU', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'ko', label: '한국어' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'it', label: 'Italiano' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'tl', label: 'Tagalog' },
    { code: 'yue', label: '粵語' }
  ];

  return (
    <div className="relative inline-block text-left">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        name="language"
        value={currentLanguage}
        onChange={(e) => {
          // Language change handler will be implemented later
          console.log('Language changed to:', e.target.value);
        }}
        className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Select language"
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
