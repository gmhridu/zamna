'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  ShoppingBag,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigationStore } from '@/stores/navigation-store';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const { navigate, navigateToOrderTracking, trackingId } = useNavigationStore();

  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      toast.success('Tracking ID copied to clipboard!');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-slide-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-500 mb-8">
          Your order has been placed successfully. We&apos;ll send you a
          confirmation soon.
        </p>

        {/* Tracking ID Card */}
        <Card className="border-0 shadow-md mb-8 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-2">Your Tracking ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#0F766E] tracking-wider">
                {trackingId || 'N/A'}
              </span>
              {trackingId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-[#0F766E]"
                  onClick={copyTrackingId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Save this ID to track your order status
            </p>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-blue-800">
            <strong>What&apos;s next?</strong> Our team will process your order within
            24 hours. You&apos;ll receive a call to confirm the delivery details. Use
            the tracking ID above to check your order status anytime.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-[#0F766E] hover:bg-[#0D6560] text-white"
            onClick={() => navigateToOrderTracking(trackingId || undefined)}
          >
            <Search className="mr-2 h-4 w-4" />
            Track Your Order
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
            onClick={() => navigate('shop')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
