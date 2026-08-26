import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Sneaker,
  CartItem,
  PageView,
  FilterState,
  Order,
  ShippingMethod,
  ShippingAddress,
  PaymentDetails,
} from '../types';
import { INITIAL_SNEAKERS, SHIPPING_METHODS, PROMO_CODES } from '../data/sneakers';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface SneakerContextType {
  // Navigation & Views
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedSneaker: Sneaker | null;
  setSelectedSneaker: (sneaker: Sneaker | null) => void;
  viewSneakerDetail: (sneaker: Sneaker) => void;

  // Sneakers Data & Filters
  sneakers: Sneaker[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setBrandFilter: (brand: string) => void;
  setCategoryFilter: (category: string) => void;
  filteredSneakers: Sneaker[];

  // Cart
  cart: CartItem[];
  addToCart: (sneaker: Sneaker, colorwayId: string, size: number, quantity?: number, sizeType?: 'US Men' | 'US Women' | 'EU' | 'UK') => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  selectedShipping: ShippingMethod;
  setSelectedShipping: (method: ShippingMethod) => void;
  shippingCost: number;
  taxAmount: number;
  grandTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (sneakerId: string) => void;
  isInWishlist: (sneakerId: string) => boolean;

  // Checkout & Orders
  shippingAddress: ShippingAddress;
  setShippingAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;
  placedOrders: Order[];
  currentOrder: Order | null;
  processOrder: () => Promise<Order>;

  // Modals & UI
  isGithubModalOpen: boolean;
  setIsGithubModalOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  brand: 'All',
  category: 'All',
  gender: 'All',
  minPrice: 50,
  maxPrice: 1000,
  size: null,
  inStockOnly: false,
  sortBy: 'featured',
};

const defaultShippingAddress: ShippingAddress = {
  fullName: 'Marcus Aurelius',
  email: 'marcus.kicks@vaultsneakers.com',
  phone: '(555) 382-9012',
  addressLine1: '742 Evergreen Terrace',
  addressLine2: 'Apt 4B',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90001',
  country: 'United States',
};

const defaultPaymentDetails: PaymentDetails = {
  method: 'card',
  cardNumber: '4532 8921 0034 8923',
  cardHolder: 'MARCUS AURELIUS',
  expiryDate: '12/28',
  cvv: '842',
  saveCard: true,
  walletProvider: 'apple',
  installmentsProvider: 'klarna',
};

const SneakerContext = createContext<SneakerContextType | undefined>(undefined);

export const SneakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sneakers] = useState<Sneaker[]>(INITIAL_SNEAKERS);
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(INITIAL_SNEAKERS[0]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load Cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kv_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial item so cart is ready to preview
    const sample = INITIAL_SNEAKERS[0];
    return [
      {
        id: 'cart-sample-1',
        sneakerId: sample.id,
        name: sample.name,
        brand: sample.brand,
        model: sample.model,
        price: sample.price,
        colorwayId: sample.colorways[0].id,
        colorwayName: sample.colorways[0].name,
        size: 10.5,
        sizeType: 'US Men',
        image: sample.colorways[0].images[0],
        quantity: 1,
        sku: sample.sku,
      },
    ];
  });

  // Load Wishlist from localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kv_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['aj1-lost-found', 'nb-990v6-grey'];
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>('VAULT20');
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(defaultShippingAddress);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(defaultPaymentDetails);
  
  const [placedOrders, setPlacedOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('kv_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kv_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kv_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Save Orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kv_orders', JSON.stringify(placedOrders));
    } catch {
      // ignore
    }
  }, [placedOrders]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const viewSneakerDetail = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const setBrandFilter = (brand: string) => {
    setFilters((prev) => ({ ...prev, brand }));
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCategoryFilter = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = (sneakerId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(sneakerId);
      if (exists) {
        showToast('Removed from Grails', 'Sneaker removed from your saved list', 'info');
        return prev.filter((id) => id !== sneakerId);
      } else {
        showToast('Saved to Grails', 'Added to your personal sneaker vault wishlist', 'success');
        return [...prev, sneakerId];
      }
    });
  };

  const isInWishlist = (sneakerId: string) => wishlist.includes(sneakerId);

  const addToCart = (
    sneaker: Sneaker,
    colorwayId: string,
    size: number,
    quantity: number = 1,
    sizeType: 'US Men' | 'US Women' | 'EU' | 'UK' = 'US Men'
  ) => {
    const colorway = sneaker.colorways.find((c) => c.id === colorwayId) || sneaker.colorways[0];
    const image = colorway.images[0];
    const cartItemId = `${sneaker.id}-${colorwayId}-${size}-${sizeType}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            sneakerId: sneaker.id,
            name: sneaker.name,
            brand: sneaker.brand,
            model: sneaker.model,
            price: sneaker.price,
            colorwayId: colorway.id,
            colorwayName: colorway.name,
            size,
            sizeType,
            image,
            quantity,
            sku: sneaker.sku,
          },
        ];
      }
    });

    showToast(
      'Added to Vault Cart',
      `${sneaker.name} (Size ${size} ${sizeType}) added to your bag.`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item Removed', 'Sneaker removed from your cart bag.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(cleanCode);
      const promo = PROMO_CODES[cleanCode];
      showToast('Promo Code Applied!', `${cleanCode} activated: ${promo.description}`, 'success');
      return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
    } else {
      showToast('Invalid Promo Code', 'Please enter a valid discount code (Try VAULT20 or KICKS10)', 'error');
      return { success: false, message: 'Invalid promo code. Valid codes include VAULT20, KICKS10, WELCOME15, FREESHIP.' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo Removed', 'Discount coupon code has been removed.', 'info');
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
  }

  const isFreeShippingPromo = appliedPromo && PROMO_CODES[appliedPromo]?.freeShipping;
  const isFreeStandard = subtotal > 150 && selectedShipping.id === 'standard';
  const shippingCost = isFreeShippingPromo ? 0 : isFreeStandard ? 0 : selectedShipping.price;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.0825 * 100) / 100;
  const grandTotal = Math.max(0, taxableAmount + shippingCost + taxAmount);

  // Filter logic
  const filteredSneakers = sneakers.filter((sneaker) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = sneaker.name.toLowerCase().includes(q);
      const matchBrand = sneaker.brand.toLowerCase().includes(q);
      const matchModel = sneaker.model.toLowerCase().includes(q);
      const matchSku = sneaker.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchModel && !matchSku) return false;
    }

    // Brand
    if (filters.brand !== 'All' && sneaker.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Category
    if (filters.category !== 'All' && sneaker.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    // Gender
    if (filters.gender !== 'All') {
      if (sneaker.gender !== 'unisex' && sneaker.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }
    }

    // Price
    if (sneaker.price < filters.minPrice || sneaker.price > filters.maxPrice) {
      return false;
    }

    // Size
    if (filters.size !== null && !sneaker.availableSizes.includes(filters.size)) {
      return false;
    }

    // In Stock
    if (filters.inStockOnly && !sneaker.inStock) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    // featured
    return (b.isHot ? 2 : 0) + (b.isExclusive ? 1 : 0) - ((a.isHot ? 2 : 0) + (a.isExclusive ? 1 : 0));
  });

  const processOrder = async (): Promise<Order> => {
    // Simulate real order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderNumber = `KV-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `VAULT-${Math.random().toString(36).substring(2, 9).toUpperCase()}-US`;
    
    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + (selectedShipping.id === 'overnight' ? 1 : selectedShipping.id === 'express' ? 2 : 4));
    const estimatedDelivery = deliveryDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      shippingAddress: { ...shippingAddress },
      shippingMethod: { ...selectedShipping },
      paymentMethod:
        paymentDetails.method === 'card'
          ? `Card ending in ${paymentDetails.cardNumber.replace(/\s/g, '').slice(-4) || '8923'}`
          : paymentDetails.method === 'wallet'
          ? `${paymentDetails.walletProvider === 'apple' ? 'Apple Pay' : paymentDetails.walletProvider === 'google' ? 'Google Pay' : 'PayPal'}`
          : `Klarna 4x Installments`,
      subtotal,
      discountAmount,
      appliedPromoCode: appliedPromo || undefined,
      shippingCost,
      taxAmount,
      total: grandTotal,
      status: 'Order Placed',
      estimatedDelivery,
      trackingCode,
    };

    setPlacedOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCart([]);
    setCurrentPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast('Order Placed Successfully!', `Receipt #${orderNumber} generated with Vault verification pass.`, 'success');
    return newOrder;
  };

  return (
    <SneakerContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedSneaker,
        setSelectedSneaker,
        viewSneakerDetail,
        sneakers,
        filters,
        setFilters,
        resetFilters,
        setBrandFilter,
        setCategoryFilter,
        filteredSneakers,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountAmount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        selectedShipping,
        setSelectedShipping,
        shippingCost,
        taxAmount,
        grandTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        shippingAddress,
        setShippingAddress,
        paymentDetails,
        setPaymentDetails,
        placedOrders,
        currentOrder,
        processOrder,
        isGithubModalOpen,
        setIsGithubModalOpen,
        isWishlistDrawerOpen,
        setIsWishlistDrawerOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </SneakerContext.Provider>
  );
};

export const useSneakers = () => {
  const context = useContext(SneakerContext);
  if (!context) {
    throw new Error('useSneakers must be used within a SneakerProvider');
  }
  return context;
};
