'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

import CartDrawer from '../Cart/CardDrawer';

export default function CartButton() {
  const { getItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = getItemsCount();

  // Evitar hidratación incorrecta
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-black hover:text-blue-700 transition-colors"
        aria-label="Abrir carrito"
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      <CartDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}