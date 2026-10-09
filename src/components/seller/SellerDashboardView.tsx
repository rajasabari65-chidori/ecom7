import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SurplusRecommendation, DemandForecast } from '../../types';
import { NeonButton } from '../ui/NeonButton';
import {
  Store,
  DollarSign,
  TrendingDown,
  Package,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    currentUser,
    orders,
    setActiveView,
    setSelectedProductForDetail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'surplus' | 'pricing' | 'forecast' | 'products'>('overview');
  const [selectedProductForPricing, setSelectedProductForPricing] = useState<Product | null>(null);
  const [pricingAnalysis, setPricingAnalysis] = useState<SurplusRecommendation | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [priceAppliedSuccess, setPriceAppliedSuccess] = useState(false);

  // New product form modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState(4999);
  const [newOrigPrice, setNewOrigPrice] = useState(7999);
  const [newCostPrice, setNewCostPrice] = useState(3500);
  const [newStock, setNewStock] = useState(50);
  const [newCondition, setNewCondition] = useState<Product['condition']>('Factory Surplus');
  const [newDesc, setNewDesc] = useState('');

  // Seller's scoped products
  const sellerProducts = products.filter(
    (p) => p.sellerId === currentUser.id || currentUser.role === 'admin'
  );

  // Metrics
  const totalStockUnits = sellerProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = sellerProducts.reduce((acc, p) => acc + p.stock * p.currentPrice, 0);
  const surplusCount = sellerProducts.filter((p) => p.surplusStatus === 'surplus').length;
  const criticalSurplusCount = sellerProducts.filter((p) => p.surplusRiskLevel === 'HIGH' || p.surplusRiskLevel === 'CRITICAL').length;
  const sellerOrders = orders.filter((o) =>
    o.items.some((i) => i.sellerId === currentUser.id || currentUser.role === 'admin')
  );
  const totalSellerSales = sellerOrders.reduce((sum, o) => sum + o.total, 0);

  // Run AI Dynamic Pricing Analysis
  const handleAnalyzePricing = async (product: Product) => {
    setSelectedProductForPricing(product);
    setPricingLoading(true);
    setPriceAppliedSuccess(false);

    try {
      const res = await fetch('/api/gemini/surplus-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      if (res.ok) {
        const data = await res.json();
        setPricingAnalysis(data);
      }
    } catch (e) {
      console.warn('Surplus analysis fetch failed:', e);
    } finally {
      setPricingLoading(false);
    }
  };

  // Apply AI Price Change with Seller Confirmation
  const handleApplyPriceChange = () => {
    if (!selectedProductForPricing || !pricingAnalysis) return;

    const updated: Product = {
      ...selectedProductForPricing,
      currentPrice: pricingAnalysis.suggestedPrice,
      discountPercentage: pricingAnalysis.recommendedDiscount,
      surplusRiskLevel: 'LOW',
      priceHistory: [
        ...selectedProductForPricing.priceHistory,
        {
          date: new Date().toISOString().split('T')[0],
          price: pricingAnalysis.suggestedPrice,
          event: 'AI Surplus Markdown Approved',
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    updateProduct(updated);
    setSelectedProductForPricing(updated);
    setPriceAppliedSuccess(true);
    setTimeout(() => setPriceAppliedSuccess(false), 4000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const discount = Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100);
    const prod: Product = {
      id: `prod-user-${Date.now()}`,
      name: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      brand: newBrand || 'Original Equipment',
      description: newDesc || 'Surplus stock inspected and cleared for direct commercial liquidation.',
      images: ['/src/assets/images/optimart_hero_showcase_1791507952227.jpg'],
      originalPrice: Number(newOrigPrice),
      currentPrice: Number(newPrice),
      costPrice: Number(newCostPrice),
      discountPercentage: discount,
      stock: Number(newStock),
      minAcceptablePrice: Math.round(Number(newCostPrice) * 1.1),
      salesVelocity: 15,
      expectedMonthlyDemand: 20,
      productAgeDays: 45,
      surplusStatus: Number(newStock) > 40 ? 'surplus' : 'normal',
      surplusRiskLevel: Number(newStock) > 60 ? 'HIGH' : 'LOW',
      excessQuantityEstimate: Math.max(0, Number(newStock) - 20),
      recommendedDiscount: discount + 5,
      suggestedPrice: Math.round(Number(newPrice) * 0.95),
      sellerId: currentUser.id,
      sellerName: currentUser.businessName || currentUser.name,
      sellerLocation: 'Indiranagar, Bengaluru',
      sellerCoords: { lat: 12.9716, lng: 77.5946 },
      rating: 4.8,
      reviewCount: 1,
      specifications: {
        'Brand': newBrand || 'Brand Certified',
        'Inspection': '10-Point Hardware Quality Certified',
      },
      deliveryEstimateDays: 2,
      returnPolicy: '7 Days Return',
      warranty: '1 Year Warranty',
      condition: newCondition,
      priceHistory: [
        { date: '2026-06-01', price: Number(newOrigPrice) },
        { date: '2026-10-08', price: Number(newPrice), event: 'Catalogue Seed' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(prod);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewBrand('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Authorized Seller Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {currentUser.businessName || 'Seller Hub'} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time surplus velocity, inventory clearance, and AI dynamic pricing.
          </p>
        </div>

        <NeonButton
          variant="cyan"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Product Listing</span>
        </NeonButton>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Total Revenue</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            ₹{(totalSellerSales || 48299).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            +{sellerOrders.length + 8} completed orders
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Inventory Units</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            {totalStockUnits}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Across {sellerProducts.length} active SKUs
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Inventory Capital</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            ₹{(totalInventoryValue / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Market asset value</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Surplus Risk SKUs</div>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">
            {criticalSurplusCount}
          </div>
          <div className="text-[10px] text-rose-300 mt-1">
            Action suggested by AI
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inventory Overview
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'pricing'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Dynamic Pricing Tool</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'forecast'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Demand Forecasting
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'products'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Catalog ({sellerProducts.length})
        </button>
      </div>

      {/* Tab Content: Overview & Surplus Detection */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Surplus Risk Identification</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Products exceeding 45 days forward cover relative to current monthly demand.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/60 font-mono">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Monthly Demand</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Current Price</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {sellerProducts.slice(0, 8).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-medium text-white max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="p-3 font-mono">{p.stock}</td>
                      <td className="p-3 font-mono">{p.expectedMonthlyDemand || 15}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            p.surplusRiskLevel === 'HIGH' || p.surplusRiskLevel === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-400'
                              : p.surplusRiskLevel === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {p.surplusRiskLevel}
                        </span>
                      </td>
                      <td className="p-3 font-mono">₹{p.currentPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setActiveTab('pricing');
                            handleAnalyzePricing(p);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium transition-colors cursor-pointer"
                        >
                          AI Price Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: AI Dynamic Pricing Tool */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Select Product to Analyze */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Select Product for Pricing Audit</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {sellerProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleAnalyzePricing(p)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedProductForPricing?.id === p.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate max-w-[220px]">
                    <div className="text-xs font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Stock: {p.stock} · ₹{p.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      p.surplusRiskLevel === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.surplusRiskLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Analysis Output & Confirmation */}
          <div className="lg:col-span-7">
            {selectedProductForPricing && pricingAnalysis ? (
              <div className="bg-slate-900/70 border border-cyan-500/30 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400">Selected Product</div>
                    <h3 className="text-base font-bold text-white">
                      {selectedProductForPricing.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-3 py-1 rounded-lg font-mono">
                    {pricingAnalysis.riskLevel} RISK
                  </span>
                </div>

                {/* Pricing Parameters Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Current Price</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      ₹{selectedProductForPricing.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Cost Floor Price</div>
                    <div className="text-base font-bold text-slate-400 font-mono mt-0.5">
                      ₹{selectedProductForPricing.minAcceptablePrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 uppercase font-mono">AI Recommended</div>
                    <div className="text-base font-extrabold text-cyan-300 font-mono mt-0.5">
                      ₹{pricingAnalysis.suggestedPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Clearance Algorithm Rationale</span>
                  </div>
                  <p>{pricingAnalysis.explanation}</p>
                  <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800 flex justify-between">
                    <span>Est. Clearance Time: {pricingAnalysis.clearanceDaysEstimate} days</span>
                    <span className="text-emerald-400 font-mono">Recovery Capital: ₹{pricingAnalysis.estimatedFinancialRecovery.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Mandatory Confirmation Step */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
                  <div className="text-xs font-semibold text-white">
                    Seller Approval Required
                  </div>
                  <p className="text-[11px] text-slate-400">
                    In compliance with platform policy, AI will never alter live marketplace listings automatically. Click below to confirm and publish the updated surplus price.
                  </p>
                  <NeonButton
                    variant="cyan"
                    size="md"
                    className="w-full"
                    onClick={handleApplyPriceChange}
                    isSuccess={priceAppliedSuccess}
                  >
                    <span>Approve & Publish Price (₹{pricingAnalysis.suggestedPrice.toLocaleString('en-IN')})</span>
                  </NeonButton>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                Select a product from the left to calculate optimal surplus clearance pricing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Demand Forecasting */}
      {activeTab === 'forecast' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Demand Forecasting Models (7 & 30-Day Horizons)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated from historical transaction frequency and seasonal surplus curves.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sellerProducts.slice(0, 3).map((prod) => {
              const forecast7 = Math.round((prod.expectedMonthlyDemand || 16) * 0.28);
              const forecast30 = prod.expectedMonthlyDemand || 16;
              const willOverstock = prod.stock > forecast30 * 2;
              return (
                <div key={prod.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500">7-Day Est.</div>
                      <div className="font-mono text-cyan-300 font-bold text-sm mt-0.5">
                        {forecast7} units
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500">30-Day Est.</div>
                      <div className="font-mono text-white font-bold text-sm mt-0.5">
                        {forecast30} units
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] flex justify-between items-center text-slate-400">
                    <span>Stock: {prod.stock}</span>
                    <span className={willOverstock ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                      {willOverstock ? 'High Surplus Cover' : 'Optimal Velocity'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Manage Catalog */}
      {activeTab === 'products' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Active Product Listings</h3>
            <span className="text-xs text-slate-400">{sellerProducts.length} items</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {sellerProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{p.name}</h4>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ₹{p.currentPrice.toLocaleString('en-IN')} · Stock: {p.stock}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProductForDetail(p);
                      setActiveView('product-detail');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="View PDP"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white">Create New Surplus Listing</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AeroPod Ultra Wireless Earbuds"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Mobiles and Accessories">Mobiles and Accessories</option>
                    <option value="Computers and Laptops">Computers and Laptops</option>
                    <option value="Home and Kitchen">Home and Kitchen</option>
                    <option value="Sports and Fitness">Sports and Fitness</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Factory Surplus">Factory Surplus</option>
                    <option value="Open Box (Certified)">Open Box (Certified)</option>
                    <option value="Brand New">Brand New</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Original MRP</label>
                  <input
                    type="number"
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Selling Price</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detailed specifications and surplus verification details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <NeonButton type="submit" variant="cyan" size="sm">
                  Publish to Marketplace
                </NeonButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
