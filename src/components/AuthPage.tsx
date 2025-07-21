
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthCard } from './auth/AuthCard';
import LanguageSwitcher from './LanguageSwitcher';
import emzingoLogo from '@/assets/emzingo-logo.png';

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.backToCatalog')}
          </Button>
          <LanguageSwitcher />
        </div>

        <AuthCard 
          error={error}
          success={success}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
        
        {/* Footer with partner logo */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <img 
              src={emzingoLogo} 
              alt="Emzingo|U" 
              className="h-4 object-contain opacity-70"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
