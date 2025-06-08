'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMobile } from '@/hooks/use-mobile';

export default function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='font-playfair text-2xl font-bold text-pink-600'>
              Umi Candles
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link
              href='/products'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/products') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              Shop
            </Link>
            <Link
              href='/my-orders'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/products') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              My Orders
            </Link>
            <Link
              href='/track-order'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/products') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              Track Order
            </Link>
            <Link
              href='/about'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/about') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link
              href='/event-planning'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/event-planning') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              Event Planning
            </Link>
            <Link
              href='/contact'
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive('/contact') ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className='flex items-center space-x-4'>
            <Link href='/cart' className='relative'>
              <ShoppingBag className='h-6 w-6 text-gray-600 hover:text-pink-600 transition-colors' />
              {itemCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className='md:hidden text-gray-600 hover:text-pink-600 transition-colors'
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden mt-4 py-4 border-t border-gray-100'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href='/'
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActive('/') ? 'text-pink-600' : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href='/products'
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActive('/products') ? 'text-pink-600' : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link
                href='/about'
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActive('/about') ? 'text-pink-600' : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href='/event-planning'
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActive('/event-planning')
                    ? 'text-pink-600'
                    : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                Event Planning
              </Link>
              <Link
                href='/contact'
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActive('/contact') ? 'text-pink-600' : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
