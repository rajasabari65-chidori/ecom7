import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  User,
  Store,
  Compass,
  Sliders,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    currentUser,
    switchUserRole,
    selectedDeliveryAddress,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'price-guardian', label: 'Price Guardian' },
    { id: 'smart-cart', label: 'Smart Cart' },
    { id: 'budget', label: 'Budget' },
    { id: 'orders', label: 'Orders' },
  ];

  // If user is seller or admin, provide appropriate quick dashboard link
  if (currentUser.role === 'seller') {
    navLinks.splice(3, 1, { id: 'seller-dashboard', label: 'Seller Hub' });
  } else if (currentUser.role === 'admin') {
    navLinks.splice(3, 1, { id: 'admin-dashboard', label: 'Admin Hub' });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('landing');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-[1px] shadow-[0_0_15px_-2px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-sans whitespace-nowrap">
                OptiMart <span className="text-cyan-400 font-extrabold">AI</span>
              </span>
            </button>

            {/* Quick Delivery Location Preview */}
            <button
              onClick={() => setActiveView('settings')}
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 ml-4 py-1 px-2.5 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate max-w-[140px]">{selectedDeliveryAddress.city || 'Select Area'}</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, 4-5 items) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Cart & Role/Profile Switcher) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => setActiveView('smart-cart')}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                activeView === 'smart-cart'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-cyan-500 text-slate-950 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Role Switcher & User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 cursor-pointer transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  {currentUser.role[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline font-medium capitalize">{currentUser.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono capitalize">
                      Active: {currentUser.role} mode
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1">
                      Quick Demo Switcher
                    </div>
                    <button
                      onClick={() => switchUserRole('customer')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-left cursor-pointer ${
                        currentUser.role === 'customer'
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Customer (Vikram Patel)</span>
                    </button>
                    <button
                      onClick={() => switchUserRole('seller')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-left cursor-pointer ${
                        currentUser.role === 'seller'
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seller (Nova Digital)</span>
                    </button>
                    <button
                      onClick={() => switchUserRole('admin')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-left cursor-pointer ${
                        currentUser.role === 'admin'
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Admin (System Console)</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80 mt-1">
                    <button
                      onClick={() => setActiveView('settings')}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account & Location Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
                activeView === link.id
                  ? 'bg-cyan-500/15 text-cyan-300'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>{link.label}</span>
              {activeView === link.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => {
                setActiveView('settings');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white"
            >
              <Sliders className="w-4 h-4" />
              <span>Profile & Delivery Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
