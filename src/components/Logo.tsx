
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import amanoLogo from '@/assets/amano-logo.png';

const Logo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={amanoLogo} 
          alt="Museo AMANO" 
          className="w-10 h-10 object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
      </div>
    </div>
  );
};

export default Logo;
