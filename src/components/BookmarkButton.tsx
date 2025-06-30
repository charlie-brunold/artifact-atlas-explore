
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCollections } from '@/hooks/useCollections';
import { useNavigate } from 'react-router-dom';

interface BookmarkButtonProps {
  artifactId: number;
  artifactTitle: string;
  artifact?: any;
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
  const navigate = useNavigate();

  const isBookmarked = isInCollection(artifactId);

  const handleAuthRequired = () => {
    if (onLoginRequired) {
      onLoginRequired();
    } else {
      toast({
        title: "Iniciar Sesión Requerido",
        description: "Crea una cuenta para guardar tus artefactos favoritos y gestionar tu colección de investigación.",
        action: (
          <Button 
            size="sm" 
            onClick={() => navigate('/auth')}
            className="ml-2"
          >
            Crear Cuenta
          </Button>
        ),
      });
    }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      handleAuthRequired();
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
      const artifactToSave = artifact || {
        id: artifactId,
        title: artifactTitle,
        accessionNumber: `ACC-${artifactId}`
      };
      
      const { error } = await addToCollection(artifactToSave);
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
        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
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
      className={`flex items-center gap-2 transition-colors ${
        isBookmarked 
          ? 'text-teal-600 border-teal-600 hover:bg-teal-50' 
          : 'hover:bg-primary hover:text-primary-foreground'
      }`}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {size !== 'sm' && (isBookmarked ? t('actions.bookmarked') : t('actions.bookmark'))}
    </Button>
  );
};

export default BookmarkButton;
