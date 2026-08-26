import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { SHIPPING_METHODS, PROMO_CODES } from '../data/sneakers';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Printer,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    appliedPromo,
    selectedShipping,
    setSelectedShipping,
    shippingCost,
    taxAmount,
    grandTotal,
    shippingAddress,
    setShippingAddress,
    paymentDetails,
    setPaymentDetails,
    processOrder,
    currentOrder,
    currentPage,
    setCurrentPage,
    showToast,
  } = useSneakers();

  const [activePaymentMethod, setActivePaymentMethod] = useState<'card' | 'wallet' | 'installments'>(
    paymentDetails.method || 'card'
  );
  const [selectedWallet, setSelectedWallet] = useState<'apple' | 'google' | 'paypal'>('apple');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Card formatting helpers
  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const groups = clean.match(/.{1,4}/g);
    return groups ? groups.join(' ') : clean;
  };

  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'American Express';
    if (clean.startsWith('6011') || clean.startsWith('65')) return 'Discover';
    return 'Card';
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 3) {
      return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    return clean;
  };

  // Form Validation Engine
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Shipping Address Validation
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full recipient name is required';
    } else if (shippingAddress.fullName.trim().length < 3) {
      errors.fullName = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingAddress.email.trim()) {
      errors.email = 'Email address is required for order tracking';
    } else if (!emailRegex.test(shippingAddress.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneDigits = shippingAddress.phone.replace(/\D/g, '');
    if (!shippingAddress.phone.trim()) {
      errors.phone = 'Phone number is required for courier delivery';
    } else if (phoneDigits.length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!shippingAddress.addressLine1.trim()) {
      errors.addressLine1 = 'Street address is required';
    }

    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      errors.state = 'State / Province is required';
    }

    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = 'Postal / ZIP Code is required';
    } else if (shippingAddress.postalCode.trim().length < 4) {
      errors.postalCode = 'Invalid postal code format';
    }

    // 2. Payment Method Validation (if card)
    if (activePaymentMethod === 'card') {
      const cleanCard = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!cleanCard) {
        errors.cardNumber = 'Card number is required';
      } else if (cleanCard.length < 15 || cleanCard.length > 16) {
        errors.cardNumber = 'Card number must be 15-16 digits';
      }

      if (!paymentDetails.cardHolder.trim()) {
        errors.cardHolder = 'Cardholder name as displayed on card is required';
      }

      if (!paymentDetails.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date MM/YY is required';
      } else {
        const parts = paymentDetails.expiryDate.split('/');
        if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
          errors.expiryDate = 'Format must be MM/YY';
        } else {
          const month = parseInt(parts[0], 10);
          const year = parseInt('20' + parts[1], 10);
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;

          if (month < 1 || month > 12) {
            errors.expiryDate = 'Invalid month (01-12)';
          } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            errors.expiryDate = 'Card has expired';
          }
        }
      }

      const cleanCvv = paymentDetails.cvv.replace(/\D/g, '');
      if (!cleanCvv) {
        errors.cvv = 'CVV is required';
      } else if (cleanCvv.length < 3 || cleanCvv.length > 4) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Empty Cart', 'Please add sneakers to your bag before checking out.', 'error');
      setCurrentPage('products');
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      showToast('Validation Error', 'Please correct the highlighted form errors to proceed.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await processOrder();
    } catch {
      showToast('Payment Failed', 'An error occurred during payment processing. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ----------------------------------------------------
  // ORDER CONFIRMATION / SUCCESS VIEW
  // ----------------------------------------------------
  if (currentPage === 'order-success' && currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Payment & Authentication Verified
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Grail Order Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{currentOrder.shippingAddress.fullName}</strong>. Your sneaker shipment is currently being inspected in the vault.
            </p>
          </div>

          {/* Key Reference Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs">
            <div>
              <span className="text-neutral-500 block">Order Number</span>
              <strong className="text-white font-mono text-sm">{currentOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Tracking Code</span>
              <strong className="text-orange-400 font-mono text-sm">{currentOrder.trackingCode}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Estimated Arrival</span>
              <strong className="text-white text-xs">{currentOrder.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Vault Authenticator Status Pipeline */}
          <div className="space-y-3 text-left pt-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Live Fulfillment Pipeline:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="font-bold block">1. Order Placed</span>
                <span className="text-[10px] text-emerald-400">Payment captured</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 text-orange-300 animate-pulse">
                <span className="font-bold block">2. Vault Inspection</span>
                <span className="text-[10px] text-orange-400">4-Point Auth Check</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-500">
                <span className="font-bold block">3. Double-Boxed</span>
                <span className="text-[10px]">Tamper seal attached</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-500">
                <span className="font-bold block">4. Courier Transit</span>
                <span className="text-[10px]">{currentOrder.shippingMethod.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Itemized Recap */}
          <div className="space-y-3 text-left pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Purchased Sneakers ({currentOrder.items.length})
            </h3>
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-900"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400">
                        {item.sizeType} {item.size} • {item.colorwayName} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Shipping Destination Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs pt-4 border-t border-neutral-800">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 font-semibold block">Delivery Destination:</span>
              <p className="text-white font-medium">{currentOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-400">{currentOrder.shippingAddress.addressLine1}</p>
              <p className="text-neutral-400">
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}{' '}
                {currentOrder.shippingAddress.postalCode}
              </p>
              <p className="text-neutral-500 text-[11px]">{currentOrder.shippingAddress.phone}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-neutral-400 font-semibold block">Payment Breakdown:</span>
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal:</span>
                <span>${currentOrder.subtotal.toFixed(2)}</span>
              </div>
              {currentOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({currentOrder.appliedPromoCode}):</span>
                  <span>-${currentOrder.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-300">
                <span>Shipping:</span>
                <span>${currentOrder.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Sales Tax:</span>
                <span>${currentOrder.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1 border-t border-neutral-800">
                <span>Paid Total:</span>
                <span className="text-orange-400 text-sm">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save Invoice Receipt
            </button>
            <button
              onClick={() => {
                setCurrentPage('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PAYMENT & CHECKOUT PAGE FORM
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <button onClick={() => setCurrentPage('landing')} className="hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => setCurrentPage('cart')} className="hover:text-white transition-colors">
            Cart
          </button>
          <span>/</span>
          <span className="text-orange-400 font-semibold">Payment & Checkout</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Secure Vault Checkout
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Complete your delivery details and choose your verified payment method.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: CONTACT & SHIPPING ADDRESS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Customer & Shipping Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Legal Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Aurelius"
                  value={shippingAddress.fullName}
                  onChange={(e) => {
                    setShippingAddress((p) => ({ ...p, fullName: e.target.value }));
                    if (validationErrors.fullName) setValidationErrors((e) => ({ ...e, fullName: '' }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                    validationErrors.fullName
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-neutral-800 focus:border-orange-500'
                  }`}
                />
                {validationErrors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address (For Tracking & Invoice) <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="marcus@vaultsneakers.com"
                    value={shippingAddress.email}
                    onChange={(e) => {
                      setShippingAddress((p) => ({ ...p, email: e.target.value }));
                      if (validationErrors.email) setValidationErrors((e) => ({ ...e, email: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                      validationErrors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Phone Number (For Courier Confirmation) <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 382-9012"
                    value={shippingAddress.phone}
                    onChange={(e) => {
                      setShippingAddress((p) => ({ ...p, phone: e.target.value }));
                      if (validationErrors.phone) setValidationErrors((e) => ({ ...e, phone: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                      validationErrors.phone
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Street Address <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="742 Evergreen Terrace"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => {
                    setShippingAddress((p) => ({ ...p, addressLine1: e.target.value }));
                    if (validationErrors.addressLine1)
                      setValidationErrors((e) => ({ ...e, addressLine1: '' }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                    validationErrors.addressLine1
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-neutral-800 focus:border-orange-500'
                  }`}
                />
                {validationErrors.addressLine1 && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.addressLine1}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Apt 4B"
                  value={shippingAddress.addressLine2 || ''}
                  onChange={(e) => setShippingAddress((p) => ({ ...p, addressLine2: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* City, State, ZIP, Country */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    City <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Los Angeles"
                    value={shippingAddress.city}
                    onChange={(e) => {
                      setShippingAddress((p) => ({ ...p, city: e.target.value }));
                      if (validationErrors.city) setValidationErrors((e) => ({ ...e, city: '' }));
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                      validationErrors.city
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.city && (
                    <p className="text-[10px] text-rose-400 mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    State / Prov <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="CA"
                    value={shippingAddress.state}
                    onChange={(e) => {
                      setShippingAddress((p) => ({ ...p, state: e.target.value }));
                      if (validationErrors.state) setValidationErrors((e) => ({ ...e, state: '' }));
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                      validationErrors.state
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.state && (
                    <p className="text-[10px] text-rose-400 mt-1">{validationErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Postal / ZIP <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="90001"
                    value={shippingAddress.postalCode}
                    onChange={(e) => {
                      setShippingAddress((p) => ({ ...p, postalCode: e.target.value }));
                      if (validationErrors.postalCode)
                        setValidationErrors((e) => ({ ...e, postalCode: '' }));
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 focus:outline-none ${
                      validationErrors.postalCode
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.postalCode && (
                    <p className="text-[10px] text-rose-400 mt-1">{validationErrors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Country
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((p) => ({ ...p, country: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: SHIPPING METHOD SELECTION */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Delivery Speed & Courier
              </h2>
            </div>

            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => {
                const isSelected = selectedShipping.id === method.id;
                const cost =
                  method.id === 'standard' && subtotal > 150
                    ? 'FREE'
                    : `$${method.price.toFixed(2)}`;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedShipping(method)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-950 border-orange-500 text-white shadow-lg'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500' : 'border-neutral-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{method.name}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {method.description} ({method.estimatedDays})
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-orange-400">{cost}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD & VALIDATION */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Payment Method
                </h2>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivePaymentMethod('card');
                  setPaymentDetails((p) => ({ ...p, method: 'card' }));
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  activePaymentMethod === 'card'
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit/Debit Card
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentMethod('wallet');
                  setPaymentDetails((p) => ({ ...p, method: 'wallet' }));
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  activePaymentMethod === 'wallet'
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Digital Wallet
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentMethod('installments');
                  setPaymentDetails((p) => ({ ...p, method: 'installments' }));
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  activePaymentMethod === 'installments'
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <Clock className="w-4 h-4" /> 4x Installments
              </button>
            </div>

            {/* Option A: CREDIT / DEBIT CARD INPUTS */}
            {activePaymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Card Number <span className="text-orange-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono uppercase text-orange-400 font-bold">
                      {detectCardBrand(paymentDetails.cardNumber)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4532 8921 0034 8923"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setPaymentDetails((p) => ({ ...p, cardNumber: formatted }));
                        if (validationErrors.cardNumber)
                          setValidationErrors((e) => ({ ...e, cardNumber: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 font-mono focus:outline-none ${
                        validationErrors.cardNumber
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-neutral-800 focus:border-orange-500'
                      }`}
                    />
                    <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  </div>
                  {validationErrors.cardNumber && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Name on Card <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="MARCUS AURELIUS"
                    value={paymentDetails.cardHolder}
                    onChange={(e) => {
                      setPaymentDetails((p) => ({
                        ...p,
                        cardHolder: e.target.value.toUpperCase(),
                      }));
                      if (validationErrors.cardHolder)
                        setValidationErrors((e) => ({ ...e, cardHolder: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 font-mono uppercase focus:outline-none ${
                      validationErrors.cardHolder
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-orange-500'
                    }`}
                  />
                  {validationErrors.cardHolder && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.cardHolder}
                    </p>
                  )}
                </div>

                {/* Expiration Date & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Expiry Date (MM/YY) <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setPaymentDetails((p) => ({ ...p, expiryDate: formatted }));
                        if (validationErrors.expiryDate)
                          setValidationErrors((e) => ({ ...e, expiryDate: '' }));
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 font-mono focus:outline-none ${
                        validationErrors.expiryDate
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-neutral-800 focus:border-orange-500'
                      }`}
                    />
                    {validationErrors.expiryDate && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-neutral-300">
                        Security Code (CVV) <span className="text-orange-400">*</span>
                      </label>
                      <span className="text-[10px] text-neutral-500">3-4 digits</span>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="842"
                      value={paymentDetails.cvv}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                        setPaymentDetails((p) => ({ ...p, cvv: val }));
                        if (validationErrors.cvv) setValidationErrors((e) => ({ ...e, cvv: '' }));
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-white placeholder-neutral-500 font-mono focus:outline-none ${
                        validationErrors.cvv
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-neutral-800 focus:border-orange-500'
                      }`}
                    />
                    {validationErrors.cvv && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Option B: DIGITAL WALLET */}
            {activePaymentMethod === 'wallet' && (
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <span className="text-xs font-semibold text-neutral-300 block">
                  Select Instant Express Wallet:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'apple', label: 'Apple Pay' },
                    { id: 'google', label: 'Google Pay' },
                    { id: 'paypal', label: 'PayPal' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setSelectedWallet(w.id as any);
                        setPaymentDetails((p) => ({ ...p, walletProvider: w.id as any }));
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-colors ${
                        selectedWallet === w.id
                          ? 'bg-neutral-800 border-orange-500 text-white shadow'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  You will be prompted to authenticate seamlessly using your biometric Face ID / fingerprint pass when you click "Place Order".
                </p>
              </div>
            )}

            {/* Option C: INSTALLMENTS */}
            {activePaymentMethod === 'installments' && (
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Klarna 4 Interest-Free Payments</span>
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 font-bold text-[10px]">
                    0% APR
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Payment {step}</span>
                      <strong className="text-white font-bold mt-0.5 block">
                        ${(grandTotal / 4).toFixed(2)}
                      </strong>
                      <span className="text-[9px] text-neutral-400">
                        {step === 1 ? 'Today' : `+${(step - 1) * 2} wks`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Order Review (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 sticky top-24 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] border-b border-neutral-800 pb-3">
              Order Review
            </h3>

            {/* Item list mini preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-950 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400">
                        Size {item.size} • Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-white shrink-0">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({appliedPromo})</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-300">
                <span>Shipping ({selectedShipping.name.split(' ')[0]})</span>
                <span className="font-semibold text-white">
                  {shippingCost === 0 ? <span className="text-emerald-400">FREE</span> : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-neutral-300">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-white">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-neutral-800">
                <span>Total Amount</span>
                <span className="text-orange-400 text-xl font-['Space_Grotesk']">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              id="pay-and-place-order-btn"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating & Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Place Order (${grandTotal.toFixed(2)})
                </>
              )}
            </button>

            <div className="text-[11px] text-neutral-500 text-center space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1 text-neutral-400">
                <Lock className="w-3 h-3 text-emerald-400" /> Tamper-proof 4-Point Vault Guarantee
              </p>
              <p>By placing this order you agree to KICKVAULT conditions.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
