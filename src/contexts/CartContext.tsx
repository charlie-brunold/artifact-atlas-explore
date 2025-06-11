
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  artifactId: number;
  title: string;
  accessionNumber: string;
  rentalPeriod: {
    startDate: Date | null;
    endDate: Date | null;
    duration: 'daily' | 'weekly' | 'monthly';
  };
  specialRequirements: string;
  estimatedCost: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (artifact: any) => void;
  removeFromCart: (artifactId: number) => void;
  updateRentalPeriod: (artifactId: number, period: CartItem['rentalPeriod']) => void;
  updateSpecialRequirements: (artifactId: number, requirements: string) => void;
  clearCart: () => void;
  getTotalCost: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (artifact: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.artifactId === artifact.id);
      if (existingItem) return prev;
      
      return [...prev, {
        artifactId: artifact.id,
        title: artifact.title,
        accessionNumber: artifact.accessionNumber,
        rentalPeriod: {
          startDate: null,
          endDate: null,
          duration: 'weekly'
        },
        specialRequirements: '',
        estimatedCost: 450 // Base weekly rate for academic research
      }];
    });
  };

  const removeFromCart = (artifactId: number) => {
    setCartItems(prev => prev.filter(item => item.artifactId !== artifactId));
  };

  const updateRentalPeriod = (artifactId: number, period: CartItem['rentalPeriod']) => {
    setCartItems(prev => prev.map(item => 
      item.artifactId === artifactId 
        ? { ...item, rentalPeriod: period, estimatedCost: calculateCost(period.duration) }
        : item
    ));
  };

  const updateSpecialRequirements = (artifactId: number, requirements: string) => {
    setCartItems(prev => prev.map(item => 
      item.artifactId === artifactId ? { ...item, specialRequirements: requirements } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.estimatedCost, 0);
  };

  const calculateCost = (duration: 'daily' | 'weekly' | 'monthly') => {
    switch (duration) {
      case 'daily': return 75;
      case 'weekly': return 450;
      case 'monthly': return 1500;
      default: return 450;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateRentalPeriod,
      updateSpecialRequirements,
      clearCart,
      getTotalCost
    }}>
      {children}
    </CartContext.Provider>
  );
};
