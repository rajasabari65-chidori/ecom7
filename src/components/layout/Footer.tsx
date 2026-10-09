import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Shield, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, resetToDefaultData } = useApp();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs">
                O
              </div>
              <span className="font-bold text-white text-sm">OptiMart AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              AI-Powered Smart Surplus Marketplace, Price Guardian & Smart Cart Optimization Platform.
            </p>
            <div className="text-[11px] text-cyan-400 font-medium">
              Shop Smarter · Sell Better · Waste Less
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Marketplace</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('marketplace')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Browse Surplus Deals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('price-guardian')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  AI Price Guardian
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('smart-cart')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Smart Cart & Budget
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('budget')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Monthly Budget Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Seller & Platform */}
          <div>
            <div className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Business & AI</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('seller-dashboard')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Seller Inventory & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Admin Platform Metrics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('settings')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Location & Map Delivery
                </button>
              </li>
              <li>
                <button onClick={() => resetToDefaultData()} className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Catalogue</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <div className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Trust & Verification</div>
            <p className="text-slate-400 leading-relaxed mb-3">
              Every surplus deal on OptiMart AI undergoes multi-point inspection. All Price Guardian trends are computed from verified historical catalog transactions.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Hardware Warranty</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 OptiMart AI. All rights reserved. Built with Gemini 3.8 Flash & Google AI Studio.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Surplus Clearance Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
