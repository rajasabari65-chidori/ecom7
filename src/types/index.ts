export type UserRole = 'customer' | 'seller' | 'admin';

export interface DeliveryAddress {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  savedAddresses: DeliveryAddress[];
  defaultAddressId?: string;
  businessName?: string;
  businessCategory?: string;
  createdAt: string;
}

export interface PricePoint {
  date: string;
  price: number;
  event?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  images: string[];
  originalPrice: number; // in INR
  currentPrice: number; // in INR
  costPrice: number; // in INR (seller only)
  discountPercentage: number;
  stock: number;
  minAcceptablePrice: number;
  salesVelocity: number; // units sold per month
  expectedMonthlyDemand: number;
  productAgeDays: number;
  expiryDate?: string;
  surplusStatus: 'surplus' | 'normal' | 'low_stock';
  surplusRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  excessQuantityEstimate: number;
  recommendedDiscount: number;
  suggestedPrice: number;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  sellerCoords: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  deliveryEstimateDays: number;
  returnPolicy: string;
  warranty: string;
  condition: 'Brand New' | 'Open Box (Certified)' | 'Factory Surplus' | 'Excess Inventory';
  priceHistory: PricePoint[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  coords: { lat: number; lng: number };
  rating: number;
  totalSales: number;
  activeProductsCount: number;
  verified: boolean;
  avatar?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'Cash on Delivery (COD)' | 'Demo Instant Card';
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  trackingNumber: string;
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  active: boolean;
}

export interface BudgetState {
  monthlyBudget: number;
  currentSpend: number;
  cartBudgetLimit: number;
}

export interface PriceGuardianVerdict {
  dealScore: number; // 0 - 100
  verdict: 'GOOD DEAL' | 'FAIR PRICE' | 'CONSIDER WAITING' | 'COMPARE ALTERNATIVES' | 'INSUFFICIENT DATA';
  explanation: string;
  lowestPriceRecorded: number;
  averagePrice: number;
  highestPriceRecorded: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LIMITED DATA';
  alternativeProduct?: Product;
}

export interface SurplusRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  expectedDemand: number;
  excessStock: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentPrice: number;
  suggestedPrice: number;
  recommendedDiscount: number;
  clearanceDaysEstimate: number;
  estimatedFinancialRecovery: number;
  explanation: string;
}

export interface DemandForecast {
  productId: string;
  forecast7Days: number;
  forecast30Days: number;
  confidenceScore: number;
  risk: 'Stockout Risk' | 'Optimal Velocity' | 'Surplus Risk';
  replenishmentRecommendation: number;
  trend: 'UPWARD' | 'STABLE' | 'DECLINING';
  historicalDataPoints: { date: string; sales: number }[];
  projectedDataPoints: { date: string; sales: number }[];
}

export interface CartOptimizationResult {
  originalTotal: number;
  optimizedTotal: number;
  savings: number;
  budget: number;
  overBudgetAmount: number;
  replacements: {
    originalProduct: Product;
    suggestedAlternative: Product;
    savingsAmount: number;
    reason: string;
  }[];
  explanation: string;
}
