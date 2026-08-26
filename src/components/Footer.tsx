import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Github,
  Mail,
  ArrowRight,
  CheckCircle2,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setBrandFilter, setCategoryFilter, setIsGithubModalOpen, showToast } = useSneakers();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email', 'Enter your email to receive sneaker drop alerts.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Welcome to the Vault Club!', 'You are on the priority list for all limited drops.', 'success');
  };

  const perks = [
    {
      icon: ShieldCheck,
      title: '100% Verified Authentic',
      desc: 'Every sneaker passes our rigorous 4-point physical blacklight & serial verification.',
    },
    {
      icon: Truck,
      title: 'Fast Double-Boxed Shipping',
      desc: 'Dispatched in reinforced collector protective casing within 24 hours.',
    },
    {
      icon: RotateCcw,
      title: '30-Day Hassle-Free Returns',
      desc: 'Shop with full confidence with easy returns and instant store credit.',
    },
    {
      icon: Lock,
      title: 'Encrypted Checkout',
      desc: 'Bank-grade 256-bit SSL encrypted transactions with Visa, Mastercard, and Klarna.',
    },
  ];

  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-sm">
      {/* Perks Ribbon */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{perk.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-['Space_Grotesk']">
                KICK<span className="text-orange-500">VAULT</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              The premier marketplace for deadstock grails, hyped silhouettes, and authenticated collector kicks. Engineered for sneakerheads worldwide.
            </p>

            {/* Newsletter Form */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Get Early Drop Alerts & 20% Off
              </span>
              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're subscribed! Use promo code <strong>VAULT20</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/20 shrink-0 flex items-center gap-1.5"
                  >
                    Join Club <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Brands Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Popular Brands
            </h4>
            <ul className="space-y-2 text-xs">
              {['Jordan', 'Nike', 'Adidas', 'New Balance', 'Asics', 'Salomon', 'Yeezy'].map((brand) => (
                <li key={brand}>
                  <button
                    onClick={() => setBrandFilter(brand)}
                    className="hover:text-orange-400 transition-colors text-neutral-400"
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories & Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCategoryFilter('retro')} className="hover:text-orange-400 transition-colors text-neutral-400">
                  Retro High Grails
                </button>
              </li>
              <li>
                <button onClick={() => setCategoryFilter('streetwear')} className="hover:text-orange-400 transition-colors text-neutral-400">
                  Streetwear & Collabs
                </button>
              </li>
              <li>
                <button onClick={() => setCategoryFilter('running')} className="hover:text-orange-400 transition-colors text-neutral-400">
                  Gorpcore & Trail Runners
                </button>
              </li>
              <li>
                <button onClick={() => setCategoryFilter('basketball')} className="hover:text-orange-400 transition-colors text-neutral-400">
                  Protro Basketball
                </button>
              </li>
              <li>
                <button onClick={() => setCategoryFilter('lifestyle')} className="hover:text-orange-400 transition-colors text-neutral-400">
                  Everyday Classics
                </button>
              </li>
            </ul>
          </div>

          {/* Store & GitHub Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Project & GitHub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsGithubModalOpen(true)}
                  className="hover:text-orange-400 transition-colors text-neutral-400 flex items-center gap-1.5 font-medium"
                >
                  <Github className="w-3.5 h-3.5" /> Upload to GitHub Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors text-neutral-400"
                >
                  Landing Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors text-neutral-400"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors text-neutral-400"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('payment');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors text-neutral-400"
                >
                  Payment & Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 mt-12 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 KICKVAULT Inc. Built for sneakerheads. All trademarks belong to their respective owners.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL 256-Bit Encrypted
            </span>
            <span>•</span>
            <button onClick={() => setIsGithubModalOpen(true)} className="text-orange-400 hover:underline">
              GitHub Repo Ready
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
