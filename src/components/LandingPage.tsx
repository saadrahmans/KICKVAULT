import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { Sneaker } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Star,
  ShoppingBag,
  Heart,
  TrendingUp,
  Award,
  CheckCircle2,
  Layers,
  Zap,
  Timer,
  Ruler,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const {
    sneakers,
    setCurrentPage,
    viewSneakerDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setBrandFilter,
    setCategoryFilter,
  } = useSneakers();

  // Featured Sneaker for Spotlight section
  const [activeSpotlightSneaker, setActiveSpotlightSneaker] = useState<Sneaker>(sneakers[0]);
  const [activeColorwayIdx, setActiveColorwayIdx] = useState(0);

  // Interactive Size Converter State
  const [usSize, setUsSize] = useState<number>(10);
  const [genderType, setGenderType] = useState<'men' | 'women'>('men');

  const getEuSize = (us: number, gender: 'men' | 'women') => {
    return gender === 'men' ? (us + 33).toFixed(1) : (us + 31.5).toFixed(1);
  };
  const getUkSize = (us: number, gender: 'men' | 'women') => {
    return gender === 'men' ? (us - 0.5).toFixed(1) : (us - 2).toFixed(1);
  };
  const getCmSize = (us: number, gender: 'men' | 'women') => {
    return gender === 'men' ? (us * 0.84 + 19.6).toFixed(1) : (us * 0.84 + 18.2).toFixed(1);
  };

  const trendingSneakers = sneakers.slice(0, 4);
  const newArrivals = sneakers.slice(4, 8);

  const brands = [
    { name: 'Jordan', tag: 'Jumpman Vault', count: '48 Drops', logoText: 'AIR JORDAN' },
    { name: 'Nike', tag: 'Dunk & Air Max', count: '64 Drops', logoText: 'NIKE' },
    { name: 'Adidas', tag: 'Originals & Samba', count: '32 Drops', logoText: 'ADIDAS' },
    { name: 'New Balance', tag: 'Made in USA', count: '29 Drops', logoText: 'NEW BALANCE' },
    { name: 'Asics', tag: 'Gel-Kayano Core', count: '18 Drops', logoText: 'ASICS' },
    { name: 'Salomon', tag: 'XT-6 Gorpcore', count: '14 Drops', logoText: 'SALOMON' },
  ];

  return (
    <div className="w-full space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-neutral-800/80">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-orange-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide shadow-lg shadow-orange-500/10">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>LIMITED DROP • AIR JORDAN 1 "LOST & FOUND"</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-300">100% DEADSTOCK</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-['Space_Grotesk']">
                WHERE GRAILS ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500">AUTHENTICATED.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover the world's most coveted sneakers. Every single pair is physically inspected, blacklight-verified, and double-boxed before reaching your doorstep.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98]"
                  id="hero-explore-btn"
                >
                  <ShoppingBag className="w-5 h-5" /> Explore All Drops <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => viewSneakerDetail(sneakers[0])}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm sm:text-base border border-neutral-800 transition-all flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 text-orange-400" /> View Jordan 1 Grail
                </button>
              </div>

              {/* Stats Ribbon */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-extrabold text-white font-['Space_Grotesk']">100%</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Verified Authentic</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white font-['Space_Grotesk']">24h</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Dispatch Speed</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white font-['Space_Grotesk']">50K+</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Grails Delivered</p>
                </div>
              </div>
            </div>

            {/* Right Visual: Interactive 3D/Hero Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 rounded-3xl border border-neutral-800 shadow-2xl group"
              >
                {/* Floating Tag */}
                <div className="absolute top-8 left-8 z-20 flex flex-col gap-1">
                  <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                    HOTTEST DROP
                  </span>
                  <span className="text-xs font-semibold text-neutral-300">Vault Verified</span>
                </div>

                {/* Wishlist quick toggle */}
                <button
                  onClick={() => toggleWishlist(sneakers[0].id)}
                  className="absolute top-8 right-8 z-20 p-2.5 rounded-full bg-neutral-950/80 text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInWishlist(sneakers[0].id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-300'
                    }`}
                  />
                </button>

                {/* Hero Image */}
                <div
                  onClick={() => viewSneakerDetail(sneakers[0])}
                  className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden cursor-pointer bg-neutral-900/80 flex items-center justify-center p-4 mt-8"
                >
                  <img
                    src={sneakers[0].colorways[0].images[0]}
                    alt={sneakers[0].name}
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & Price */}
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                        {sneakers[0].brand}
                      </span>
                      <h3
                        onClick={() => viewSneakerDetail(sneakers[0])}
                        className="text-base font-bold text-white hover:text-orange-400 cursor-pointer transition-colors truncate"
                      >
                        {sneakers[0].name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-white">${sneakers[0].price}</p>
                      <p className="text-xs text-neutral-400 line-through">${sneakers[0].originalPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{sneakers[0].rating}</span>
                      <span className="text-neutral-500">({sneakers[0].reviewCount} reviews)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>

                  {/* Instant Add */}
                  <button
                    onClick={() => {
                      addToCart(sneakers[0], sneakers[0].colorways[0].id, 10.5);
                    }}
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Quick Add (Size US 10.5)
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR BRANDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Heritage & Contemporary
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] mt-1">
              Shop by Brand Vault
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            View all 12+ brands <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              onClick={() => setBrandFilter(b.name)}
              className="p-5 rounded-2xl bg-neutral-900/70 hover:bg-neutral-800/90 border border-neutral-800 hover:border-orange-500/50 cursor-pointer transition-all duration-300 group text-center space-y-2"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-950 flex items-center justify-center text-orange-400 font-extrabold group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                {b.name}
              </h3>
              <p className="text-[11px] text-neutral-400">{b.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING GRAILS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> High Demand Silhouettes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] mt-1">
              Trending Grails This Week
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-neutral-300 hover:text-white px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 transition-colors"
          >
            Explore Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingSneakers.map((sneaker) => (
            <div
              key={sneaker.id}
              className="bg-neutral-900/80 rounded-2xl border border-neutral-800/90 overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-56 bg-neutral-950 p-3 overflow-hidden cursor-pointer" onClick={() => viewSneakerDetail(sneaker)}>
                {sneaker.isHot && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <Flame className="w-3 h-3" /> HOT DROP
                  </span>
                )}
                {sneaker.isNew && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                    NEW RELEASE
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(sneaker.id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isInWishlist(sneaker.id) ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>

                <img
                  src={sneaker.colorways[0].images[0]}
                  alt={sneaker.name}
                  className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-orange-400">
                      {sneaker.brand}
                    </span>
                    <span className="text-neutral-400 text-[11px]">{sneaker.category.toUpperCase()}</span>
                  </div>
                  <h3
                    onClick={() => viewSneakerDetail(sneaker)}
                    className="text-sm font-bold text-white hover:text-orange-400 cursor-pointer transition-colors mt-1 line-clamp-2"
                  >
                    {sneaker.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-base font-extrabold text-white">${sneaker.price}</span>
                      {sneaker.originalPrice && (
                        <span className="text-xs text-neutral-500 line-through ml-2">
                          ${sneaker.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-semibold text-neutral-200">{sneaker.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => viewSneakerDetail(sneaker)}
                      className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold text-center transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        addToCart(sneaker, sneaker.colorways[0].id, sneaker.availableSizes[0] || 10);
                      }}
                      className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center transition-colors shadow-md shadow-orange-600/20"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SNEAKER SPOTLIGHT / DEEP DIVE (Interactive Colorway & Specs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sneaker Image & Colorway Switcher */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-80 sm:h-96 rounded-2xl bg-neutral-950 p-6 flex items-center justify-center border border-neutral-800">
                <img
                  src={
                    activeSpotlightSneaker.colorways[activeColorwayIdx]?.images[0] ||
                    activeSpotlightSneaker.colorways[0].images[0]
                  }
                  alt={activeSpotlightSneaker.name}
                  className="w-full h-full object-cover object-center rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-neutral-900/90 text-[11px] font-semibold text-neutral-300 border border-neutral-700">
                  {activeSpotlightSneaker.colorways[activeColorwayIdx]?.name}
                </div>
              </div>

              {/* Colorway dots */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-medium">Available Colorways:</span>
                <div className="flex items-center gap-2">
                  {activeSpotlightSneaker.colorways.map((cw, idx) => (
                    <button
                      key={cw.id}
                      onClick={() => setActiveColorwayIdx(idx)}
                      style={{ backgroundColor: cw.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        activeColorwayIdx === idx
                          ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/30'
                          : 'border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                      title={cw.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sneaker Tech Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                    VAULT ICON OF THE MONTH
                  </span>
                  <span className="text-xs text-neutral-400">SKU: {activeSpotlightSneaker.sku}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                  {activeSpotlightSneaker.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeSpotlightSneaker.story}
                </p>
              </div>

              {/* Key Specs Breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Upper Construction</span>
                  <p className="text-xs font-semibold text-white mt-1">{activeSpotlightSneaker.specs.upperMaterial}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Cushioning Tech</span>
                  <p className="text-xs font-semibold text-white mt-1">{activeSpotlightSneaker.specs.cushioning}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Outsole Grip</span>
                  <p className="text-xs font-semibold text-white mt-1">{activeSpotlightSneaker.specs.soleMaterial}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Authentication</span>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">4-Point Pass Verified</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => viewSneakerDetail(activeSpotlightSneaker)}
                  className="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                >
                  View Full Product Details <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-right">
                  <span className="text-xs text-neutral-400">Current Market</span>
                  <p className="text-xl font-extrabold text-white">${activeSpotlightSneaker.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SNEAKER SIZE CONVERSION CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                Universal Sneaker Size Calculator
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Never guess your sizing again. Convert between US, UK, EU, and CM measurements instantly.
              </p>
            </div>

            {/* Gender Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-950 border border-neutral-800">
              <button
                onClick={() => setGenderType('men')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  genderType === 'men' ? 'bg-orange-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Men's Sizing
              </button>
              <button
                onClick={() => setGenderType('women')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  genderType === 'women' ? 'bg-orange-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Women's Sizing
              </button>
            </div>

            {/* Size Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold text-neutral-300">
                <span>Select US Size</span>
                <span className="text-orange-400 font-bold text-sm">US {usSize}</span>
              </div>
              <input
                type="range"
                min="6"
                max="14"
                step="0.5"
                value={usSize}
                onChange={(e) => setUsSize(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-neutral-950 rounded-lg"
              />
            </div>

            {/* Conversions Output */}
            <div className="grid grid-cols-4 gap-3 pt-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">US Size</span>
                <p className="text-lg font-extrabold text-white mt-1">US {usSize}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">EU Sizing</span>
                <p className="text-lg font-extrabold text-orange-400 mt-1">{getEuSize(usSize, genderType)}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">UK Sizing</span>
                <p className="text-lg font-extrabold text-white mt-1">{getUkSize(usSize, genderType)}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Insole Length</span>
                <p className="text-lg font-extrabold text-amber-400 mt-1">{getCmSize(usSize, genderType)} cm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED BUYER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Trusted by 50,000+ Collectors
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Community Drop Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: 'Derrick K.',
              handle: '@derrick_kicks',
              shoe: 'Air Jordan 1 Lost & Found (US 10.5)',
              rating: 5,
              text: 'Passed my personal UV blacklight and stitch inspection with flying colors. The box came in pristine condition with double bubble wrap.',
            },
            {
              author: 'Sarah Jenkins',
              handle: '@sarah_grails',
              shoe: 'New Balance 990v6 Grey (US 8)',
              rating: 5,
              text: 'Ordered on Tuesday, arrived on Thursday. The FuelCell cushioning is out of this world. Best sneaker purchase this entire year.',
            },
            {
              author: 'Matteo Rossi',
              handle: '@matteo_street',
              shoe: 'Travis Scott x Jordan 1 Low (US 11)',
              rating: 5,
              text: 'Used the VAULT20 discount code and got an insane price. Authentic QR card scanned directly to the verified database.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                "{item.text}"
              </p>
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{item.author}</h4>
                  <p className="text-neutral-500">{item.handle}</p>
                </div>
                <span className="text-neutral-400 text-[11px] text-right font-medium">{item.shoe}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-8 sm:p-14 text-center text-white shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk']">
              Ready to Upgrade Your Rotation?
            </h2>
            <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
              Join thousands of collectors securing verified deadstock kicks. Fast shipping, 30-day returns, and guaranteed authenticity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-sm shadow-xl transition-all"
              >
                Browse All 12+ Vault Drops
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
