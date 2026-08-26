import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { SHIPPING_METHODS, PROMO_CODES } from '../data/sneakers';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Tag,
  Check,
  X,
  Sparkles,
  Flame,
  Plus,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
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
    setCurrentPage,
    sneakers,
    viewSneakerDetail,
  } = useSneakers();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mx-auto text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800">
          <div className="w-20 h-20 rounded-3xl bg-neutral-950 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-500">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              Your Vault Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added any deadstock grails yet. Explore our latest drops and verified kicks!
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentPage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-xl shadow-orange-600/30 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Start Shopping Sneakers
          </button>
        </div>

        {/* Quick Trending Recommendations */}
        <div className="mt-16 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Trending Drops You Might Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sneakers.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => viewSneakerDetail(item)}
                className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all group"
              >
                <div className="h-36 bg-neutral-950 rounded-xl overflow-hidden mb-3">
                  <img
                    src={item.colorways[0].images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold text-orange-400 uppercase">{item.brand}</span>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400">
                  {item.name}
                </h4>
                <p className="text-xs font-extrabold text-white mt-1">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Steps Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <button onClick={() => setCurrentPage('landing')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-orange-400 font-semibold">Vault Shopping Cart</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Your Shopping Bag
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review your selected kicks, apply discount promo codes, and choose delivery speed.
          </p>
        </div>

        {/* Clear Cart button */}
        <button
          onClick={clearCart}
          className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Bag
        </button>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-orange-400" />
            {amountToFreeShipping === 0 ? (
              <span className="text-emerald-400 font-bold">You unlocked FREE Insured Shipping!</span>
            ) : (
              <span>
                Add <strong className="text-orange-400">${amountToFreeShipping.toFixed(2)}</strong> more to get Free Standard Delivery
              </span>
            )}
          </span>
          <span className="text-neutral-400 font-mono text-[11px]">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Cart Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Image & Basic Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800 p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-semibold">
                        Size: {item.sizeType} {item.size}
                      </span>
                      <span>•</span>
                      <span className="text-neutral-400 truncate max-w-[150px]">{item.colorwayName}</span>
                    </div>
                    <p className="text-xs font-mono text-neutral-500">SKU: {item.sku}</p>
                  </div>
                </div>

                {/* Pricing, Quantity & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-extrabold text-white">
                      ${item.price * item.quantity}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-neutral-500">(${item.price} each)</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                      title="Remove from Cart"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping link */}
          <div className="pt-4 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setCurrentPage('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              ← Continue Browsing Sneakers
            </button>
            <span className="text-neutral-500">{cart.length} item styles in cart</span>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 sticky top-24 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] border-b border-neutral-800 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input Form */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-400" /> Have a Promo Code?
              </span>

              {appliedPromo ? (
                <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-orange-400 uppercase">{appliedPromo}</span>
                    <p className="text-[11px] text-neutral-300">
                      {PROMO_CODES[appliedPromo]?.description || 'Promo discount active'}
                    </p>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="p-1 rounded text-neutral-400 hover:text-white"
                    title="Remove Promo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. VAULT20, KICKS10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    promoMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Sample Promo Codes Hints */}
              {!appliedPromo && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500">Try:</span>
                  <button
                    onClick={() => applyPromoCode('VAULT20')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-orange-400 hover:underline border border-neutral-800"
                  >
                    VAULT20 (20% off)
                  </button>
                  <button
                    onClick={() => applyPromoCode('KICKS10')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-orange-400 hover:underline border border-neutral-800"
                  >
                    KICKS10 (10% off)
                  </button>
                </div>
              )}
            </div>

            {/* Shipping Method Selector */}
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-300">
                Delivery Options:
              </span>
              <div className="space-y-1.5">
                {SHIPPING_METHODS.map((method) => {
                  const isSelected = selectedShipping.id === method.id;
                  const price =
                    method.id === 'standard' && subtotal > 150
                      ? 'FREE'
                      : `$${method.price.toFixed(2)}`;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShipping(method)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-950 border-orange-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-white block">{method.name}</span>
                        <span className="text-[10px] text-neutral-400">{method.estimatedDays}</span>
                      </div>
                      <span className="font-bold text-orange-400">{price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Totals Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
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
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-semibold text-white">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-extrabold text-white pt-3 border-t border-neutral-800">
                <span>Grand Total</span>
                <span className="text-orange-400 text-lg sm:text-xl font-['Space_Grotesk']">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setCurrentPage('payment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              id="proceed-checkout-btn"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5 text-center">
              <p className="flex items-center justify-center gap-1.5 text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Guaranteed safe and encrypted checkout
              </p>
              <p>Visa • Mastercard • Amex • Apple Pay • Klarna</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
