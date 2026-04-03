'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Home,
  Store,
  Phone,
  Scissors,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartItemCount } from '@/stores/cart-store';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Header() {
  const { navigate, navigateToCategory } = useNavigationStore();
  const itemCount = useCartItemCount();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/products?includeCategories=true')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('shop');
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('shop-search', { detail: searchQuery.trim() })
        );
      }, 100);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, action: () => navigate('home') },
    {
      label: 'Shop',
      icon: Store,
      hasDropdown: true,
    },
    { label: 'Contact', icon: Phone, action: () => navigate('contact') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-[#0F766E] text-white text-center text-xs py-1.5 px-4">
        Free delivery on orders above Rs. 50,000 across Pakistan 🚚
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Logo in mobile menu */}
                <div className="p-4 border-b">
                  <button
                    onClick={() => navigate('home')}
                    className="flex items-center gap-1"
                  >
                    <Scissors className="h-6 w-6 text-[#0F766E]" />
                    <div>
                      <span className="text-xl font-extrabold tracking-wider text-[#0F766E]">
                        ZAMANA
                      </span>
                      <span className="block text-[10px] tracking-[0.2em] text-gray-500 -mt-1">
                        STORE
                      </span>
                    </div>
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-2">
                  {navItems.map((item) =>
                    item.hasDropdown ? (
                      <div key={item.label} className="px-2">
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                          {item.label}
                        </p>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() =>
                              navigateToCategory(cat.id, cat.slug)
                            }
                            className="w-full text-left px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F766E] transition-colors"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0F766E] transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    )
                  )}
                  <Separator className="my-2" />
                  <button
                    onClick={() => navigate('order-tracking')}
                    className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0F766E] transition-colors"
                  >
                    Track Order
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 select-none"
          >
            <Scissors className="h-6 w-6 text-[#0F766E]" />
            <div>
              <span className="text-xl font-extrabold tracking-wider text-[#0F766E]">
                ZAMANA
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-gray-500 -mt-1">
                STORE
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-[#0F766E] hover:bg-[#F0FDFA]"
              onClick={() => navigate('home')}
            >
              Home
            </Button>

            {/* Shop dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-[#0F766E] hover:bg-[#F0FDFA] gap-1"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              >
                Shop
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    shopDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <AnimatePresence>
                {shopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                  >
                    <button
                      onClick={() => {
                        navigate('shop');
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-colors"
                    >
                      All Products
                    </button>
                    <Separator className="my-1" />
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigateToCategory(cat.id, cat.slug);
                          setShopDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-[#0F766E] hover:bg-[#F0FDFA]"
              onClick={() => navigate('contact')}
            >
              Contact
            </Button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search products..."
                    className="h-9 w-full text-sm border-[#0F766E]/30 focus-visible:ring-[#0F766E]/30"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#F0FDFA] hover:text-[#0F766E]"
              onClick={() => {
                if (searchOpen) {
                  handleSearch();
                } else {
                  setSearchOpen(true);
                }
              }}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#F0FDFA] hover:text-[#0F766E] relative"
              onClick={() => navigate('cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-[#0F766E] text-white border-2 border-white cart-badge-pulse">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
