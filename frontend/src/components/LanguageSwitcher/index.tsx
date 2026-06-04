import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const languageOptions = [
  { value: 'vi', label: '🇻🇳 Tiếng Việt' },
  { value: 'en', label: '🇺🇸 English' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      options={languageOptions}
      size="small"
      className="min-w-[140px]"
      popupMatchSelectWidth={false}
    />
  );
};

export default LanguageSwitcher;
