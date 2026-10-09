import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, setActiveView, setSelectedProductForDetail, getProductById } = useApp();

  const statuses: OrderStatus[] = ['Confirmed', 'Packed', 'Shipped', 'Delivered'];

  const getStatusStepIndex = (status: OrderStatus) => {
    return statuses.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Your Orders & Live Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor shipment milestones, delivery addresses, and surplus warranties.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore verified surplus electronics and household products on our marketplace.
          </p>
          <button
            onClick={() => setActiveView('marketplace')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStepIndex(order.status);
            return (
              <div
                key={order.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{order.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                        {order.trackingNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-white font-mono">
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-400">
                      Saved ₹{order.discount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Progress Milestone Tracker */}
                <div className="py-2">
                  <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                    <span>Delivery Stage: <span className="text-cyan-400">{order.status}</span></span>
                    {/* Demo status advancement toggle */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Advance Demo:</span>
                      {statuses.map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            order.status === st
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                              : 'border-slate-800 text-slate-500 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {statuses.map((st, idx) => {
                      const isComplete = idx <= currentStep;
                      return (
                        <div key={st} className="space-y-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isComplete ? 'bg-cyan-400' : 'bg-slate-800'
                            }`}
                          />
                          <div className={`text-[10px] font-medium ${isComplete ? 'text-white' : 'text-slate-600'}`}>
                            {st}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="divide-y divide-slate-800/80 pt-2 border-t border-slate-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white line-clamp-1">
                            {item.productName}
                          </h4>
                          <div className="text-[11px] text-slate-400">
                            Seller: {item.sellerName} · Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => {
                            const p = getProductById(item.productId);
                            if (p) {
                              setSelectedProductForDetail(p);
                              setActiveView('product-detail');
                            }
                          }}
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 ml-auto cursor-pointer"
                        >
                          <span>Review & Trend</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Details */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Delivering to: <span className="text-slate-200 font-medium">{order.deliveryAddress.fullAddress}, {order.deliveryAddress.city} - {order.deliveryAddress.postalCode}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">Standard Insured Courier</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
