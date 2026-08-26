import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { Sneaker, FilterState } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Flame,
  Star,
  ShoppingBag,
  Heart,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';

export const ProductCatalogPage: React.FC = () => {
  const {
    filteredSneakers,
    filters,
    setFilters,
    resetFilters,
    viewSneakerDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentPage,
  } = useSneakers();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickSizeModalSneaker, setQuickSizeModalSneaker] = useState<Sneaker | null>(null);
  const [selectedQuickSize, setSelectedQuickSize] = useState<number>(10);

  const brands = ['All', 'Jordan', 'Nike', 'Adidas', 'New Balance', 'Asics', 'Salomon', 'Yeezy'];
  const categories = [
    { id: 'All', label: 'All Silhouettes' },
    { id: 'retro', label: 'Retro High & OG' },
    { id: 'running', label: 'Running & Trail' },
    { id: 'streetwear', label: 'Streetwear & Collabs' },
    { id: 'basketball', label: 'Basketball Protro' },
    { id: 'lifestyle', label: 'Classics & Casual' },
  ];
  const allSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

  const handleQuickAddConfirm = () => {
    if (quickSizeModalSneaker) {
      addToCart(
        quickSizeModalSneaker,
        quickSizeModalSneaker.colorways[0].id,
        selectedQuickSize,
        1,
        'US Men'
      );
      setQuickSizeModalSneaker(null);
    }
  };

  const hasActiveFilters =
    filters.brand !== 'All' ||
    filters.category !== 'All' ||
    filters.gender !== 'All' ||
    filters.size !== null ||
    filters.searchQuery !== '' ||
    filters.minPrice > 50 ||
    filters.maxPrice < 1000 ||
    filters.inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <button onClick={() => setCurrentPage('landing')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-orange-400 font-semibold">Sneaker Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            All Verified Sneaker Drops
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Showing <strong className="text-white">{filteredSneakers.length}</strong> authenticated deadstock pairs
          </p>
        </div>

        {/* Search Bar in Catalog */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by shoe name, brand, SKU..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 sticky top-24">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <SlidersHorizontal className="w-4 h-4 text-orange-400" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-orange-400 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Brands Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Brand
            </label>
            <div className="space-y-1">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setFilters((prev) => ({ ...prev, brand }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    filters.brand === brand
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{brand}</span>
                  {filters.brand === brand && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2 pt-3 border-t border-neutral-800">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Silhouette Style
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    filters.category === cat.id
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  {filters.category === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="space-y-2 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-neutral-300">
                Max Price
              </label>
              <span className="text-orange-400 font-bold">${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="20"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-neutral-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>$100</span>
              <span>$1,000+</span>
            </div>
          </div>

          {/* Sizing Filter Pills */}
          <div className="space-y-2 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                US Men's Size
              </label>
              {filters.size && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, size: null }))}
                  className="text-[10px] text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, size: prev.size === sz ? null : sz }))
                  }
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    filters.size === sz
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Sort & Mobile Filter Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            {/* Active Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilters((f) => ({ ...f, category: 'All' }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  filters.category === 'All'
                    ? 'bg-white text-neutral-950'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.slice(1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((f) => ({ ...f, category: cat.id }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    filters.category === cat.id
                      ? 'bg-white text-neutral-950'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-orange-400" /> Filters
              </button>

              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy'],
                    }))
                  }
                  className="bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                >
                  <option value="featured">Featured Grails</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Releases</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500">Active filters:</span>
              {filters.brand !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                  Brand: {filters.brand}
                  <button onClick={() => setFilters((f) => ({ ...f, brand: 'All' }))}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                  Style: {filters.category}
                  <button onClick={() => setFilters((f) => ({ ...f, category: 'All' }))}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.size !== null && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                  Size: US {filters.size}
                  <button onClick={() => setFilters((f) => ({ ...f, size: null }))}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.maxPrice < 1000 && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                  Under ${filters.maxPrice}
                  <button onClick={() => setFilters((f) => ({ ...f, maxPrice: 1000 }))}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                  "{filters.searchQuery}"
                  <button onClick={() => setFilters((f) => ({ ...f, searchQuery: '' }))}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-white" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-orange-400 hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sneakers Grid */}
          {filteredSneakers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800 mx-auto flex items-center justify-center text-neutral-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Sneakers Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                We couldn't find any sneakers matching your exact filter criteria. Try resetting your filters to explore our full vault.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSneakers.map((sneaker) => (
                <div
                  key={sneaker.id}
                  className="bg-neutral-900/80 rounded-2xl border border-neutral-800/90 overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col group"
                >
                  {/* Photo & Badges */}
                  <div
                    className="relative h-60 bg-neutral-950 p-4 overflow-hidden cursor-pointer flex items-center justify-center"
                    onClick={() => viewSneakerDetail(sneaker)}
                  >
                    {sneaker.isHot && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                        <Flame className="w-3 h-3" /> HOT DROP
                      </span>
                    )}
                    {sneaker.isNew && !sneaker.isHot && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                        NEW DROP
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

                  {/* Body info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold uppercase tracking-wider text-orange-400">
                          {sneaker.brand}
                        </span>
                        <span className="text-neutral-500 text-[10px] font-mono">
                          {sneaker.sku}
                        </span>
                      </div>
                      <h3
                        onClick={() => viewSneakerDetail(sneaker)}
                        className="text-sm font-bold text-white hover:text-orange-400 cursor-pointer transition-colors mt-1 line-clamp-2"
                      >
                        {sneaker.name}
                      </h3>
                    </div>

                    {/* Stock Alert */}
                    {sneaker.stockRemaining <= 4 && (
                      <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Only {sneaker.stockRemaining} pairs left in vault
                      </div>
                    )}

                    {/* Bottom Pricing & CTA */}
                    <div className="pt-3 border-t border-neutral-800/80">
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
                          className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold text-center transition-colors"
                        >
                          View Specs
                        </button>
                        <button
                          onClick={() => {
                            setQuickSizeModalSneaker(sneaker);
                            setSelectedQuickSize(sneaker.availableSizes[0] || 10);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center transition-colors shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Size Modal for rapid add-to-cart */}
      {quickSizeModalSneaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Select Your Size</h4>
              <button
                onClick={() => setQuickSizeModalSneaker(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={quickSizeModalSneaker.colorways[0].images[0]}
                alt={quickSizeModalSneaker.name}
                className="w-14 h-14 rounded-xl object-cover bg-neutral-950 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-white truncate">{quickSizeModalSneaker.name}</h5>
                <p className="text-xs font-extrabold text-orange-400 mt-0.5">
                  ${quickSizeModalSneaker.price}
                </p>
              </div>
            </div>

            {/* Sizing Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-400">US Men's Sizing</span>
              <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1">
                {quickSizeModalSneaker.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedQuickSize(sz)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      selectedQuickSize === sz
                        ? 'bg-orange-600 border-orange-500 text-white shadow'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    US {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleQuickAddConfirm}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Confirm & Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filter Slide-down / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 lg:hidden">
          <div className="w-full bg-neutral-900 rounded-t-3xl border-t border-neutral-800 p-6 max-h-[80vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">Filter Sneakers</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Brand
              </label>
              <div className="grid grid-cols-3 gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilters((f) => ({ ...f, brand: b }))}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      filters.brand === b
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-300 font-bold">
                <span>Max Price</span>
                <span className="text-orange-400">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="20"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-orange-500"
              />
            </div>

            {/* Apply button */}
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
            >
              Apply Filters ({filteredSneakers.length} pairs)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
