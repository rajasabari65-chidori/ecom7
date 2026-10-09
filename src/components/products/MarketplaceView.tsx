import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Heart,
  Percent,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    sellers,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProductForDetail,
    setActiveView,
  } = useApp();

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeller, setSelectedSeller] = useState<string>('All');
  const [surplusOnly, setSurplusOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(120000);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Derive unique categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCategory && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Seller
      if (selectedSeller !== 'All' && p.sellerId !== selectedSeller) return false;

      // Surplus
      if (surplusOnly && p.surplusStatus !== 'surplus') return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Price
      if (p.currentPrice > maxPrice) return false;

      // Discount
      if (p.discountPercentage < minDiscount) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
      if (sortBy === 'price-high') return b.currentPrice - a.currentPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'deal-score') return (b.excessQuantityEstimate || 0) - (a.excessQuantityEstimate || 0);
      return 0; // default relevant
    });
  }, [products, search, selectedCategory, selectedSeller, surplusOnly, minRating, maxPrice, minDiscount, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSeller('All');
    setSurplusOnly(false);
    setMinRating(0);
    setMaxPrice(120000);
    setMinDiscount(0);
    setSortBy('relevant');
    setCurrentPage(1);
  };

  const openProductDetail = (p: Product) => {
    setSelectedProductForDetail(p);
    setActiveView('product-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Marketplace & Surplus Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse {products.length} pre-registered items, verified surplus clearouts, and Price Guardian deals.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search brand, name, specs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Surplus Only Toggle */}
          <div className="pt-1">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-rose-400" />
                <span>Surplus Deals Only</span>
              </span>
              <input
                type="checkbox"
                checked={surplusOnly}
                onChange={(e) => {
                  setSurplusOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Categories */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2.5">Category</div>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/15 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {selectedCategory === cat && <Check className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>Max Price</span>
              <span className="font-mono text-cyan-300 font-bold">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="120000"
              step="1000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Min Discount */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>Min Discount</span>
              <span className="font-mono text-emerald-400 font-bold">{minDiscount}%+</span>
            </div>
            <div className="flex gap-1">
              {[0, 20, 35, 50].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setMinDiscount(d);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1 text-[11px] rounded-lg border font-mono transition-colors cursor-pointer ${
                    minDiscount === d
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {d === 0 ? 'All' : `${d}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Seller Filter */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Verified Sellers</div>
            <select
              value={selectedSeller}
              onChange={(e) => {
                setSelectedSeller(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Sellers (5 Demo Hubs)</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.businessName} ({s.rating}★)
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Customer Rating</div>
            <div className="flex gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setMinRating(r);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1 text-[11px] rounded-lg border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    minRating === r
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{r === 0 ? 'All' : `${r}★`}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Products Grid & Controls */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> matching products
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount (%)</option>
                <option value="rating">Highest Rated</option>
                <option value="deal-score">Best AI Surplus Score</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your active filters. Try adjusting your search query, increasing max price, or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => {
                const inWishlist = wishlist.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="group bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        onClick={() => openProductDetail(p)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />

                      {/* Surplus Badge */}
                      {p.surplusStatus === 'surplus' && (
                        <div className="absolute top-2.5 left-2.5 bg-rose-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md font-mono">
                          {p.discountPercentage}% OFF
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                          inWishlist
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/80 text-slate-400 hover:text-white'
                        }`}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Condition Tag */}
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md backdrop-blur-md">
                        {p.condition}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Unboxed Metadata */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                          <span>{p.brand}</span>
                          <span>·</span>
                          <span className="truncate">{p.category}</span>
                        </div>

                        <h3
                          onClick={() => openProductDetail(p)}
                          className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer mb-2"
                        >
                          {p.name}
                        </h3>

                        {/* Rating & Stock */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-semibold text-white">{p.rating}</span>
                            <span className="text-slate-500">({p.reviewCount})</span>
                          </div>
                          <span className={p.stock < 10 ? 'text-amber-400 font-medium' : 'text-slate-400'}>
                            {p.stock} units left
                          </span>
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="pt-3 border-t border-slate-800/80">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-base font-bold text-white font-mono">
                              ₹{p.currentPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-500 line-through ml-2 font-mono">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            Save ₹{(p.originalPrice - p.currentPrice).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openProductDetail(p)}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center transition-colors cursor-pointer"
                          >
                            Details & Trend
                          </button>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-400 px-3 font-mono">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
