"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {  Menu, X, User } from "lucide-react";
import CartButton from "@/components/Cart/CartButton";
import logo from "../../public/logo.jpeg";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link
              href="/products
            "
              className="flex-shrink-0 flex items-center"
            >
              <Image
                src={logo} // Reemplaza con tu logo
                alt="Logo"
                width={40}
                height={40}
                className="block h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold">FakeStore</span>
            </Link>

            {/* Navegación en desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Inicio
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Productos
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Categorías
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Nosotros
              </Link>
            </div>
          </div>

          {/* Búsqueda, carrito y usuario en desktop */}
          <div className="hidden md:flex items-center">
            {/* Carrito */}
            <CartButton />

            {/* Usuario */}
            <div className="ml-4">
              <button className="p-2 rounded-full text-gray-600 hover:text-black transition-colors">
                <User size={24} />
              </button>
            </div>
          </div>

          {/* Botón de menú móvil */}
          <div className="flex md:hidden items-center">
            <CartButton />

            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Productos
          </Link>
          <Link
            href="/categories"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Categorías
          </Link>
          <Link
            href="/about"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
        </div>

        {/* Buscar en móvil */}
        <div className="pt-2 pb-3 px-4"></div>

        {/* Usuario móvil */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Usuario</div>
              <div className="text-sm font-medium text-gray-500">
                usuario@ejemplo.com
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Tu Perfil
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Configuración
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => {
                // Implementar lógica de cierre de sesión
                setIsMenuOpen(false);
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
