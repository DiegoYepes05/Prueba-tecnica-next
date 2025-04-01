'use client';

import { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const total = getCartTotal();

  // Manejar clic fuera para cerrar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevenir scroll en el body cuando el drawer está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Manejar tecla ESC para cerrar
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity">
      <div 
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Tu Carrito</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">Parece que aún no has añadido nada a tu carrito</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  {/* Imagen */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-contain object-center"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="line-clamp-1">
                        <Link 
                          href={`/products/${item.id}`}
                          onClick={onClose}
                          className="hover:text-blue-600"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      {/* Selector de cantidad */}
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      {/* Botón eliminar */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón vaciar carrito */}
              <div className="text-right">
                <button 
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-red-600 inline-flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer con total y botón checkout */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <button 
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
              // Aquí iría la lógica de redirección al checkout
              onClick={() => alert('Redirigiendo al checkout...')}
            >
              Proceder al pago
            </button>
            <div className="mt-3">
              <button 
                onClick={onClose}
                className="w-full text-center py-2 text-gray-600 hover:text-blue-600"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}