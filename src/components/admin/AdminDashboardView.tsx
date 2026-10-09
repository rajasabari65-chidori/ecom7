import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  TrendingDown,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { products, sellers, orders, resetToDefaultData, setActiveView } = useApp();

  const totalCatalogValue = products.reduce((sum, p) => sum + p.currentPrice * p.stock, 0);
  const totalSavings = products.reduce((sum, p) => sum + (p.originalPrice - p.currentPrice) * p.stock, 0);
  const surplusCount = products.filter((p) => p.surplusStatus === 'surplus').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            OptiMart Central Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global catalog oversight, registered sellers, surplus audits, and live query metrics.
          </p>
        </div>

        <button
          onClick={resetToDefaultData}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Catalog</span>
        </button>
      </div>

      {/* Global Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Catalog Scale</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {products.length} Products
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Across 12 verified categories
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Active Sellers</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            {sellers.length} Hubs
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            100% verified KYC
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Surplus Inventory</div>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">
            {surplusCount} SKUs
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Active clearance status
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Market Asset Value</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            ₹{(totalCatalogValue / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ₹{(totalSavings / 100000).toFixed(1)}L consumer savings
          </div>
        </div>
      </div>

      {/* Registered Sellers Directory */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-cyan-400" />
          <span>Registered Participating Sellers & Locations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{s.businessName}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                  {s.rating}★ Verified
                </span>
              </div>
              <div className="text-slate-400">{s.ownerName} · {s.category}</div>
              <div className="text-[11px] text-slate-500 truncate">{s.address}</div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Sales: {s.totalSales}</span>
                <span>Active SKUs: {s.activeProductsCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Platform Audit Stream</span>
        </h3>

        <div className="divide-y divide-slate-800/80 text-xs">
          <div className="py-2.5 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Surplus clearance price updated for 'Acoustiq Max Pro' (-30% approved)</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Today 18:02</span>
          </div>
          <div className="py-2.5 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Price Guardian telemetry validated 6-month transaction curve</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Today 17:45</span>
          </div>
          <div className="py-2.5 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Gemini 3.8 Flash model endpoint processed Smart Cart query</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Today 17:15</span>
          </div>
        </div>
      </div>
    </div>
  );
};
