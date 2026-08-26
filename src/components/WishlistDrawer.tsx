import React from 'react';
import { useSneakers } from '../context/SneakerContext';
import { X, Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistDrawerOpen,
    setIsWishlistDrawerOpen,
    wishlist,
    toggleWishlist,
    sneakers,
    viewSneakerDetail,
    addToCart,
  } = useSneakers();

  if (!isWishlistDrawerOpen) return null;

  const wishlistSneakers = sneakers.filter((s) => wishlist.includes(s.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl text-neutral-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Grail Wishlist</h3>
                <p className="text-xs text-neutral-400">{wishlistSneakers.length} saved kicks</p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistSneakers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                  <Heart className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-white">Your Grails List is Empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Tap the heart icon on any sneaker in the store to save your favorite grails for later.
                </p>
              </div>
            ) : (
              wishlistSneakers.map((sneaker) => (
                <div
                  key={sneaker.id}
                  className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex gap-3.5 items-center group hover:border-neutral-700 transition-colors"
                >
                  <div
                    onClick={() => {
                      setIsWishlistDrawerOpen(false);
                      viewSneakerDetail(sneaker);
                    }}
                    className="w-20 h-20 rounded-xl bg-neutral-900 overflow-hidden shrink-0 cursor-pointer p-1"
                  >
                    <img
                      src={sneaker.colorways[0].images[0]}
                      alt={sneaker.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold tracking-wider text-orange-400 uppercase">
                      {sneaker.brand}
                    </span>
                    <h4
                      onClick={() => {
                        setIsWishlistDrawerOpen(false);
                        viewSneakerDetail(sneaker);
                      }}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-orange-400 transition-colors"
                    >
                      {sneaker.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-white">${sneaker.price}</span>
                      {sneaker.originalPrice && (
                        <span className="text-xs text-neutral-500 line-through">
                          ${sneaker.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          addToCart(sneaker, sneaker.colorways[0].id, sneaker.availableSizes[0] || 10);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-semibold transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" /> Quick Add
                      </button>
                      <button
                        onClick={() => toggleWishlist(sneaker.id)}
                        className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistSneakers.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/80">
              <button
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Continue Browsing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
