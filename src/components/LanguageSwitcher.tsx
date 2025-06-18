
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'ja', flag: '🇯🇵', name: '日本語' }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => changeLanguage(lang.code)}
          className={`p-2 h-auto ${
            i18n.language === lang.code 
              ? 'opacity-100 bg-accent' 
              : 'opacity-70 hover:opacity-100'
          }`}
          title={lang.name}
        >
          <span className="text-lg">{lang.flag}</span>
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
