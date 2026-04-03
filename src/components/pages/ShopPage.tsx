'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  Scissors,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import type { Product, Category } from '@/types';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

const PRICE_RANGES = [
  { label: 'Under Rs. 1,000', min: 0, max: 1000 },
  { label: 'Rs. 1,000 - Rs. 10,000', min: 1000, max: 10000 },
  { label: 'Rs. 10,000 - Rs. 50,000', min: 10000, max: 50000 },
  { label: 'Rs. 50,000 - Rs. 100,000', min: 50000, max: 100000 },
  { label: 'Above Rs. 100,000', min: 100000, max: Infinity },
];

export default function ShopPage() {
  const { categorySlug, categoryId, navigateToProduct } = useNavigationStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const limit = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories
  useEffect(() => {
    fetch('/api/products?includeCategories=true')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Listen for search events from header
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setSearchQuery(detail);
      setDebouncedSearch(detail);
      setPage(1);
    };
    window.addEventListener('shop-search', handler);
    return () => window.removeEventListener('shop-search', handler);
  }, []);

  // Set initial category from navigation store
  useEffect(() => {
    if (categoryId && !selectedCategories.includes(categoryId)) {
      setSelectedCategories([categoryId]);
    }
  }, [categoryId]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedCategories.length === 1) {
        const cat = categories.find((c) => c.id === selectedCategories[0]);
        if (cat) params.set('category', cat.slug);
      }
      // For price range filtering, we'll do it client-side
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      let filtered = data.products || [];

      // Client-side price filter
      if (selectedPriceRange !== null) {
        const range = PRICE_RANGES[selectedPriceRange];
        filtered = filtered.filter(
          (p: Product) => p.price >= range.min && p.price < range.max
        );
      }

      // Client-side multi-category filter
      if (selectedCategories.length > 1) {
        filtered = filtered.filter((p: Product) =>
          selectedCategories.includes(p.categoryId)
        );
      }

      setProducts(filtered);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategories, selectedPriceRange, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  };

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

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setPage(1);
    useNavigationStore.getState().navigate('shop');
  };

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || selectedPriceRange !== null;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="pl-9 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                className="border-gray-300 data-[state=checked]:bg-[#0F766E] data-[state=checked]:border-[#0F766E]"
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="text-sm text-gray-700 cursor-pointer flex-1"
              >
                {cat.name}
              </Label>
              <span className="text-xs text-gray-400">
                {cat._count?.products || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                id={`price-${index}`}
                checked={selectedPriceRange === index}
                onCheckedChange={() => {
                  setSelectedPriceRange(
                    selectedPriceRange === index ? null : index
                  );
                  setPage(1);
                }}
                className="border-gray-300 data-[state=checked]:bg-[#0F766E] data-[state=checked]:border-[#0F766E]"
              />
              <Label
                htmlFor={`price-${index}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[#0F766E] border-[#0F766E] hover:bg-[#0F766E] hover:text-white"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen animate-slide-in">
      {/* Page Header */}
      <div className="bg-[#F0FDFA] border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name ||
                'Shop'
              : 'Shop All Products'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {total} product{total !== 1 ? 's' : ''} found
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile filter button */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-[#0F766E] text-white text-[10px] px-1.5">
                    {selectedCategories.length + (selectedPriceRange !== null ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
              <FilterSidebar />
            </SheetContent>
          </Sheet>
          {/* Mobile search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-5 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Scissors className="h-16 w-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  className="text-[#0F766E] border-[#0F766E]"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="product-card-modern">
                        <div
                          className="product-img-wrapper relative bg-slate-50 aspect-square flex items-center justify-center p-4 cursor-pointer"
                          onClick={() => navigateToProduct(product.slug)}
                        >
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.title}
                              width={250}
                              height={250}
                              className="object-contain w-full h-full transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`hidden absolute inset-0 flex flex-col items-center justify-center bg-slate-100 ${!product.imageUrl ? '!flex' : ''}`}>
                            <Scissors className="h-10 w-10 text-gray-300" />
                          </div>
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
                        <CardContent className="p-3">
                          {product.category && (
                            <p className="text-[10px] text-[#0F766E] font-medium mb-0.5 uppercase tracking-wide">
                              {product.category.name}
                            </p>
                          )}
                          <h3
                            className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-[#0F766E] transition-colors"
                            onClick={() => navigateToProduct(product.slug)}
                          >
                            {product.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-base font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                            <Button
                              size="sm"
                              className="bg-[#0F766E] hover:bg-[#0D6560] text-white h-7 px-2.5 text-xs"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="h-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | string)[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) {
                          acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        typeof p === 'string' ? (
                          <span key={`dot-${i}`} className="px-1 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={p}
                            variant={page === p ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(p)}
                            className={`h-8 w-8 p-0 ${
                              page === p
                                ? 'bg-[#0F766E] hover:bg-[#0D6560] text-white'
                                : ''
                            }`}
                          >
                            {p}
                          </Button>
                        )
                      )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="h-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
