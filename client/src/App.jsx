import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import WishlistModal from './components/WishlistModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import AdminAddModal from './components/AdminAddModal';
import ToastAlert from './components/ToastAlert';
import { fetchProducts, fetchCategories } from './services/api';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('aura_theme') || 'dark');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(1500);

  // Cart & Wishlist States with LocalStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_cart')) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_wishlist')) || [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modal / Drawer States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPricing, setCheckoutPricing] = useState({ subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Notifications State
  const [toasts, setToasts] = useState([]);

  // Catalog Section ref for scrolling
  const catalogRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  // Sync cart & wishlist
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Initial load
  useEffect(() => {
    loadCategories();
  }, []);

  // Reload products when filters change
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm, sortOption, dealsOnly, inStockOnly, maxPriceFilter]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchTerm,
        sort: sortOption !== 'featured' ? sortOption : undefined,
        deals: dealsOnly ? 'true' : undefined,
        inStock: inStockOnly ? 'true' : undefined,
        maxPrice: maxPriceFilter < 1500 ? maxPriceFilter : undefined
      };
      const res = await fetchProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  // Toast Helper
  const showToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: qty
      }];
    });

    showToast('Added to Cart', `${product.title} (Qty: ${qty}) has been added.`, 'success');
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item Removed', 'Product removed from your cart.', 'warning');
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Wishlist Updated', `Removed ${product.title} from favorites.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to Wishlist', `Added ${product.title} to favorites.`, 'success');
    }
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Instant Checkout triggers
  const handleInstantBuy = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
    const tax = ((subtotal - discountAmount) * 0.08);
    const total = Math.max(0, subtotal - discountAmount + shipping + tax);

    setCheckoutPricing({ subtotal, discount: discountAmount, tax, shipping, total });
    setIsCheckoutOpen(true);
  };

  // Scroll to catalog
  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreDeals = () => {
    setSelectedCategory('All');
    setDealsOnly(true);
    handleScrollToCatalog();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Toast Alert stack */}
      <ToastAlert toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectCategory={setSelectedCategory}
        onSelectFilter={(f) => {
          if (f === 'deals') setDealsOnly(true);
          else setDealsOnly(false);
        }}
      />

      {/* Hero Banner Section */}
      <HeroBanner 
        onExploreDeals={handleExploreDeals} 
        onScrollToCatalog={handleScrollToCatalog} 
      />

      {/* Categories Row */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setDealsOnly(false);
        }}
      />

      {/* Main Catalog Section */}
      <main className="container mb-5 flex-grow-1" ref={catalogRef}>
        {/* Filter & Sorting Controls Header */}
        <div className="p-3 mb-4 rounded-4 border d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          {/* Active view label */}
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold fs-5">
              {dealsOnly ? '🔥 Hot Deals' : selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </span>
            <span className="badge rounded-pill bg-primary bg-opacity-25 text-primary">
              {products.length} items
            </span>
            {dealsOnly && (
              <button 
                className="btn btn-sm btn-outline-secondary py-0 px-2"
                onClick={() => setDealsOnly(false)}
              >
                Reset Deals filter <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          {/* Quick Filters: In Stock, Deals, Price Slider & Sort */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            
            {/* In stock switch */}
            <div className="form-check form-switch mb-0">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="inStockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="inStockCheck">
                In Stock Only
              </label>
            </div>

            {/* Price Max Slider */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Max:</span>
              <input 
                type="range" 
                className="form-range" 
                style={{ width: '100px' }}
                min="50" 
                max="1500" 
                step="50"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              />
              <span className="small fw-bold">${maxPriceFilter}</span>
            </div>

            {/* Sorting Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted d-none d-sm-inline">Sort by:</span>
              <select 
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading exceptional items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 p-4 rounded-4 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
            <h5 className="fw-bold">No products match your criteria</h5>
            <p className="text-muted small mb-4">Try clearing filters or search terms to see available items.</p>
            <button 
              className="btn btn-gradient px-4 rounded-pill"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
                setDealsOnly(false);
                setInStockOnly(false);
                setMaxPriceFilter(1500);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <ProductCard
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 border-top" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center text-white"
                  style={{ width: 34, height: 34, background: 'var(--primary-gradient)' }}
                >
                  <i className="bi bi-gem"></i>
                </div>
                <span className="brand-gradient-text fs-4 fw-bold">AURA LUXE</span>
              </div>
              <p className="text-muted small pe-lg-4">
                Redefining the digital shopping experience with curations in acoustic audio, high-precision wearables, creator cameras, and timeless fashion.
              </p>
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-sm btn-glass rounded-circle"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="btn btn-sm btn-glass rounded-circle"><i className="bi bi-instagram"></i></a>
                <a href="#" className="btn btn-sm btn-glass rounded-circle"><i className="bi bi-github"></i></a>
                <a href="#" className="btn btn-sm btn-glass rounded-circle"><i className="bi bi-discord"></i></a>
              </div>
            </div>

            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3 small text-uppercase">Shop</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
                <li><a href="#" className="text-decoration-none text-muted" onClick={() => setSelectedCategory('Audio')}>Audio Gear</a></li>
                <li><a href="#" className="text-decoration-none text-muted" onClick={() => setSelectedCategory('Wearables')}>Smart Watches</a></li>
                <li><a href="#" className="text-decoration-none text-muted" onClick={() => setSelectedCategory('Electronics')}>Electronics</a></li>
                <li><a href="#" className="text-decoration-none text-muted" onClick={() => setSelectedCategory('Fashion')}>Apparel</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-6">
              <h6 className="fw-bold mb-3 small text-uppercase">Customer Care</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
                <li><a href="#" className="text-decoration-none text-muted" onClick={() => setIsOrdersOpen(true)}>Track Orders</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Returns & Exchange</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Shipping Policy</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Warranty Info</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="fw-bold mb-3 small text-uppercase">Exclusive Newsletter</h6>
              <p className="text-muted small">Subscribe to receive early VIP access and secret flash coupons.</p>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
                <button 
                  className="btn btn-gradient px-3"
                  onClick={() => showToast('Subscribed!', 'Welcome to the Aura Luxe VIP Circle.', 'success')}
                >
                  Join VIP
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-top d-flex flex-wrap justify-content-between align-items-center small text-muted" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>© {new Date().getFullYear()} AURA LUXE Inc. All rights reserved. React + Node.js + Bootstrap.</div>
            <div className="d-flex gap-3">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleInstantBuy}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.some(w => w.id === quickViewProduct.id) : false}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={(pricing) => {
          setCheckoutPricing(pricing);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        pricing={checkoutPricing}
        onOrderSuccess={(ord) => {
          showToast('Order Placed!', `Your order #${ord.id} has been confirmed.`, 'success');
        }}
        onClearCart={handleClearCart}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onClearWishlist={handleClearWishlist}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AdminAddModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductAdded={(newProd) => {
          showToast('Product Created', `${newProd.title} added to the catalog!`, 'success');
          loadProducts();
          loadCategories();
        }}
      />
    </div>
  );
}
