import React from 'react';
import { SneakerProvider, useSneakers } from './context/SneakerContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ProductCatalogPage } from './components/ProductCatalogPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { PaymentPage } from './components/PaymentPage';
import { GitHubModal } from './components/GitHubModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const { currentPage } = useSneakers();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Page Views with Seamless Transitions */}
      <main className="flex-1">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'products' && <ProductCatalogPage />}
        {currentPage === 'detail' && <ProductDetailPage />}
        {currentPage === 'cart' && <CartPage />}
        {(currentPage === 'payment' || currentPage === 'order-success') && <PaymentPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Drawers & Modals */}
      <WishlistDrawer />
      <GitHubModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SneakerProvider>
      <AppContent />
    </SneakerProvider>
  );
}
