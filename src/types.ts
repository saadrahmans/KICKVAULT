export type PageView = 'landing' | 'products' | 'detail' | 'cart' | 'payment' | 'order-success';

export interface SneakerColorway {
  id: string;
  name: string;
  hex: string;
  images: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  sizePurchased: number;
  avatar?: string;
}

export interface Sneaker {
  id: string;
  name: string;
  brand: 'Nike' | 'Jordan' | 'Adidas' | 'New Balance' | 'Asics' | 'Salomon' | 'Puma' | 'Yeezy';
  model: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  isHot?: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
  category: 'retro' | 'running' | 'streetwear' | 'basketball' | 'lifestyle';
  gender: 'men' | 'women' | 'unisex';
  colorways: SneakerColorway[];
  availableSizes: number[];
  inStock: boolean;
  stockRemaining: number;
  sku: string;
  releaseDate: string;
  story: string;
  details: string[];
  specs: {
    upperMaterial: string;
    soleMaterial: string;
    cushioning: string;
    closure: string;
    origin: string;
  };
  reviews: Review[];
}

export interface CartItem {
  id: string; // unique cart item id
  sneakerId: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  colorwayId: string;
  colorwayName: string;
  size: number;
  sizeType: 'US Men' | 'US Women' | 'EU' | 'UK';
  image: string;
  quantity: number;
  sku: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
}

export interface PaymentDetails {
  method: 'card' | 'wallet' | 'installments';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  walletProvider?: 'apple' | 'google' | 'paypal';
  installmentsProvider?: 'klarna' | 'afterpay';
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  appliedPromoCode?: string;
  shippingCost: number;
  taxAmount: number;
  total: number;
  status: 'Order Placed' | 'Authenticating' | 'Packed' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
  trackingCode: string;
}

export interface FilterState {
  searchQuery: string;
  brand: string;
  category: string;
  gender: string;
  minPrice: number;
  maxPrice: number;
  size: number | null;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
