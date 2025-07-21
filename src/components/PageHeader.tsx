
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backPath?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ 
  title, 
  description, 
  showBackButton = true, 
  backPath = '/',
  children 
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate(backPath);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleHome}>
              <Home className="h-4 w-4 mr-2" />
              {t('breadcrumbs.home')}
            </Button>
          </div>
          <LanguageSwitcher />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
