"use client";

import { useState } from "react";
import { api } from "@/app/api/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Truck, Shield, ArrowLeft, Heart, Share, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext"; // Corregida la ruta de importación
import { toast } from "react-hot-toast"; 
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart } = useCart();
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProductById(id),
  });

  // Manejadores
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.title} añadido al carrito`);
    }
  };
  
  const productInCart = product ? isInCart(product.id) : false;
  
  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (isError) return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar el producto</h2>
        <p className="text-gray-700 mb-4">No pudimos encontrar la información que buscas.</p>
        <Link 
          href="/products" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ver todos los productos
        </Link>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">Producto no encontrado</h2>
        <p className="text-gray-700 mb-4">El producto que estás buscando no existe o ha sido eliminado.</p>
        <Link 
          href="/products" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ver todos los productos
        </Link>
      </div>
    </div>
  );

  



  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navegación */}
      <div className="mb-6">
        <button 
          onClick={() => router.push('/products')} 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Volver a productos</span>
        </button>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Galería de imágenes */}
          <div className="bg-gray-50 p-8 flex items-center justify-center">
            <div className="relative h-[450px] w-full">
              <Image 
                src={product.image} 
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                priority
                className="transition-transform hover:scale-105"
              />
            </div>
          </div>
          
          {/* Información del producto */}
          <div className="p-8 flex flex-col">
            <div className="mb-2">
          
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            

            
            {/* Precio */}
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-black">${product.price.toFixed(2)}</span>
            </div>
            
            {/* Descripción del producto */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Descripción del producto</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Características destacadas */}
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck size={18} className="text-blue-600 mr-2" />
                  <span className="text-gray-700">Envío gratis en pedidos superiores a $50</span>
                </div>
                <div className="flex items-center">
                  <Shield size={18} className="text-blue-600 mr-2" />
                  <span className="text-gray-700">Garantía de 30 días</span>
                </div>
              </div>
            </div>
            
            {/* Selector de cantidad */}
            <div className="flex items-center mb-6">
              <span className="mr-3 text-gray-700 font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1 border-l border-r">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 font-semibold py-3 px-4 rounded-md transition flex items-center justify-center
                  ${productInCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {productInCart ? (
                  <>
                    <Check size={20} className="mr-2" />
                    Añadido al carrito
                  </>
                ) : (
                  'Añadir al carrito'
                )}
              </button>
              <button className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <Heart size={20} className="text-gray-500" />
              </button>
              <button className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <Share size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}