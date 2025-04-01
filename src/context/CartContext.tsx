'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';

// Definir la estructura de un item del carrito
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

// Definir la interfaz del contexto
interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  isInCart: (productId: number) => boolean;
}

// Crear el contexto con un valor inicial undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  // Añadir item al carrito
  const addItem = (product: any, quantity: number = 1) => {
    setItems(currentItems => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Si existe, actualizar la cantidad
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Si no existe, añadir el nuevo producto
        return [...currentItems, {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
          category: product.category
        }];
      }
    });
  };

  // Eliminar item del carrito
  const removeItem = (productId: number) => {
    setItems(currentItems => 
      currentItems.filter(item => item.id !== productId)
    );
  };

  // Actualizar cantidad de un item
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Limpiar el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Contar items en el carrito (total de productos)
  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  // Valor del contexto
  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemsCount,
    isInCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}