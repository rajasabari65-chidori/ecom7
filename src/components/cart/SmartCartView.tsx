import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeonButton } from '../ui/NeonButton';
import { CartOptimizationResult } from '../../types';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Truck,
  RotateCcw,
  Check,
  Percent,
} from 'lucide-react';

export const SmartCartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    cartSavings,
    budget,
    updateBudget,
    optimizeCartForBudget,
    applyCartOptimization,
    selectedDeliveryAddress,
    createOrder,
    setActiveView,
  } = useApp();

  const [targetBudgetInput, setTargetBudgetInput] = useState<number>(budget.cartBudgetLimit);
  const [optimizationResult, setOptimizationResult] = useState<CartOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'Cash on Delivery (COD)' | 'Demo Instant Card'>('Cash on Delivery (COD)');
  const [orderIdCreated, setOrderIdCreated] = useState<string>('');

  const isOverBudget = cartTotal > budget.cartBudgetLimit;
  const overAmount = Math.max(0, cartTotal - budget.cartBudgetLimit);

  const handleUpdateBudgetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudget({ cartBudgetLimit: Number(targetBudgetInput) });
    setOptimizationResult(null);
  };

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const result = optimizeCartForBudget();
      setOptimizationResult(result);
      setIsOptimizing(false);
      setOptimizationApplied(false);
    }, 600);
  };

  const handleApplyReplacement = () => {
    if (optimizationResult) {
      applyCartOptimization(optimizationResult);
      setOptimizationApplied(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setTimeout(() => {
        setOptimizationResult(null);
        setOptimizationApplied(false);
      }, 3000);
    }
  };

  const handleCheckout = () => {
    const order = createOrder(selectedPayment);
    if (order) {
      setOrderIdCreated(order.id);
      setCheckoutComplete(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  if (checkoutComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          Order <span className="font-mono text-cyan-300 font-semibold">{orderIdCreated}</span> has been processed via {selectedPayment}. Stock has been decremented and the seller is preparing your dispatch.
        </p>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Delivering To:</span>
            <span className="text-white font-medium">{selectedDeliveryAddress.fullAddress}, {selectedDeliveryAddress.city}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated Delivery:</span>
            <span className="text-emerald-400 font-medium">Within 2 Business Days</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <NeonButton variant="cyan" onClick={() => setActiveView('orders')}>
            View in Order History
          </NeonButton>
          <NeonButton variant="outline" onClick={() => setActiveView('marketplace')}>
            Continue Shopping
          </NeonButton>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Explore our certified surplus deals and let Price Guardian verify your discounts before checkout.
        </p>
        <NeonButton variant="cyan" onClick={() => setActiveView('marketplace')}>
          Explore Marketplace
        </NeonButton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Smart Cart & Budget Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time surplus evaluation and budget enforcement.
          </p>
        </div>

        {/* Delivery Address Pill */}
        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate max-w-[200px]">{selectedDeliveryAddress.city}</span>
          <button
            onClick={() => setActiveView('settings')}
            className="text-[11px] text-cyan-400 hover:underline ml-1 cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* Budget Status Alert Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
          isOverBudget
            ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOverBudget ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Cart Total: ₹{cartTotal.toLocaleString('en-IN')}</span>
              <span>·</span>
              <span>Target Budget: ₹{budget.cartBudgetLimit.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[11px] mt-0.5">
              {isOverBudget
                ? `Cart exceeds your budget target by ₹${overAmount.toLocaleString('en-IN')}! Run AI Optimizer to find cheaper alternatives.`
                : `You are ₹${(budget.cartBudgetLimit - cartTotal).toLocaleString('en-IN')} safely under your cart budget target.`}
            </div>
          </div>
        </div>

        {/* Set Target Form */}
        <form onSubmit={handleUpdateBudgetLimit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="number"
            value={targetBudgetInput}
            onChange={(e) => setTargetBudgetInput(Number(e.target.value))}
            placeholder="Budget (₹)"
            className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
          >
            Set Limit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Items ({cart.length})</span>
            <span>Quantity / Price</span>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-4 items-center justify-between"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">
                      <span>{item.product.brand}</span> · <span>{item.product.condition}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-white line-clamp-1">
                      {item.product.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-cyan-300 mt-1">
                      ₹{item.product.currentPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950 px-2 py-1">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="text-slate-400 hover:text-white px-1.5 text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono text-xs text-white font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="text-slate-400 hover:text-white px-1.5 text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Smart Cart Optimization Trigger */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-blue-950/30 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Cart Budget Optimizer</span>
              </div>
              <NeonButton
                variant="cyan"
                size="sm"
                onClick={handleRunOptimization}
                isLoading={isOptimizing}
              >
                <span>Analyze & Suggest Cheaper Alternatives</span>
              </NeonButton>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our model evaluates your items against certified surplus inventory to identify cheaper equivalents with matching specifications.
            </p>
          </div>

          {/* Optimization Suggestions Panel */}
          {optimizationResult && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-xs font-bold text-cyan-300">
                  Recommended Budget Replacements
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  Projected Savings: ₹{optimizationResult.savings.toLocaleString('en-IN')}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {optimizationResult.explanation}
              </p>

              {optimizationResult.replacements.map((rep, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="line-through text-slate-500">{rep.originalProduct.name}</span>
                    <span className="font-mono text-slate-500 line-through">
                      ₹{rep.originalProduct.currentPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{rep.suggestedAlternative.name}</span>
                    </span>
                    <span className="font-mono text-emerald-400">
                      ₹{rep.suggestedAlternative.currentPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{rep.reason}</div>
                </div>
              ))}

              {optimizationResult.replacements.length > 0 && (
                <NeonButton
                  variant="cyan"
                  size="md"
                  className="w-full"
                  onClick={handleApplyReplacement}
                  isSuccess={optimizationApplied}
                >
                  <span>Apply Suggested Replacements (Save ₹{optimizationResult.savings.toLocaleString('en-IN')})</span>
                </NeonButton>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white">Order Summary</h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Surplus Clearance Savings</span>
                <span className="font-mono font-semibold">-₹{cartSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className="font-mono text-white">
                  {cartSubtotal > 1000 ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="font-mono text-cyan-300 text-lg">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Payment Method</div>
              <div className="space-y-2">
                <label
                  onClick={() => setSelectedPayment('Cash on Delivery (COD)')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedPayment === 'Cash on Delivery (COD)'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-medium">Cash on Delivery (COD)</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'Cash on Delivery (COD)'}
                    onChange={() => setSelectedPayment('Cash on Delivery (COD)')}
                    className="accent-cyan-400 cursor-pointer"
                  />
                </label>

                <label
                  onClick={() => setSelectedPayment('Demo Instant Card')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedPayment === 'Demo Instant Card'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-medium">Demo Instant Card (Simulated Sandbox)</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'Demo Instant Card'}
                    onChange={() => setSelectedPayment('Demo Instant Card')}
                    className="accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Final Place Order CTA */}
            <NeonButton
              variant="cyan"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
            >
              <span>Place Order (₹{cartTotal.toLocaleString('en-IN')})</span>
            </NeonButton>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Risk · 7-Day Verified Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
