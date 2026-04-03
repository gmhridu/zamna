'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Package,
  Cog,
  Palette,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import type { Product, Category } from '@/types';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

const HERO_SLIDES = [
  {
    title: 'Premium Sewing Machines',
    subtitle: 'Discover the perfect machine for your craft',
    cta: 'Shop Now',
    gradient: 'from-[#0F766E] via-[#14B8A6] to-[#2DD4BF]',
    accent: 'Singer, Brother, Juki & More',
  },
  {
    title: 'Embroidery Collection',
    subtitle: 'Create stunning designs with professional machines',
    cta: 'Explore Collection',
    gradient: 'from-[#1A1A2E] via-[#2D2D4E] to-[#1E293B]',
    accent: 'Free delivery on orders above Rs. 50,000',
  },
  {
    title: 'Accessories & Parts',
    subtitle: 'Everything you need for your sewing projects',
    cta: 'Browse Accessories',
    gradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FCD34D]',
    accent: 'Quality tools at affordable prices',
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'sewing-machines': Scissors,
  'overlock-machines': Package,
  'embroidery-machines': Palette,
  'accessories-parts': Cog,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'sewing-machines': 'from-[#0F766E] to-[#14B8A6]',
  'overlock-machines': 'from-[#F59E0B] to-[#FBBF24]',
  'embroidery-machines': 'from-[#8B5CF6] to-[#A78BFA]',
  'accessories-parts': 'from-[#EC4899] to-[#F472B6]',
};

export default function HomePage() {
  const { navigate, navigateToCategory } = useNavigationStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/products?includeCategories=true'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-slide hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      sku: product.sku,
      slug: product.slug,
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="animate-slide-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[400px] sm:h-[480px] lg:h-[540px]">
          {HERO_SLIDES.map((slide, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.05,
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} flex items-center`}
              style={{ zIndex: index === currentSlide ? 1 : 0 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {slide.accent}
                    </Badge>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base sm:text-lg text-white/90 mb-6"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-[#0F766E] hover:bg-gray-100 font-semibold text-base px-8 shadow-lg"
                      onClick={() => navigate('shop')}
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              {/* Decorative shapes */}
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
                <div className="absolute right-10 top-20 w-64 h-64 rounded-full border-4 border-white" />
                <div className="absolute right-40 top-40 w-40 h-40 rounded-full border-4 border-white" />
                <div className="absolute right-20 bottom-20 w-80 h-80 rounded-full border-4 border-white" />
              </div>
            </motion.div>
          ))}

          {/* Slide navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 50K' },
              { icon: Shield, title: 'Genuine Products', desc: '100% authentic brands' },
              { icon: Headphones, title: 'Customer Support', desc: 'Available 7 days a week' },
              { icon: Star, title: 'Best Prices', desc: 'Competitive rates in PK' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#0F766E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-500">
              Find the perfect machine for your needs
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, index) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Scissors;
              const gradient = CATEGORY_GRADIENTS[cat.slug] || 'from-gray-500 to-gray-400';
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="category-card-modern"
                    onClick={() => navigateToCategory(cat.id, cat.slug)}
                  >
                    <div
                      className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 flex flex-col items-center justify-center min-h-[160px]`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm sm:text-base text-center">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-xs mt-1">
                        {cat._count?.products || 0} Products
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Featured Products
              </h2>
              <p className="text-gray-500">
                Hand-picked bestsellers for you
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden sm:flex border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
              onClick={() => navigate('shop')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="product-card-modern">
                    <div
                      className="product-img-wrapper relative bg-slate-50 aspect-square flex items-center justify-center p-6 cursor-pointer"
                      onClick={() => {
                        useNavigationStore.getState().navigateToProduct(product.slug);
                      }}
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`hidden absolute inset-0 flex flex-col items-center justify-center bg-slate-100 ${!product.imageUrl ? '!flex' : ''}`}>
                        <Scissors className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">No image</p>
                      </div>
                      {product.featured && (
                        <Badge className="absolute top-3 left-3 bg-[#0F766E] text-white text-[10px] z-10">
                          Featured
                        </Badge>
                      )}
                      {/* Hover actions overlay */}
                      <div className="product-actions absolute bottom-0 left-0 right-0 p-3 z-10">
                        <button
                          className="w-full bg-[#0F766E]/90 hover:bg-[#0D6560] text-white rounded-xl backdrop-blur-sm py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {product.category && (
                        <p className="text-xs text-[#0F766E] font-medium mb-1">
                          {product.category.name}
                        </p>
                      )}
                      <h3
                        className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-[#0F766E] transition-colors"
                        onClick={() => {
                          useNavigationStore.getState().navigateToProduct(product.slug);
                        }}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                        <Button
                          size="sm"
                          className="bg-[#0F766E] hover:bg-[#0D6560] text-white h-8 px-3"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              className="border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
              onClick={() => navigate('shop')}
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Need Help Choosing?
            </h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Our expert team is here to help you find the perfect sewing machine
              for your needs and budget.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#0F766E] hover:bg-gray-100 font-semibold"
              onClick={() => navigate('contact')}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
