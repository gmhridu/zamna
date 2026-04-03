'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationStore } from '@/stores/navigation-store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/components/pages/HomePage';
import ShopPage from '@/components/pages/ShopPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrderSuccessPage from '@/components/pages/OrderSuccessPage';
import OrderTrackingPage from '@/components/pages/OrderTrackingPage';
import ContactPage from '@/components/pages/ContactPage';

const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  home: HomePage,
  shop: ShopPage,
  category: ShopPage,
  product: ProductDetailPage,
  cart: CartPage,
  checkout: CheckoutPage,
  'order-success': OrderSuccessPage,
  'order-tracking': OrderTrackingPage,
  contact: ContactPage,
};

export default function Home() {
  const currentPage = useNavigationStore((s) => s.currentPage);

  const PageComponent = PAGE_COMPONENTS[currentPage];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {PageComponent ? <PageComponent /> : <HomePage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
