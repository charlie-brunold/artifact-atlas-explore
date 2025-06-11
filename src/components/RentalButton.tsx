
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface RentalButtonProps {
  artifact: any;
  size?: 'sm' | 'default' | 'lg';
}

const RentalButton = ({ artifact, size = 'default' }: RentalButtonProps) => {
  const { cartItems, addToCart } = useCart();
  
  const isInCart = cartItems.some(item => item.artifactId === artifact.id);

  if (isInCart) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        En Carrito de Investigación
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
      Solicitar para Investigación
    </Button>
  );
};

export default RentalButton;
