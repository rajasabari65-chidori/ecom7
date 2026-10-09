import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeonButton } from '../ui/NeonButton';
import { ThreeDVisualizer } from '../ui/ThreeDVisualizer';
import {
  Sparkles,
  TrendingDown,
  ShoppingBag,
  ShieldCheck,
  Search,
  ArrowRight,
  DollarSign,
  Leaf,
  Store,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Percent,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    products,
    setActiveView,
    setSelectedProductForDetail,
    addToCart,
    switchUserRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Curated subsets from real products
  const surplusHighlights = products
    .filter((p) => p.surplusStatus === 'surplus')
    .slice(0, 4);

  const featuredProducts = products.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('marketplace');
  };

  const openProduct = (product: any) => {
    setSelectedProductForDetail(product);
    setActiveView('product-detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Hero Section with 3D Immersion & Product Showcase */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-900">
        {/* Background 3D Canvas Visualizer */}
        <div className="absolute inset-0 z-0 opacity-70">
          <ThreeDVisualizer />
        </div>

        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Generation Intelligent Commerce</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
                Intelligence That Makes Every Purchase{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Smarter.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                Discover verified surplus deals, understand product prices with historical Price Guardian analysis, optimize your budget, and help businesses eliminate inventory waste with AI.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <NeonButton
                  variant="cyan"
                  size="lg"
                  onClick={() => setActiveView('marketplace')}
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </NeonButton>

                <NeonButton
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    switchUserRole('seller');
                    setActiveView('seller-dashboard');
                  }}
                >
                  <Store className="w-4 h-4 text-emerald-400 mr-1" />
                  <span>Start Selling Surplus</span>
                </NeonButton>

                <NeonButton
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveView('price-guardian')}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mr-1" />
                  <span>Try Price Guardian</span>
                </NeonButton>
              </div>

              {/* Search Bar in Hero */}
              <form onSubmit={handleSearchSubmit} className="pt-4 max-w-lg">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 60+ products: headphones, laptops, watches..."
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 shadow-xl transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 text-left">
                <div>
                  <div className="text-2xl font-bold text-white font-mono">₹14.2L+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Surplus Recovered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">38% Avg</div>
                  <div className="text-xs text-slate-500 mt-0.5">Customer Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-mono">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Warranty Verified</div>
                </div>
              </div>
            </div>

            {/* Right: Studio 3D Floating Product Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl p-2 group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src="/src/assets/images/optimart_hero_showcase_1791507952227.jpg"
                    alt="OptiMart AI Hardware Ecosystem"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Floating AI Deal Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-cyan-400 font-mono font-medium">
                        FEATURED SMART SURPLUS
                      </div>
                      <div className="text-xs font-bold text-white truncate max-w-[200px]">
                        Acoustiq Max Pro & Atlas Gear
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400 font-mono">Up to 54% OFF</div>
                      <div className="text-[10px] text-slate-400">Inspected & Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Best Smart Surplus Deals Strip */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
              High-Velocity Liquidation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Best Surplus Deals Right Now
            </h2>
          </div>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View all 60+ products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {surplusHighlights.map((product) => (
            <div
              key={product.id}
              className="group bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col"
            >
              <div
                onClick={() => openProduct(product)}
                className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-rose-500/90 text-white font-bold text-[11px] px-2 py-0.5 rounded-md font-mono">
                  {product.discountPercentage}% OFF
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                  {product.condition}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">
                    <span>{product.brand}</span>
                    <span className="mx-1.5">·</span>
                    <span>{product.category}</span>
                  </div>
                  <h3
                    onClick={() => openProduct(product)}
                    className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer mb-2"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-base font-bold text-white font-mono">
                        ₹{product.currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 line-through ml-2 font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      Save ₹{(product.originalPrice - product.currentPrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProduct(product)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center transition-colors cursor-pointer"
                    >
                      Inspect Deal
                    </button>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Three Core Pillars (Integrated Architecture) */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
              Integrated Commerce Pillars
            </div>
            <h2 className="text-3xl font-bold text-white">
              Three Systems Working as One
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              OptiMart AI merges surplus inventory liquidation, price verification, and cart budget enforcement into a unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Smart Surplus */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Smart Surplus Marketplace</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Businesses detect aging inventory and high surplus risks based on sales velocity and days of forward cover. Verified surplus products are marked down dynamically before value depreciates.
                </p>
              </div>
              <button
                onClick={() => setActiveView('marketplace')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
              >
                <span>Explore Surplus Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2: Price Guardian */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. AI Price Guardian</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Analyzes internal transaction histories, lowest recorded marks, and comparable models. Generates transparent Deal Scores (0-100) and clear buy/wait guidance grounded in historical facts.
                </p>
              </div>
              <button
                onClick={() => setActiveView('price-guardian')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
              >
                <span>Launch Price Guardian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3: Smart Cart & Budget */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Smart Cart & Budget Assistant</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Input your shopping target. If your cart exceeds your budget, our AI recommends cheaper certified surplus alternatives with comparable specifications and 1-click replacement.
                </p>
              </div>
              <button
                onClick={() => setActiveView('smart-cart')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
              >
                <span>Optimize Your Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How OptiMart Works (Workflow) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
            Seamless Four-Step Workflow
          </div>
          <h2 className="text-3xl font-bold text-white">How OptiMart AI Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400 font-mono mb-2">01</div>
            <h3 className="text-sm font-bold text-white mb-1.5">Surplus Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sellers list excess inventory or connect catalogs. Algorithms monitor stock turnover and aging.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400 font-mono mb-2">02</div>
            <h3 className="text-sm font-bold text-white mb-1.5">Price Guardian Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Price curves, competitor baselines, and historical discounts are evaluated to establish true value.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400 font-mono mb-2">03</div>
            <h3 className="text-sm font-bold text-white mb-1.5">Smart Cart Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customers set budgets. AI replaces overpriced items with certified surplus to keep checkouts affordable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400 font-mono mb-2">04</div>
            <h3 className="text-sm font-bold text-white mb-1.5">Zero-Waste Fulfillment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Orders are dispatched locally via Cash on Delivery or instant card, reducing warehouse deadstock.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sustainability & Financial Impact */}
      <section className="py-16 bg-gradient-to-b from-slate-900/60 to-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono mb-3">
                <Leaf className="w-4 h-4" />
                <span>CIRCULAR COMMERCE & ECO IMPACT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Cutting E-Commerce Waste by Up to 65%
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Unsold consumer electronics, seasonal apparel, and packaged goods often end up discarded or incinerated. OptiMart AI empowers sellers to liquidate stock responsibly before expiration or obsolescence, giving premium items a second life with value-conscious shoppers.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3,400+ kg of electronic & consumer hardware diverted from e-waste dumps</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>₹2.4 Crores in working capital unlocked for regional Indian sellers</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent inspection guarantee on open-box and factory surplus models</span>
                </div>
              </div>
            </div>

            {/* Testimonials (Clean unboxed editorial design) */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  "Price Guardian saved me ₹7,500 on my noise-canceling headphones. It verified that the deal was an authentic factory surplus drop, not a fake sale price."
                </p>
                <div className="text-xs font-semibold text-white">Rohit Verma</div>
                <div className="text-[11px] text-slate-500">Tech Enthusiast · Bengaluru</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  "As a consumer electronics retailer, holding dead inventory was costing us thousands each month. OptiMart's AI pricing cleared 65 units of slow-moving audio gear in 14 days."
                </p>
                <div className="text-xs font-semibold text-white">Priya Sundaram</div>
                <div className="text-[11px] text-slate-500">Managing Director · Nova Digital & Audio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1.5">What is 'Smart Surplus'?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Surplus includes authentic overstock, factory excess inventory, and open-box items that retailers need to clear quickly. All items are strictly tested and backed by seller warranty.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1.5">How does Price Guardian ensure I get a good deal?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Price Guardian looks at our recorded catalog transaction history over the past 6 months. It calculates minimum, maximum, and average prices to assign an unbiased Deal Score from 0 to 100.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1.5">Will the Smart Cart Assistant change my items automatically?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never. When your cart exceeds your budget, Opti Assistant suggests cheaper alternatives with equivalent specifications. You review each item and decide whether to accept or decline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
