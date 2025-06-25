
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

interface HeaderProps {
  onLogin: () => void;
  onViewProfile: () => void;
  onViewCollections: () => void;
  onViewHistory: () => void;
}

const Header = ({ onLogin, onViewProfile, onViewCollections, onViewHistory }: HeaderProps) => {
  const { user, loading } = useAuth();

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {loading ? (
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <UserMenu 
                onViewProfile={onViewProfile}
                onViewCollections={onViewCollections}
                onViewHistory={onViewHistory}
              />
            ) : (
              <Button onClick={onLogin} variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
