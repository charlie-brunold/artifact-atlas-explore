
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  artifactId: number;
  artifactTitle: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const BookmarkButton = ({ artifactId, artifactTitle, size = 'default', variant = 'outline' }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('artifact-bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(artifactId));
  }, [artifactId]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem('artifact-bookmarks') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((id: number) => id !== artifactId);
      localStorage.setItem('artifact-bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast({
        title: "Marcador eliminado",
        description: `${artifactTitle} ha sido eliminado de tu colección.`,
      });
    } else {
      const updatedBookmarks = [...bookmarks, artifactId];
      localStorage.setItem('artifact-bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      toast({
        title: "Marcador añadido",
        description: `${artifactTitle} ha sido añadido a tu colección.`,
      });
    }
  };

  return (
    <Button
      onClick={toggleBookmark}
      size={size}
      variant={variant}
      className={`flex items-center gap-2 ${isBookmarked ? 'text-teal-600 border-teal-600' : ''}`}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {size !== 'sm' && (isBookmarked ? 'Guardado' : 'Guardar')}
    </Button>
  );
};

export default BookmarkButton;
