import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Github,
  Menu,
  X,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    cartCount,
    wishlist,
    filters,
    setFilters,
    setIsGithubModalOpen,
    setIsWishlistDrawerOpen,
    setCategoryFilter,
  } = useSneakers();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', page: 'landing' as const },
    { label: 'All Sneakers', page: 'products' as const, onClick: () => { setFilters(f => ({ ...f, category: 'All', brand: 'All' })); setCurrentPage('products'); } },
    { label: 'Retro Vault', page: 'products' as const, onClick: () => setCategoryFilter('retro') },
    { label: 'Streetwear & Collabs', page: 'products' as const, onClick: () => setCategoryFilter('streetwear') },
    { label: 'Performance', page: 'products' as const, onClick: () => setCategoryFilter('running') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-white" /> 2026 VAULT DROPS LIVE
        </span>
        <span className="hidden sm:inline opacity-75">•</span>
        <span className="hidden sm:inline">Use code <strong className="underline underline-offset-2 tracking-wider">VAULT20</strong> for 20% Off your order</span>
        <span className="hidden md:inline opacity-75">•</span>
        <span className="hidden md:inline flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Authentic Guarantee
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setCurrentPage('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Space_Grotesk']">
                    KICK<span className="text-orange-500">VAULT</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                    EST. 2026
                  </span>
                </div>
                <p className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium">
                  Verified Authentics
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick();
                    } else {
                      setCurrentPage(link.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl transition-colors ${
                    currentPage === link.page && (link.label === 'Home' || link.label === 'All Sneakers')
                      ? 'text-white bg-neutral-900 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Actions: Search, Wishlist, Cart, GitHub Guide */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search input bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Jordan, Yeezy, Dunks, SKU..."
                  value={filters.searchQuery}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                  }}
                  onFocus={() => {
                    if (currentPage !== 'products') {
                      // Navigate smoothly if typing
                    }
                  }}
                  className="w-48 lg:w-64 pl-9 pr-3.5 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:w-72 transition-all"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
              aria-label="Search sneakers"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors"
              title="View Grails Wishlist"
              id="wishlist-btn"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-600/30">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                setCurrentPage('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                currentPage === 'cart'
                  ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/25 font-semibold'
                  : 'bg-neutral-900 text-neutral-200 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
              id="nav-cart-btn"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            </button>

            {/* GitHub Repo Guide Button */}
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 text-xs font-semibold transition-colors"
              title="GitHub Code & Upload Guide"
              id="github-guide-btn"
            >
              <Github className="w-4 h-4 text-neutral-300" />
              <span className="hidden md:inline">GitHub Code</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchExpanded && (
          <div className="md:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search Jordan, Yeezy, Dunks, SKU..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-orange-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-3 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-800 space-y-1 bg-neutral-950">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (link.onClick) {
                    link.onClick();
                  } else {
                    setCurrentPage(link.page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-neutral-600" />
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-neutral-800 px-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGithubModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-800"
              >
                <Github className="w-4 h-4" /> GitHub Repository Upload Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
