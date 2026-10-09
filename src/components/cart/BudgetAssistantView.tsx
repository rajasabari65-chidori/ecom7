import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeonButton } from '../ui/NeonButton';
import {
  Wallet,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  PieChart,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const BudgetAssistantView: React.FC = () => {
  const { budget, updateBudget, cartTotal, orders, setActiveView } = useApp();

  const [monthlyInput, setMonthlyInput] = useState<number>(budget.monthlyBudget);
  const [cartBudgetInput, setCartBudgetInput] = useState<number>(budget.cartBudgetLimit);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalSpentThisMonth = orders.reduce((sum, o) => sum + o.total, 0) + budget.currentSpend;
  const remainingMonthly = Math.max(0, budget.monthlyBudget - totalSpentThisMonth);
  const utilizationPercent = Math.min(100, Math.round((totalSpentThisMonth / (budget.monthlyBudget || 1)) * 100));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudget({
      monthlyBudget: Number(monthlyInput),
      cartBudgetLimit: Number(cartBudgetInput),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
          <Wallet className="w-3.5 h-3.5" />
          <span>Personal Financial Discipline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Budget Assistant & Spend Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
          Set disciplined boundaries for monthly spending and single checkout carts. Our AI helps you avoid impulse overspending while maintaining access to premium hardware and home goods.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Monthly Utilization Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Monthly Budget Utilization</span>
            </h2>

            {/* Big Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Monthly Target</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  ₹{budget.monthlyBudget.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Recorded Spend</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  ₹{totalSpentThisMonth.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Remaining Cap</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  ₹{remainingMonthly.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Budget Consumed</span>
                <span className="font-mono text-white">{utilizationPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    utilizationPercent > 90
                      ? 'bg-rose-500'
                      : utilizationPercent > 70
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                  }`}
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Affordability Check */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Current Cart Affordability</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Active Cart: <span className="font-mono text-white font-bold">₹{cartTotal.toLocaleString('en-IN')}</span> vs Single Cart Cap: <span className="font-mono text-white font-bold">₹{budget.cartBudgetLimit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {cartTotal > budget.cartBudgetLimit ? (
                <div className="text-right">
                  <span className="text-rose-400 font-bold block">Over Target</span>
                  <button
                    onClick={() => setActiveView('smart-cart')}
                    className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
                  >
                    Optimize with AI →
                  </button>
                </div>
              ) : (
                <span className="text-emerald-400 font-bold">Affordable ✓</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Configure Targets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white">Configure Spending Caps</h2>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Monthly Total Shopping Budget (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Enforces overall limits across all purchases this calendar month.
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Single Cart Target Limit (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={cartBudgetInput}
                  onChange={(e) => setCartBudgetInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Triggers Smart Cart AI alternatives if exceeded during shopping sessions.
                </span>
              </div>

              <NeonButton
                type="submit"
                variant="cyan"
                size="md"
                className="w-full"
                isSuccess={savedSuccess}
              >
                <span>Save Budget Parameters</span>
              </NeonButton>
            </form>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-200">AI Budget Guarantee</div>
              <p className="text-[11px] leading-relaxed">
                OptiMart will never charge above your configured ceilings without proactive confirmation, and always seeks surplus alternatives to maximize your disposable surplus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
