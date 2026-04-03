'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Scissors,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartStore, useCartItems, useCartTotal } from '@/stores/cart-store';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

export default function CartPage() {
  const { navigate } = useNavigationStore();
  const items = useCartItems();
  const total = useCartTotal();
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleRemove = (productId: number, title: string) => {
    removeItem(productId);
    toast.info(`${title} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-slide-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Browse our
            collection and find something you love!
          </p>
          <Button
            size="lg"
            className="bg-[#0F766E] hover:bg-[#0D6560] text-white"
            onClick={() => navigate('shop')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-slide-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Shopping Cart
        <span className="text-gray-400 font-normal text-lg ml-2">
          ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden border-0 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 cursor-pointer border border-gray-100"
                        onClick={() => {
                          useNavigationStore
                            .getState()
                            .navigateToProduct(item.slug);
                        }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-contain h-full w-full p-1.5"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`hidden absolute inset-0 flex items-center justify-center ${!item.imageUrl ? '!flex' : ''}`}>
                          <Scissors className="h-6 w-6 text-gray-300" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          SKU: {item.sku}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3">
                            <p className="text-sm sm:text-base font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() =>
                                handleRemove(item.productId, item.title)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping */}
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#0F766E] mt-2"
            onClick={() => navigate('shop')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-0 shadow-sm sticky top-28 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">
                  {total >= 50000 ? 'Free' : formatPrice(500)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-[#0F766E]">
                  {formatPrice(total >= 50000 ? total : total + 500)}
                </span>
              </div>
              <Button
                className="w-full bg-[#0F766E] hover:bg-[#0D6560] text-white h-11 mt-2 font-semibold"
                onClick={() => navigate('checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {total < 50000 && (
                <p className="text-xs text-center text-gray-400 mt-2">
                  Add {formatPrice(50000 - total)} more for free delivery
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
