'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/stores/navigation-store';
import { useCartStore, useCartItems, useCartTotal } from '@/stores/cart-store';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { navigate, navigateToOrderSuccess } = useNavigationStore();
  const items = useCartItems();
  const total = useCartTotal();
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = total >= 50000 ? 0 : 500;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-slide-in">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Items to Checkout
        </h2>
        <p className="text-gray-500 mb-6">Add some items to your cart first.</p>
        <Button
          className="bg-[#0F766E] hover:bg-[#0D6560] text-white"
          onClick={() => navigate('shop')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Shop
        </Button>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!form.customerPhone.trim())
      newErrors.customerPhone = 'Phone is required';
    if (!form.streetAddress.trim())
      newErrors.streetAddress = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to place order');
        return;
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigateToOrderSuccess(data.trackingId);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-slide-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-[#0F766E]" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-[#0F766E]">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={form.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="Muhammad Ali"
                      className={errors.customerName ? 'border-red-400' : ''}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-500">{errors.customerName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      placeholder="ali@example.com"
                      className={errors.customerEmail ? 'border-red-400' : ''}
                    />
                    {errors.customerEmail && (
                      <p className="text-xs text-red-500">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-[#0F766E]">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => updateField('customerPhone', e.target.value)}
                    placeholder="+92 300 1234567"
                    className={errors.customerPhone ? 'border-red-400' : ''}
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-red-500">{errors.customerPhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Street Address <span className="text-[#0F766E]">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={form.streetAddress}
                    onChange={(e) => updateField('streetAddress', e.target.value)}
                    placeholder="House #12, Street 5, Block C"
                    className={errors.streetAddress ? 'border-red-400' : ''}
                  />
                  {errors.streetAddress && (
                    <p className="text-xs text-red-500">
                      {errors.streetAddress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-[#0F766E]">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Lahore"
                      className={errors.city ? 'border-red-400' : ''}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="Punjab"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      value={form.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="54000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="Pakistan"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-sm mt-4 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-[#0F766E]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-[#0F766E] bg-[#F0FDFA] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F766E] flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-600">
                      Pay when your order is delivered to your doorstep
                    </p>
                  </div>
                  <Badge className="ml-auto bg-[#0F766E] text-white shrink-0">
                    Selected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-sm sticky top-28 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="text-sm font-medium text-gray-900 flex-1 min-w-0">
                        <p className="truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-[#0F766E]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0F766E] hover:bg-[#0D6560] text-white h-11 font-semibold mt-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-[#0F766E]"
                  onClick={() => navigate('cart')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
