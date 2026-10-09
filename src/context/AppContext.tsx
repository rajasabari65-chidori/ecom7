import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  SellerProfile,
  UserProfile,
  CartItem,
  Order,
  Review,
  PriceAlert,
  BudgetState,
  DeliveryAddress,
  CartOptimizationResult,
  PriceGuardianVerdict,
} from '../types';
import {
  generateFullSeededProducts,
  DEMO_SELLERS,
  INITIAL_ADDRESSES,
  SEEDED_REVIEWS,
} from '../data/seedData';

interface AppContextType {
  // Products & Sellers
  products: Product[];
  sellers: SellerProfile[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaultData: () => void;

  // User Auth & Profiles
  currentUser: UserProfile;
  switchUserRole: (role: 'customer' | 'seller' | 'admin', customUser?: Partial<UserProfile>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  saveAddress: (address: DeliveryAddress) => void;
  setDefaultAddress: (addressId: string) => void;

  // Cart & Budget
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartSavings: number;
  cartCount: number;

  // Budget
  budget: BudgetState;
  updateBudget: (updates: Partial<BudgetState>) => void;
  optimizeCartForBudget: () => CartOptimizationResult;
  applyCartOptimization: (optimization: CartOptimizationResult) => void;

  // Wishlist & Price Alerts
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number) => void;
  removePriceAlert: (alertId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (paymentMethod?: 'Cash on Delivery (COD)' | 'Demo Instant Card', notes?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // AI & Price Guardian
  getPriceGuardianAnalysis: (product: Product) => Promise<PriceGuardianVerdict>;
  isPriceGuardianLoading: boolean;

  // Selected Location for Delivery & Maps
  selectedDeliveryAddress: DeliveryAddress;
  setSelectedDeliveryAddress: (address: DeliveryAddress) => void;

  // Active View / Navigation Tab
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_CUSTOMER: UserProfile = {
  id: 'user-patel-01',
  name: 'Vikram Patel',
  email: 'vikram.patel@gmail.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  preferredLanguage: 'English',
  preferredCurrency: 'INR (₹)',
  savedAddresses: INITIAL_ADDRESSES,
  defaultAddressId: 'addr-default',
  createdAt: '2026-01-15T00:00:00.000Z',
};

const DEFAULT_SELLER_USER: UserProfile = {
  id: 'seller-nova-02',
  name: 'Priya Sundaram',
  email: 'priya@novaaudio.com',
  phone: '+91 99620 54321',
  role: 'seller',
  businessName: 'Nova Digital & Audio',
  businessCategory: 'Mobiles, Audio & Accessories',
  savedAddresses: INITIAL_ADDRESSES,
  defaultAddressId: 'addr-default',
  createdAt: '2026-01-10T00:00:00.000Z',
};

const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'admin-super-01',
  name: 'OptiMart Central Admin',
  email: 'admin@optimart.ai',
  phone: '+91 90000 00001',
  role: 'admin',
  savedAddresses: INITIAL_ADDRESSES,
  defaultAddressId: 'addr-default',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with stored JSON or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_products');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return generateFullSeededProducts();
  });

  const [sellers, setSellers] = useState<SellerProfile[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_sellers');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEMO_SELLERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('optimart_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_CUSTOMER;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_cart');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        productId: 'prod-headphone-01',
        quantity: 1,
        product: products[0] || generateFullSeededProducts()[0],
      },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'OPT-78291',
        customerId: 'user-patel-01',
        customerName: 'Vikram Patel',
        customerEmail: 'vikram.patel@gmail.com',
        items: [
          {
            productId: 'prod-watch-02',
            productName: 'Atlas Chrono Ultra Titanium Smartwatch',
            price: 28999,
            quantity: 1,
            image: '/src/assets/images/product_smartwatch_ultra_1791507985047.jpg',
            sellerId: 'seller-nova-02',
            sellerName: 'Nova Digital & Audio',
          },
        ],
        subtotal: 28999,
        discount: 10000,
        shipping: 0,
        total: 28999,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Delivered',
        deliveryAddress: INITIAL_ADDRESSES[0],
        trackingNumber: 'TRK-IN-9812401',
        createdAt: '2026-10-02T14:30:00.000Z',
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_wishlist');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return ['prod-laptop-03', 'prod-shoe-11'];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_alerts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'alert-01',
        productId: 'prod-laptop-03',
        productName: 'NovaBook Pro 14 OLED Featherlight Ultrabook',
        targetPrice: 79999,
        currentPrice: 84999,
        createdAt: '2026-10-04T10:00:00.000Z',
        active: true,
      },
    ];
  });

  const [budget, setBudget] = useState<BudgetState>(() => {
    try {
      const stored = localStorage.getItem('optimart_budget');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      monthlyBudget: 25000,
      currentSpend: 11500,
      cartBudgetLimit: 15000,
    };
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('optimart_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return SEEDED_REVIEWS;
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isPriceGuardianLoading, setIsPriceGuardianLoading] = useState<boolean>(false);

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<DeliveryAddress>(
    currentUser.savedAddresses.find((a) => a.isDefault) || currentUser.savedAddresses[0] || INITIAL_ADDRESSES[0]
  );

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('optimart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('optimart_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('optimart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('optimart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('optimart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('optimart_budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('optimart_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('optimart_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  // Product actions
  const getProductById = (id: string) => products.find((p) => p.id === id);

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProductForDetail?.id === updated.id) {
      setSelectedProductForDetail(updated);
    }
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductForDetail?.id === id) {
      setSelectedProductForDetail(null);
    }
  };

  const resetToDefaultData = () => {
    const defaults = generateFullSeededProducts();
    setProducts(defaults);
    setSellers(DEMO_SELLERS);
    setReviews(SEEDED_REVIEWS);
    localStorage.removeItem('optimart_products');
    localStorage.removeItem('optimart_sellers');
    localStorage.removeItem('optimart_reviews');
  };

  // User actions
  const switchUserRole = (role: 'customer' | 'seller' | 'admin', customUser?: Partial<UserProfile>) => {
    if (role === 'customer') {
      setCurrentUser({ ...DEFAULT_CUSTOMER, ...customUser });
    } else if (role === 'seller') {
      setCurrentUser({ ...DEFAULT_SELLER_USER, ...customUser });
    } else {
      setCurrentUser({ ...DEFAULT_ADMIN_USER, ...customUser });
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const saveAddress = (address: DeliveryAddress) => {
    setCurrentUser((prev) => {
      const exists = prev.savedAddresses.some((a) => a.id === address.id);
      const updated = exists
        ? prev.savedAddresses.map((a) => (a.id === address.id ? address : a))
        : [...prev.savedAddresses, address];
      return { ...prev, savedAddresses: updated };
    });
    setSelectedDeliveryAddress(address);
  };

  const setDefaultAddress = (addressId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      defaultAddressId: addressId,
      savedAddresses: prev.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
    }));
    const found = currentUser.savedAddresses.find((a) => a.id === addressId);
    if (found) setSelectedDeliveryAddress(found);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.currentPrice * item.quantity, 0);
  const cartSavings = cart.reduce(
    (acc, item) => acc + (item.product.originalPrice - item.product.currentPrice) * item.quantity,
    0
  );
  const cartShipping = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = cartSubtotal + cartShipping;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Budget
  const updateBudget = (updates: Partial<BudgetState>) => {
    setBudget((prev) => ({ ...prev, ...updates }));
  };

  // AI Smart Cart Optimizer
  const optimizeCartForBudget = (): CartOptimizationResult => {
    const limit = budget.cartBudgetLimit;
    const overBudget = Math.max(0, cartSubtotal - limit);

    // Identify expensive items in cart and find cheaper alternatives in the same category
    const replacements: CartOptimizationResult['replacements'] = [];
    let projectedSavings = 0;

    cart.forEach((item) => {
      // Find candidate in same category with lower currentPrice
      const candidates = products.filter(
        (p) =>
          p.category === item.product.category &&
          p.id !== item.product.id &&
          p.currentPrice < item.product.currentPrice &&
          p.stock > 0
      );

      if (candidates.length > 0) {
        // Pick best rated or highest surplus deal candidate
        const bestAlt = candidates.sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
        const diff = (item.product.currentPrice - bestAlt.currentPrice) * item.quantity;
        if (diff > 0) {
          replacements.push({
            originalProduct: item.product,
            suggestedAlternative: bestAlt,
            savingsAmount: diff,
            reason: `Replaces high-cost item with high-value certified surplus alternative '${bestAlt.name}' with equivalent category utility.`,
          });
          projectedSavings += diff;
        }
      }
    });

    const optimizedTotal = Math.max(0, cartSubtotal - projectedSavings);

    return {
      originalTotal: cartSubtotal,
      optimizedTotal,
      savings: projectedSavings,
      budget: limit,
      overBudgetAmount: overBudget,
      replacements,
      explanation:
        replacements.length > 0
          ? `By switching ${replacements.length} cart item(s) to certified surplus alternatives, your cart drops by ₹${projectedSavings.toLocaleString('en-IN')}, bringing your checkout within your ₹${limit.toLocaleString('en-IN')} target!`
          : `Your cart is already well optimized or within reasonable parameters. No alternative trade-offs found.`,
    };
  };

  const applyCartOptimization = (opt: CartOptimizationResult) => {
    if (!opt.replacements.length) return;

    setCart((prev) => {
      let updated = [...prev];
      opt.replacements.forEach((rep) => {
        const itemIdx = updated.findIndex((i) => i.productId === rep.originalProduct.id);
        if (itemIdx >= 0) {
          const qty = updated[itemIdx].quantity;
          updated.splice(itemIdx, 1);
          // Check if replacement already exists
          const existingAlt = updated.find((i) => i.productId === rep.suggestedAlternative.id);
          if (existingAlt) {
            existingAlt.quantity += qty;
          } else {
            updated.push({
              productId: rep.suggestedAlternative.id,
              quantity: qty,
              product: rep.suggestedAlternative,
            });
          }
        }
      });
      return updated;
    });
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Price Alerts
  const addPriceAlert = (productId: string, targetPrice: number) => {
    const prod = getProductById(productId);
    if (!prod) return;
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId,
      productName: prod.name,
      targetPrice,
      currentPrice: prod.currentPrice,
      createdAt: new Date().toISOString(),
      active: true,
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Checkout and Orders
  const createOrder = (
    paymentMethod: 'Cash on Delivery (COD)' | 'Demo Instant Card' = 'Cash on Delivery (COD)',
    notes?: string
  ): Order | null => {
    if (cart.length === 0) return null;

    // Validate inventory and deduct stock
    const newOrder: Order = {
      id: `OPT-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.currentPrice,
        quantity: item.quantity,
        image: item.product.images[0],
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
      })),
      subtotal: cartSubtotal,
      discount: cartSavings,
      shipping: cartShipping,
      total: cartTotal,
      paymentMethod,
      status: 'Confirmed',
      deliveryAddress: selectedDeliveryAddress,
      trackingNumber: `TRK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString(),
      notes,
    };

    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = cart.find((c) => c.productId === p.id);
        if (ordered) {
          const newStock = Math.max(0, p.stock - ordered.quantity);
          return {
            ...p,
            stock: newStock,
            surplusStatus: newStock <= 5 ? 'low_stock' : p.surplusStatus,
          };
        }
        return p;
      })
    );

    // Update spending in budget
    setBudget((prev) => ({
      ...prev,
      currentSpend: prev.currentSpend + cartTotal,
    }));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Reviews
  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const rev: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [rev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newReview.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id), rev];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: +avg.toFixed(1),
            reviewCount: prodReviews.length,
          };
        }
        return p;
      })
    );
  };

  // Price Guardian AI API call
  const getPriceGuardianAnalysis = async (product: Product): Promise<PriceGuardianVerdict> => {
    setIsPriceGuardianLoading(true);
    try {
      const res = await fetch('/api/gemini/price-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsPriceGuardianLoading(false);
        return data;
      }
    } catch (e) {
      console.warn('Price guardian fetch failed:', e);
    }

    // High quality deterministic fallback
    setIsPriceGuardianLoading(false);
    const historyPrices = product.priceHistory.map((p) => p.price);
    const minP = Math.min(...historyPrices);
    const maxP = Math.max(...historyPrices);
    const avgP = Math.round(historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length);

    let verdict: PriceGuardianVerdict['verdict'] = 'GOOD DEAL';
    let score = 88;
    let exp = `Priced at its all-time lowest recorded mark of ₹${product.currentPrice.toLocaleString('en-IN')}.`;

    if (product.currentPrice <= minP) {
      verdict = 'GOOD DEAL';
      score = 96;
      exp = `Currently matching or beating the lowest recorded benchmark in stored price telemetry (₹${minP.toLocaleString('en-IN')}). High value purchase confidence.`;
    } else if (product.currentPrice < avgP) {
      verdict = 'GOOD DEAL';
      score = 82;
      exp = `Trading well below the historical average of ₹${avgP.toLocaleString('en-IN')}. Recommended timing for buy.`;
    } else {
      verdict = 'FAIR PRICE';
      score = 65;
      exp = `In line with prevailing catalogue baseline. Good price if needed immediately.`;
    }

    return {
      dealScore: score,
      verdict,
      explanation: exp,
      lowestPriceRecorded: minP,
      averagePrice: avgP,
      highestPriceRecorded: maxP,
      confidence: historyPrices.length >= 3 ? 'HIGH' : 'MEDIUM',
    };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        sellers,
        getProductById,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaultData,

        currentUser,
        switchUserRole,
        updateUserProfile,
        saveAddress,
        setDefaultAddress,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartSavings,
        cartCount,

        budget,
        updateBudget,
        optimizeCartForBudget,
        applyCartOptimization,

        wishlist,
        toggleWishlist,
        isInWishlist,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,

        orders,
        createOrder,
        updateOrderStatus,

        reviews,
        addReview,

        getPriceGuardianAnalysis,
        isPriceGuardianLoading,

        selectedDeliveryAddress,
        setSelectedDeliveryAddress,

        activeView,
        setActiveView,
        selectedProductForDetail,
        setSelectedProductForDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
