import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PriceGuardianVerdict, Review } from '../../types';
import { PriceChart } from '../charts/PriceChart';
import { NeonButton } from '../ui/NeonButton';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Shield,
  Heart,
  Bell,
  ShoppingBag,
  Store,
  MapPin,
  CheckCircle2,
  Info,
  Sparkles,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    setActiveView,
    addToCart,
    wishlist,
    toggleWishlist,
    addPriceAlert,
    reviews,
    addReview,
    products,
    getPriceGuardianAnalysis,
  } = useApp();

  const product = selectedProductForDetail;

  const [quantity, setQuantity] = useState(1);
  const [analysis, setAnalysis] = useState<PriceGuardianVerdict | null>(null);
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(0);
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'history'>('history');

  // New review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setTargetAlertPrice(Math.round(product.currentPrice * 0.9));
      getPriceGuardianAnalysis(product).then((res) => {
        setAnalysis(res);
      });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 mb-4">No product selected.</p>
        <NeonButton onClick={() => setActiveView('marketplace')}>
          Return to Marketplace
        </NeonButton>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Similar alternatives in the same category
  const alternatives = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAlertPrice > 0) {
      addPriceAlert(product.id, targetAlertPrice);
      setAlertSubmitted(true);
      setTimeout(() => setAlertSubmitted(false), 3000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      customerName: reviewName.trim() || 'Verified Shopper',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
    });

    setReviewTitle('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setActiveView('smart-cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Catalogue */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveView('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="text-xs text-slate-500">
          Product ID: <span className="font-mono text-slate-400">{product.id}</span>
        </div>
      </div>

      {/* Main Grid: Gallery & Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.surplusStatus === 'surplus' && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-lg font-mono shadow-lg">
                {product.discountPercentage}% SURPLUS CLEARANCE
              </div>
            )}
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-lg backdrop-blur-md">
              {product.condition}
            </div>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{product.deliveryEstimateDays}-Day Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{product.returnPolicy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{product.warranty}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div>
            {/* Metadata Line */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-cyan-400">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
              <span>·</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-slate-500">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    ₹{product.currentPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {product.discountPercentage}% OFF
                </div>
              </div>

              <div className="text-xs text-emerald-400/90 font-medium">
                You save ₹{(product.originalPrice - product.currentPrice).toLocaleString('en-IN')} on this surplus item.
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Stock Available:</span>
                <span className={`font-semibold ${product.stock < 10 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {product.stock} units left in warehouse
                </span>
              </div>
            </div>

            {/* Seller Information */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{product.sellerName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{product.sellerLocation}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Verified Seller
              </span>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 text-slate-400 hover:text-white text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono text-sm text-white font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-2 text-slate-400 hover:text-white text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <NeonButton
                  variant="cyan"
                  size="md"
                  className="flex-1"
                  onClick={() => addToCart(product, quantity)}
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  <span>Add to Cart</span>
                </NeonButton>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isSaved ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <NeonButton
                variant="blue"
                size="md"
                className="w-full"
                onClick={handleBuyNow}
              >
                <span>Instant Checkout (₹{(product.currentPrice * quantity).toLocaleString('en-IN')})</span>
              </NeonButton>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Price Guardian Analysis | Specifications | Customer Reviews */}
      <div className="mt-14 pt-8 border-t border-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>AI Price Guardian & Trend</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Product Specifications</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Customer Reviews ({productReviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Price Guardian & Historical Trend */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    <span>6-Month Price Trend & Historical Benchmarks</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live audit based on real internal transaction checkpoints.
                  </p>
                </div>

                {analysis && (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Deal Score</div>
                      <div className="text-lg font-black text-cyan-300 font-mono">
                        {analysis.dealScore}/100
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg font-mono ${
                        analysis.verdict === 'GOOD DEAL'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {analysis.verdict}
                    </div>
                  </div>
                )}
              </div>

              {/* Chart */}
              <PriceChart
                data={product.priceHistory}
                currentPrice={product.currentPrice}
                height={220}
              />

              {/* AI Rationale */}
              {analysis && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 flex gap-3 text-xs leading-relaxed text-slate-300">
                  <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-cyan-300 mb-1">
                      Price Guardian Rationale
                    </div>
                    <div>{analysis.explanation}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Target Price Alert Box */}
            <div className="lg:col-span-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>Set Target Price Alert</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Notify me in-app whenever this product’s surplus clearance drops to or below my target price.
                </p>

                <form onSubmit={handleCreateAlert} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Target Price (₹)
                    </label>
                    <input
                      type="number"
                      value={targetAlertPrice}
                      onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <NeonButton
                    type="submit"
                    variant="cyan"
                    size="sm"
                    className="w-full"
                    isSuccess={alertSubmitted}
                  >
                    <span>Activate Target Price Alert</span>
                  </NeonButton>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-500">
                Data Grounding: Price alerts evaluate continuously upon catalog updates.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 max-w-3xl">
            <h3 className="text-sm font-bold text-white mb-4">Technical Specifications</h3>
            <div className="divide-y divide-slate-800/80">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between text-xs">
                  <span className="text-slate-400">{key}</span>
                  <span className="text-slate-200 font-medium text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">
                Verified Buyer Reviews ({productReviews.length})
              </h3>

              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-500">No reviews yet for this product. Be the first to share your experience!</p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <span>{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-normal">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Purchase</span>
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>

                    <div className="text-xs font-semibold text-slate-200">{rev.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-5 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-sm font-bold text-white mb-3">Write a Customer Review</h3>
              {reviewSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  Thank you! Your verified review has been recorded and factored into this product's rating.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Anandita Roy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReviewRating(r)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono border cursor-pointer ${
                            reviewRating === r
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          {r}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Best price-to-performance ratio"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the build quality, delivery speed, and surplus condition..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <NeonButton type="submit" variant="cyan" size="sm" className="w-full">
                    Submit Review
                  </NeonButton>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Surplus Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-16 pt-8 border-t border-slate-900">
          <h2 className="text-lg font-bold text-white mb-6">
            Similar Certified Alternatives in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                onClick={() => {
                  setSelectedProductForDetail(alt);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all cursor-pointer flex gap-3"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={alt.images[0]}
                    alt={alt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 truncate">{alt.brand}</div>
                    <div className="text-xs font-semibold text-white line-clamp-1 group-hover:text-cyan-300">
                      {alt.name}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="font-bold text-white">₹{alt.currentPrice.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-400 text-[11px] font-sans">{alt.discountPercentage}% off</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
