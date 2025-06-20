
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';

interface CartSummaryProps {
  onViewCart: () => void;
}

const CartSummary = ({ onViewCart }: CartSummaryProps) => {
  const { cartItems, getTotalCost } = useCart();
  const { t } = useTranslation();

  if (cartItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onViewCart}
        className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>{t('actions.researchCart')}</span>
        <Badge variant="secondary" className="ml-2">
          {cartItems.length}
        </Badge>
        <span className="ml-2 font-semibold">
          ${getTotalCost().toLocaleString()} USD
        </span>
      </Button>
    </div>
  );
};

export default CartSummary;
