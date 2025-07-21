
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import emzingoLogo from '@/assets/emzingo-logo.png';

const Header = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewCollections = () => {
    navigate('/collections');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span>in partnership with</span>
              <img 
                src={emzingoLogo} 
                alt="Emzingo|U" 
                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {loading ? (
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <UserMenu 
                onViewProfile={handleViewProfile}
                onViewCollections={handleViewCollections}
                onViewHistory={handleViewHistory}
              />
            ) : (
              <Button onClick={handleLogin} variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t('auth.login')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
