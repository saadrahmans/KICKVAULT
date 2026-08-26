import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { Sneaker, Review } from '../types';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
  Flame,
  Clock,
  ArrowRight,
  UserCheck,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedSneaker,
    sneakers,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentPage,
    viewSneakerDetail,
    showToast,
  } = useSneakers();

  if (!selectedSneaker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">No sneaker selected.</h2>
        <button
          onClick={() => setCurrentPage('products')}
          className="mt-4 px-6 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const [activeColorwayId, setActiveColorwayId] = useState<string>(
    selectedSneaker.colorways[0]?.id || ''
  );
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number>(
    selectedSneaker.availableSizes[2] || selectedSneaker.availableSizes[0] || 10
  );
  const [sizeType, setSizeType] = useState<'US Men' | 'US Women' | 'EU' | 'UK'>('US Men');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'reviews'>('details');

  // Review submission form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const currentColorway =
    selectedSneaker.colorways.find((c) => c.id === activeColorwayId) ||
    selectedSneaker.colorways[0];

  const currentImages = currentColorway.images.length > 0
    ? currentColorway.images
    : selectedSneaker.colorways[0].images;

  const handleColorwayChange = (id: string) => {
    setActiveColorwayId(id);
    setActiveImageIdx(0);
  };

  const handleAddToCart = () => {
    addToCart(selectedSneaker, currentColorway.id, selectedSize, quantity, sizeType);
  };

  const handleInstantBuy = () => {
    addToCart(selectedSneaker, currentColorway.id, selectedSize, quantity, sizeType);
    setCurrentPage('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Sneaker grail link copied to clipboard.', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('Review incomplete', 'Please fill in your name and thoughts.', 'error');
      return;
    }

    const newReview: Review = {
      id: 'user-rev-' + Date.now(),
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Verified Purchase Grail Review',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      sizePurchased: selectedSize,
    };

    selectedSneaker.reviews.unshift(newReview);
    selectedSneaker.reviewCount += 1;
    setIsReviewFormOpen(false);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    showToast('Review Submitted!', 'Thank you for sharing your feedback with the sneaker community.', 'success');
  };

  const relatedSneakers = sneakers
    .filter((s) => s.id !== selectedSneaker.id && (s.brand === selectedSneaker.brand || s.category === selectedSneaker.category))
    .slice(0, 4);

  // Size display conversion helper
  const formatSizeDisplay = (baseUsMen: number, type: 'US Men' | 'US Women' | 'EU' | 'UK') => {
    if (type === 'US Men') return `US ${baseUsMen}`;
    if (type === 'US Women') return `US ${(baseUsMen + 1.5).toFixed(1)}`;
    if (type === 'EU') return `EU ${(baseUsMen + 33).toFixed(1)}`;
    if (type === 'UK') return `UK ${(baseUsMen - 0.5).toFixed(1)}`;
    return `US ${baseUsMen}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage('landing')} className="hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => setCurrentPage('products')} className="hover:text-white transition-colors">
            Sneakers
          </button>
          <span>/</span>
          <span className="text-neutral-500 uppercase">{selectedSneaker.brand}</span>
          <span>/</span>
          <span className="text-orange-400 font-semibold truncate max-w-[180px] sm:max-w-xs">
            {selectedSneaker.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Main Product Showcase Grid (Gallery & Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Display Image */}
          <div className="relative h-[360px] sm:h-[480px] w-full rounded-3xl bg-neutral-950 p-6 flex items-center justify-center border border-neutral-800/90 shadow-2xl overflow-hidden group">
            {/* Badges */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5">
              {selectedSneaker.isExclusive && (
                <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-lg shadow-orange-600/30">
                  VAULT EXCLUSIVE
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-md bg-neutral-900/90 text-emerald-400 text-[10px] font-bold border border-neutral-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% DEADSTOCK AUTHENTIC
              </span>
            </div>

            {/* Heart toggle */}
            <button
              onClick={() => toggleWishlist(selectedSneaker.id)}
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700 shadow-xl transition-all"
              aria-label="Save to Grails"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(selectedSneaker.id) ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>

            {/* Display Image */}
            <motion.img
              key={currentImages[activeImageIdx]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={currentImages[activeImageIdx]}
              alt={selectedSneaker.name}
              className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {currentImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-950 p-1.5 border-2 shrink-0 transition-all overflow-hidden ${
                  activeImageIdx === idx
                    ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-105'
                    : 'border-neutral-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Vault Authentication Seal */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                KICKVAULT 4-Point Authentication Pass
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This pair has undergone comprehensive physical inspection, stitch symmetry audits, UV blacklight verification, and RFID authentication by Master Authenticator #8812. Includes tamper-proof vault seal and serialized digital certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Buying Options & Spec Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
                {selectedSneaker.brand} • {selectedSneaker.category.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-neutral-400">SKU: {selectedSneaker.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
              {selectedSneaker.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedSneaker.rating) ? 'fill-amber-400' : 'text-neutral-600'
                    }`}
                  />
                ))}
                <span className="font-bold text-white ml-1">{selectedSneaker.rating}</span>
              </div>
              <span className="text-neutral-500">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-neutral-400 hover:text-white underline underline-offset-2"
              >
                {selectedSneaker.reviewCount} customer reviews
              </button>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400">Vault Verified Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  ${selectedSneaker.price}
                </span>
                {selectedSneaker.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    ${selectedSneaker.originalPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                In Stock & Ready
              </span>
              <p className="text-[10px] text-neutral-500 mt-1">Free Insured US Shipping</p>
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-300">
                Colorway: <strong className="text-white">{currentColorway.name}</strong>
              </span>
              <span className="text-neutral-400">{selectedSneaker.colorways.length} options</span>
            </div>
            <div className="flex items-center gap-3">
              {selectedSneaker.colorways.map((cw) => (
                <button
                  key={cw.id}
                  onClick={() => handleColorwayChange(cw.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    activeColorwayId === cw.id
                      ? 'bg-neutral-800 border-orange-500 text-white shadow-lg'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-700"
                    style={{ backgroundColor: cw.hex }}
                  />
                  <span>{cw.name.split('/')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Unit Toggle */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Select Sizing
              </span>

              {/* Size Unit Selector */}
              <div className="flex p-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] font-bold">
                {(['US Men', 'US Women', 'EU', 'UK'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSizeType(type)}
                    className={`px-2 py-1 rounded transition-colors ${
                      sizeType === type
                        ? 'bg-orange-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing Pills Grid */}
            <div className="grid grid-cols-4 gap-2">
              {selectedSneaker.availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/30 scale-[1.02]'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{formatSizeDisplay(sz, sizeType)}</span>
                </button>
              ))}
            </div>

            {/* Stock urgency alert */}
            {selectedSneaker.stockRemaining <= 4 && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  High demand! Only <strong>{selectedSneaker.stockRemaining} pairs</strong> left in stock.
                </span>
              </div>
            )}
          </div>

          {/* Quantity and Primary Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity counter */}
              <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all active:scale-[0.98]"
                id="pdp-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                Add to Cart ({quantity} {quantity === 1 ? 'Pair' : 'Pairs'})
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleInstantBuy}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              id="pdp-instant-buy-btn"
            >
              <Zap className="w-4 h-4 fill-white" /> Buy Now • Instant Checkout
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-400 border-t border-neutral-800/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Ships in 24 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-400 shrink-0" />
              <span>30-Day Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-Bit SSL Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Vault Authenticity Tag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Details, Specs, Shipping, Reviews */}
      <div className="pt-10 border-t border-neutral-800 space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Story & Highlights
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Technical Specs
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Shipping & Authenticity
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Verified Reviews ({selectedSneaker.reviews.length})
          </button>
        </div>

        {/* Tab Content 1: Story & Highlights */}
        {activeTab === 'details' && (
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              The History & Heritage
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {selectedSneaker.story}
            </p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 pt-2">
              Key Silhouette Features:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
              {selectedSneaker.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Content 2: Technical Specs */}
        {activeTab === 'specs' && (
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Upper Materials</span>
                <p className="text-xs font-bold text-white mt-1">{selectedSneaker.specs.upperMaterial}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Cushioning Technology</span>
                <p className="text-xs font-bold text-white mt-1">{selectedSneaker.specs.cushioning}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Outsole Compound</span>
                <p className="text-xs font-bold text-white mt-1">{selectedSneaker.specs.soleMaterial}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Country of Origin</span>
                <p className="text-xs font-bold text-white mt-1">{selectedSneaker.specs.origin}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Shipping & Authenticity */}
        {activeTab === 'shipping' && (
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 text-xs text-neutral-300">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Vault Inspection & Shipping Promise
            </h3>
            <p className="leading-relaxed">
              Every sneaker ordered through KICKVAULT is routed directly through our state-of-the-art authentication hub. We inspect stitching density, materials feel, weight tolerances, UV blacklight markings, packaging inserts, and serial numbers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h5 className="font-bold text-white mb-1">Standard Insured Delivery</h5>
                <p className="text-neutral-400">Delivered within 3-5 business days. Free for orders over $150.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h5 className="font-bold text-white mb-1">FedEx Express Air</h5>
                <p className="text-neutral-400">Expedited 2 business day delivery with real-time tracking.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h5 className="font-bold text-white mb-1">Vault Signature Courier</h5>
                <p className="text-neutral-400">Next-day direct hand-off with required signature.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Verified Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Customer Ratings & Verified Feedback
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-300 font-bold">{selectedSneaker.rating} out of 5</span>
                  <span className="text-xs text-neutral-500">({selectedSneaker.reviews.length} total reviews)</span>
                </div>
              </div>

              <button
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                {isReviewFormOpen ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review Submission Form */}
            {isReviewFormOpen && (
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-orange-500/40 space-y-4">
                <h4 className="text-sm font-bold text-white">Share Your Experience</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jordan Miller"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-300">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="5">5 Stars - Grail Status / Flawless</option>
                      <option value="4">4 Stars - Great quality & fit</option>
                      <option value="3">3 Stars - Decent sneaker</option>
                      <option value="2">2 Stars - Sizing ran tight</option>
                      <option value="1">1 Star - Unsatisfied</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Unbelievable leather quality and fast shipping!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Your Thoughts</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the materials, comfort, sizing advice, and authentication experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-lg"
                >
                  Post Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {selectedSneaker.reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{rev.author}</span>
                      <span className="text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-white text-xs">{rev.title}</span>
                    <span className="text-neutral-500 text-[11px]">| Size Purchased: US {rev.sizePurchased}</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Sneakers Section */}
      {relatedSneakers.length > 0 && (
        <div className="pt-12 border-t border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Pairs You Might Also Like
            </h3>
            <button
              onClick={() => setCurrentPage('products')}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Explore all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedSneakers.map((sneaker) => (
              <div
                key={sneaker.id}
                onClick={() => viewSneakerDetail(sneaker)}
                className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-all duration-300 group"
              >
                <div className="relative h-36 bg-neutral-950 rounded-xl overflow-hidden mb-3">
                  <img
                    src={sneaker.colorways[0].images[0]}
                    alt={sneaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold text-orange-400 uppercase">{sneaker.brand}</span>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                  {sneaker.name}
                </h4>
                <p className="text-xs font-extrabold text-white mt-1">${sneaker.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
