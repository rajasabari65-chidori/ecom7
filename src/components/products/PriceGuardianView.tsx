import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PriceGuardianVerdict } from '../../types';
import { PriceChart } from '../charts/PriceChart';
import { NeonButton } from '../ui/NeonButton';
import {
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShoppingBag,
} from 'lucide-react';

export const PriceGuardianView: React.FC = () => {
  const {
    products,
    setSelectedProductForDetail,
    setActiveView,
    addToCart,
    getPriceGuardianAnalysis,
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'prod-headphone-01');
  const [searchFilter, setSearchFilter] = useState('');
  const [verdictData, setVerdictData] = useState<PriceGuardianVerdict | null>(null);
  const [loading, setLoading] = useState(false);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (activeProduct) {
      setLoading(true);
      getPriceGuardianAnalysis(activeProduct).then((data) => {
        setVerdictData(data);
        setLoading(false);
      });
    }
  }, [activeProduct?.id]);

  const searchResults = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilter.toLowerCase())
  ).slice(0, 8);

  const handleInspectFull = () => {
    setSelectedProductForDetail(activeProduct);
    setActiveView('product-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-Time Intelligence & Audit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Price Guardian
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
          Evaluate true purchase value before you buy. Every verdict is grounded in internal 6-month transaction trends, seasonal markdown cycles, and certified hardware benchmarks.
        </p>
      </div>

      {/* Product Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search product to analyze..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Quick Product Chips */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {searchResults.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                selectedProductId === p.id
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p.brand} {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Display */}
      {activeProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Product & Verdict Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-6">
              {/* Product Card */}
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <img
                    src={activeProduct.images[0]}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">
                    <span>{activeProduct.brand}</span> · <span>{activeProduct.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                    {activeProduct.name}
                  </h3>
                  <div className="mt-1 text-xs text-slate-500">
                    Condition: <span className="text-slate-300 font-medium">{activeProduct.condition}</span>
                  </div>
                </div>
              </div>

              {/* Price Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Current Price</div>
                  <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                    ₹{activeProduct.currentPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    {activeProduct.discountPercentage}% discount
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Original Reference</div>
                  <div className="text-xl font-bold text-slate-400 font-mono mt-0.5 line-through">
                    ₹{activeProduct.originalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Save ₹{(activeProduct.originalPrice - activeProduct.currentPrice).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Deal Score Gauge */}
              {verdictData && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">AI Deal Score</span>
                    <span className="text-2xl font-black text-cyan-300 font-mono">
                      {verdictData.dealScore}
                      <span className="text-xs text-slate-500 font-normal"> / 100</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${verdictData.dealScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg font-mono ${
                        verdictData.verdict === 'GOOD DEAL'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : verdictData.verdict === 'FAIR PRICE'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {verdictData.verdict}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Confidence: <span className="text-white font-mono">{verdictData.confidence}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <NeonButton
                  variant="cyan"
                  size="md"
                  className="flex-1"
                  onClick={() => addToCart(activeProduct, 1)}
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  <span>Add to Cart</span>
                </NeonButton>
                <NeonButton
                  variant="outline"
                  size="md"
                  onClick={handleInspectFull}
                >
                  <span>Full PDP Details</span>
                </NeonButton>
              </div>
            </div>
          </div>

          {/* Right: Price History Chart & Detailed Evaluation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    <span>Historical Price Progression</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Records from official store launch through surplus clearance markdown cycles.
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {activeProduct.priceHistory.length} Recorded Points
                </div>
              </div>

              {/* Interactive Line Chart */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <PriceChart
                  data={activeProduct.priceHistory}
                  currentPrice={activeProduct.currentPrice}
                  height={240}
                />
              </div>

              {/* Rationale Callout */}
              {verdictData && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Price Guardian Rationale & Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {verdictData.explanation}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Lowest Recorded</div>
                      <div className="font-mono text-emerald-400 font-semibold mt-0.5">
                        ₹{verdictData.lowestPriceRecorded.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Average Price</div>
                      <div className="font-mono text-slate-300 font-semibold mt-0.5">
                        ₹{verdictData.averagePrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Peak Price</div>
                      <div className="font-mono text-slate-400 font-semibold mt-0.5">
                        ₹{verdictData.highestPriceRecorded.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
