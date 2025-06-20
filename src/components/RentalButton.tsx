
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';

interface RentalButtonProps {
  artifact: any;
  size?: 'sm' | 'default' | 'lg';
}

const RentalButton = ({ artifact, size = 'default' }: RentalButtonProps) => {
  const { cartItems, addToCart } = useCart();
  const { t } = useTranslation();
  
  const isInCart = cartItems.some(item => item.artifactId === artifact.id);

  if (isInCart) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        {t('actions.inResearchCart')}
      </Badge>
    );
  }

  return (
    <Button 
      onClick={() => addToCart(artifact)}
      size={size}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ShoppingCart className="h-4 w-4" />
      {t('actions.requestResearch')}
    </Button>
  );
};

export default RentalButton;
