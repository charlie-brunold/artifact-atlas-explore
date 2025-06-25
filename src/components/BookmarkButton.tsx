
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCollections } from '@/hooks/useCollections';

interface BookmarkButtonProps {
  artifactId: number;
  artifactTitle: string;
  artifact: any;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  onLoginRequired?: () => void;
}

const BookmarkButton = ({ 
  artifactId, 
  artifactTitle, 
  artifact,
  size = 'default', 
  variant = 'outline',
  onLoginRequired 
}: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { isInCollection, addToCollection, removeFromCollection, loading } = useCollections();
  const { toast } = useToast();
  const { t } = useTranslation();

  const isBookmarked = isInCollection(artifactId);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    if (loading) return;

    if (isBookmarked) {
      const { error } = await removeFromCollection(artifactId);
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el marcador",
          variant: "destructive"
        });
      } else {
        toast({
          title: t('notifications.bookmarkRemoved'),
          description: t('notifications.bookmarkRemovedDesc', { title: artifactTitle }),
        });
      }
    } else {
      const { error } = await addToCollection(artifact);
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo agregar el marcador",
          variant: "destructive"
        });
      } else {
        toast({
          title: t('notifications.bookmarkAdded'),
          description: t('notifications.bookmarkAddedDesc', { title: artifactTitle }),
        });
      }
    }
  };

  if (!user) {
    return (
      <Button
        onClick={toggleBookmark}
        size={size}
        variant={variant}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        {size !== 'sm' && 'Iniciar Sesión'}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleBookmark}
      size={size}
      variant={variant}
      disabled={loading}
      className={`flex items-center gap-2 ${isBookmarked ? 'text-teal-600 border-teal-600' : ''}`}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {size !== 'sm' && (isBookmarked ? t('actions.bookmarked') : t('actions.bookmark'))}
    </Button>
  );
};

export default BookmarkButton;
