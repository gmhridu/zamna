'use client';

import { Scissors, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const { navigate, navigateToCategory } = useNavigationStore();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 mb-4"
            >
              <Scissors className="h-5 w-5 text-[#0F766E]" />
              <div>
                <span className="text-lg font-extrabold tracking-wider text-[#0F766E]">
                  ZAMANA
                </span>
                <span className="block text-[9px] tracking-[0.2em] text-gray-500 -mt-1">
                  STORE
                </span>
              </div>
            </button>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pakistan&apos;s trusted online store for premium sewing machines,
              overlockers, embroidery machines, and accessories. We bring you the
              best brands at competitive prices with nationwide delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', action: () => navigate('home') },
                { label: 'Shop All', action: () => navigate('shop') },
                { label: 'Sewing Machines', action: () => navigateToCategory(1, 'sewing-machines') },
                { label: 'Overlock Machines', action: () => navigateToCategory(2, 'overlock-machines') },
                { label: 'Embroidery Machines', action: () => navigateToCategory(3, 'embroidery-machines') },
                { label: 'Accessories', action: () => navigateToCategory(4, 'accessories-parts') },
                { label: 'Contact Us', action: () => navigate('contact') },
                { label: 'Track Order', action: () => navigate('order-tracking') },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm text-gray-600 hover:text-[#0F766E] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#0F766E] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-600">
                  Shop #12, Al-Fatah Market,
                  <br />
                  Main Boulevard, Gulberg III,
                  <br />
                  Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#0F766E] shrink-0" />
                <span className="text-sm text-gray-600">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#0F766E] shrink-0" />
                <span className="text-sm text-gray-600">info@zamanastore.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Zamana Store. All rights reserved.</p>
          <p>Powered by Zamana Store</p>
        </div>
      </div>
    </footer>
  );
}
