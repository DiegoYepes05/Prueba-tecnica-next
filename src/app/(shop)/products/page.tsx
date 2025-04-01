'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/api';
import { ProductsResponse } from '@/interface/ProductsResponse';
import { Star, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem, isInCart } = useCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Products"],
    queryFn: () => api.getAllProducts(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleAddToCart = (e:any, product:any) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Prevenir propagación
    addItem(product, 1);
    toast.success(`${product.title} añadido al carrito`);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (isError) return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar productos</h2>
        <p className="text-gray-700">No pudimos cargar los productos. Por favor, intenta nuevamente más tarde.</p>
      </div>
    </div>
  );
  
  if (!data || data.length === 0) return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">No hay productos disponibles</h2>
        <p className="text-gray-700">No encontramos productos para mostrar en este momento.</p>
      </div>
    </div>
  );

  // Obtener categorías únicas
  const categoriesSet = new Set<string>();
  categoriesSet.add("All");
  
  data.forEach((product: ProductsResponse) => {
    if (typeof product.category === 'string') {
      categoriesSet.add(product.category);
    }
  });
  
  const categories = Array.from(categoriesSet);
  
  // Filtrar productos por categoría
  const filteredProducts = activeCategory === "All" 
    ? data 
    : data.filter((p: ProductsResponse) => p.category === activeCategory);

  // Formatear nombre de categoría para mostrarla con mejor formato
  const formatCategory = (category: string) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Todos los Productos</h1>
      
      {/* Filtros de categoría */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Filtrar por categoría</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium
                ${activeCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                transition-all
              `}
            >
              {category === "All" ? "Todas" : formatCategory(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: ProductsResponse, index: number) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className={`
              group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
            style={{
              transitionDelay: `${index * 30}ms`,
            }}
          >
            {/* Imagen de producto */}
            <div className="aspect-square bg-gray-50 p-4 relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-2"
              />
              
              {/* Botón de añadir al carrito superpuesto */}
              <button 
                onClick={(e) => handleAddToCart(e, product)}
                className={`
                  absolute bottom-2 right-2 p-2 rounded-full 
                  ${isInCart(product.id) 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                  shadow-md opacity-0 group-hover:opacity-100 transition-opacity
                `}
                aria-label="Añadir al carrito"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
            
            {/* Info del producto */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Categoría */}
              <div className="mb-1">
                <span className="text-xs text-gray-500 capitalize">{product.category}</span>
              </div>
              
              {/* Título */}
              <h2 className="font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.title}
              </h2>
              
             
              
              {/* Descripción corta */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1">
                {product.description}
              </p>
              
              {/* Precio */}
              <div className="mt-auto">
                <span className="text-lg font-bold text-black">${product.price.toFixed(2)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Mensaje cuando no hay productos en la categoría seleccionada */}
      {filteredProducts.length === 0 && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center my-8">
          <h2 className="text-lg font-semibold text-yellow-600 mb-2">No hay productos en esta categoría</h2>
          <p className="text-gray-700 mb-4">Prueba seleccionando otra categoría</p>
          <button 
            onClick={() => setActiveCategory("All")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;