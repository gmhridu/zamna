'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Package,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  Scissors,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/stores/navigation-store';
import type { OrderResult } from '@/types';

function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  Processing: { color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock, label: 'Processing' },
  Shipped: { color: 'text-blue-700', bg: 'bg-blue-50', icon: Truck, label: 'Shipped' },
  Delivered: { color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2, label: 'Delivered' },
};

export default function OrderTrackingPage() {
  const { trackingId: prefilledId } = useNavigationStore();
  const [trackingInput, setTrackingInput] = useState('');
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (prefilledId) {
      setTrackingInput(prefilledId);
      handleTrack(prefilledId);
    }
  }, [prefilledId]);

  const handleTrack = async (id?: string) => {
    const tid = id || trackingInput.trim();
    if (!tid) return;

    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(tid)}`);
      if (!res.ok) {
        setOrder(null);
        setError('Order not found. Please check your tracking ID.');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = order
    ? STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing']
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-slide-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        Track Your Order
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Enter your tracking ID to check your order status
      </p>

      {/* Search Form */}
      <Card className="border-0 shadow-sm mb-8 rounded-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Enter tracking ID (e.g., ZMS1001)"
                className="pl-9 h-11"
              />
            </div>
            <Button
              className="bg-[#0F766E] hover:bg-[#0D6560] text-white h-11 px-8"
              onClick={() => handleTrack()}
              disabled={loading || !trackingInput.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {searched && error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order Not Found
              </h3>
              <p className="text-sm text-gray-500">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Order Details */}
      {order && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Status Card */}
          <Card className="border-0 shadow-sm overflow-hidden rounded-xl">
            <div className={`px-6 py-4 ${statusConfig?.bg}`}>
              <div className="flex items-center gap-3">
                <statusConfig.icon
                  className={`h-6 w-6 ${statusConfig?.color}`}
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Order Status
                  </p>
                  <p className={`text-lg font-bold ${statusConfig?.color}`}>
                    {statusConfig?.label}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Tracking ID</p>
                  <p className="font-semibold text-gray-900">{order.trackingId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Customer</p>
                  <p className="font-semibold text-gray-900">
                    {order.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Total</p>
                  <p className="font-bold text-[#0F766E]">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F766E]" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  {index < order.items.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0F766E]" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.streetAddress}</p>
              <p className="text-sm text-gray-600">
                {[order.city, order.state, order.postalCode].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-gray-600">{order.country}</p>
              {order.customerPhone && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                  <Phone className="h-3 w-3" />
                  {order.customerPhone}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty state (not searched yet) */}
      {!searched && !prefilledId && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            Enter your tracking ID above to get started
          </p>
        </div>
      )}
    </div>
  );
}
