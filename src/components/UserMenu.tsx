
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, BookMarked, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface UserMenuProps {
  onViewProfile: () => void;
  onViewCollections: () => void;
  onViewHistory: () => void;
}

const UserMenu = ({ onViewProfile, onViewCollections, onViewHistory }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.email || '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">{t('profile.researcher')}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewProfile}>
          <User className="mr-2 h-4 w-4" />
          {t('profile.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewCollections}>
          <BookMarked className="mr-2 h-4 w-4" />
          {t('profile.myCollections')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewHistory}>
          <History className="mr-2 h-4 w-4" />
          {t('profile.history')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('profile.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
