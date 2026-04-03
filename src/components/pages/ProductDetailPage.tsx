'use client';

import { useReducer, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Scissors,
  Package,
  Truck,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import type { Product } from '@/types';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

interface State {
  product: Product | null;
  quantity: number;
  imgError: boolean;
  fetchedSlug: string | null;
  loading: boolean;
}

type Action =
  | { type: 'FETCH_START'; slug: string }
  | { type: 'FETCH_SUCCESS'; slug: string; product: Product | null }
  | { type: 'SET_QUANTITY'; quantity: number }
  | { type: 'SET_IMG_ERROR' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, product: null, imgError: false, quantity: 1, fetchedSlug: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.product, fetchedSlug: action.slug };
    case 'SET_QUANTITY':
      return { ...state, quantity: action.quantity };
    case 'SET_IMG_ERROR':
      return { ...state, imgError: true };
    default:
      return state;
  }
}

const initialState: State = {
  product: null,
  quantity: 1,
  imgError: false,
  fetchedSlug: null,
  loading: true,
};

export default function ProductDetailPage() {
  const { productSlug, navigate, navigateToCategory } = useNavigationStore();
  const addItemWithQuantity = useCartStore((s) => s.addItemWithQuantity);
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProduct = useCallback((slug: string) => {
    dispatch({ type: 'FETCH_START', slug });
    fetch(`/api/products?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', slug, product: data.product || null }))
      .catch(() => dispatch({ type: 'FETCH_SUCCESS', slug, product: null }));
  }, []);

  useEffect(() => {
    if (!productSlug) return;
    if (productSlug === state.fetchedSlug) return;
    fetchProduct(productSlug);
  }, [productSlug, state.fetchedSlug, fetchProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productSlug]);

  const handleAddToCart = () => {
    if (!state.product) return;
    addItemWithQuantity(
      {
        productId: state.product.id,
        title: state.product.title,
        price: state.product.price,
        imageUrl: state.product.imageUrl,
        sku: state.product.sku,
        slug: state.product.slug,
      },
      state.quantity
    );
    toast.success(`${state.product.title} added to cart!`, {
      description: `${state.quantity} item${state.quantity > 1 ? 's' : ''} added`,
    });
  };

  if (state.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="h-80 lg:h-[500px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!state.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-slide-in">
        <Scissors className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          className="bg-[#0F766E] hover:bg-[#0D6560] text-white"
          onClick={() => navigate('shop')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-slide-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate('home')}
          className="hover:text-[#0F766E] transition-colors"
        >
          Home
        </button>
        <span>/</span>
        {state.product.category && (
          <>
            <button
              onClick={() =>
                navigateToCategory(state.product!.category!.id, state.product!.category!.slug)
              }
              className="hover:text-[#0F766E] transition-colors"
            >
              {state.product.category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 truncate max-w-[200px]">
          {state.product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-slate-50 rounded-2xl border border-gray-200 overflow-hidden h-80 sm:h-96 lg:h-[500px] flex items-center justify-center"
        >
          {state.product.imageUrl && !state.imgError ? (
            <Image
              src={state.product.imageUrl}
              alt={state.product.title}
              width={500}
              height={500}
              className="object-contain h-full w-full p-6"
              onError={() => dispatch({ type: 'SET_IMG_ERROR' })}
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Scissors className="h-20 w-20 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Image not available</p>
            </div>
          )}
          {state.product.featured && (
            <Badge className="absolute top-4 left-4 bg-[#0F766E] text-white">
              Featured
            </Badge>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {state.product.category && (
            <button
              onClick={() =>
                navigateToCategory(state.product!.category!.id, state.product!.category!.slug)
              }
              className="inline-flex self-start"
            >
              <Badge
                variant="secondary"
                className="text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1] cursor-pointer mb-3"
              >
                {state.product.category.name}
              </Badge>
            </button>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {state.product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs text-gray-400">SKU: {state.product.sku}</p>
          </div>

          <p className="text-3xl font-bold text-[#0F766E] mb-6">
            {formatPrice(state.product.price)}
          </p>

          <Separator className="mb-6" />

          <p className="text-gray-600 leading-relaxed mb-8">
            {state.product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-900">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => dispatch({ type: 'SET_QUANTITY', quantity: Math.max(1, state.quantity - 1) })}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{state.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => dispatch({ type: 'SET_QUANTITY', quantity: state.quantity + 1 })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="bg-[#0F766E] hover:bg-[#0D6560] text-white h-12 text-base font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <Separator className="my-6" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Across Pakistan' },
              { icon: Shield, title: 'Genuine', desc: '100% Authentic' },
              { icon: Package, title: 'Warranty', desc: 'Brand Warranty' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-[#0F766E]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{title}</p>
                  <p className="text-[10px] text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Shop */}
          <Button
            variant="ghost"
            className="mt-6 text-gray-600 hover:text-[#0F766E] self-start"
            onClick={() => navigate('shop')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
