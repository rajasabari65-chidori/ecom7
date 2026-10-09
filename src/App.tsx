import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/layout/LandingPage';
import { MarketplaceView } from './components/products/MarketplaceView';
import { ProductDetailView } from './components/products/ProductDetailView';
import { PriceGuardianView } from './components/products/PriceGuardianView';
import { SmartCartView } from './components/cart/SmartCartView';
import { BudgetAssistantView } from './components/cart/BudgetAssistantView';
import { OrdersView } from './components/cart/OrdersView';
import { SellerDashboardView } from './components/seller/SellerDashboardView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { SettingsView } from './components/settings/SettingsView';
import { OptiAssistantModal } from './components/ai/OptiAssistantModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />

      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'marketplace' && <MarketplaceView />}
        {activeView === 'product-detail' && <ProductDetailView />}
        {activeView === 'price-guardian' && <PriceGuardianView />}
        {activeView === 'smart-cart' && <SmartCartView />}
        {activeView === 'budget' && <BudgetAssistantView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'seller-dashboard' && <SellerDashboardView />}
        {activeView === 'admin-dashboard' && <AdminDashboardView />}
        {activeView === 'settings' && <SettingsView />}
      </main>

      <Footer />

      {/* Persistent Floating AI Assistant */}
      <OptiAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
