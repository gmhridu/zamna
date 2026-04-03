'use client';

import { create } from 'zustand';
import type { PageName } from '@/types';

interface NavigationState {
  currentPage: PageName;
  categoryId: number | null;
  categorySlug: string | null;
  productSlug: string | null;
  trackingId: string | null;
  navigate: (page: PageName) => void;
  navigateToCategory: (categoryId: number, categorySlug: string) => void;
  navigateToProduct: (productSlug: string) => void;
  navigateToOrderSuccess: (trackingId: string) => void;
  navigateToOrderTracking: (trackingId?: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  categoryId: null,
  categorySlug: null,
  productSlug: null,
  trackingId: null,
  navigate: (page) => set({ currentPage: page, categoryId: null, categorySlug: null, productSlug: null, trackingId: null }),
  navigateToCategory: (categoryId, categorySlug) => set({ currentPage: 'category', categoryId, categorySlug }),
  navigateToProduct: (productSlug) => set({ currentPage: 'product', productSlug }),
  navigateToOrderSuccess: (trackingId) => set({ currentPage: 'order-success', trackingId }),
  navigateToOrderTracking: (trackingId) => set({ currentPage: 'order-tracking', trackingId: trackingId || null }),
}));
