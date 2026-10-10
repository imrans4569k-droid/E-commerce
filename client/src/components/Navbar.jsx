import React from 'react';

export default function Navbar({
  cartCount,
  wishlistCount,
  theme,
  toggleTheme,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAdmin,
  searchTerm,
  setSearchTerm,
  onSelectCategory,
  onSelectFilter
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <a 
          className="navbar-brand d-flex align-items-center gap-2 me-4" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('All');
            onSelectFilter(null);
          }}
        >
          <div 
            className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm"
            style={{
              width: 38,
              height: 38,
              background: 'var(--primary-gradient)',
              fontSize: '1.2rem'
            }}
          >
            <i className="bi bi-gem"></i>
          </div>
          <span className="brand-gradient-text fs-4 fw-bold">AURA LUXE</span>
        </a>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <i className="bi bi-list fs-2" style={{ color: 'var(--text-main)' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar */}
          <div className="mx-auto my-2 my-lg-0 col-12 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-subtle)' }}>
                <i className="bi bi-search" style={{ color: 'var(--text-muted)' }}></i>
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-start-0"
                style={{ 
                  borderColor: 'var(--border-subtle)', 
                  color: 'var(--text-main)' 
                }}
                placeholder="Search products, brands, or tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn bg-transparent border-start-0 border-end" 
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Nav Quick Links & Controls */}
          <ul className="navbar-nav align-items-lg-center gap-1 gap-lg-2 ms-auto mt-3 mt-lg-0">
            <li className="nav-item">
              <button 
                className="btn btn-sm btn-glass text-start px-3 py-2 w-100"
                onClick={() => {
                  onSelectCategory('All');
                  onSelectFilter('deals');
                }}
              >
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Hot Deals
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="btn btn-sm btn-glass text-start px-3 py-2 w-100"
                onClick={onOpenOrders}
                title="View your orders"
              >
                <i className="bi bi-box-seam me-1 text-info"></i> Orders
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="btn btn-sm btn-glass text-start px-3 py-2 w-100"
                onClick={onOpenAdmin}
                title="Add product to store"
              >
                <i className="bi bi-plus-circle-fill text-success me-1"></i> Add Item
              </button>
            </li>

            {/* Theme Toggle Button */}
            <li className="nav-item">
              <button 
                className="btn btn-glass px-2 py-2" 
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <i className="bi bi-sun-fill text-warning fs-6"></i>
                ) : (
                  <i className="bi bi-moon-stars-fill text-primary fs-6"></i>
                )}
              </button>
            </li>

            {/* Wishlist Button */}
            <li className="nav-item position-relative">
              <button 
                className="btn btn-glass px-3 py-2 position-relative" 
                onClick={onOpenWishlist}
                title="Wishlist"
              >
                <i className="bi bi-heart-fill text-danger me-1"></i>
                <span className="d-lg-none">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </li>

            {/* Cart Button */}
            <li className="nav-item">
              <button 
                className="btn btn-gradient px-3 py-2 d-flex align-items-center gap-2 position-relative"
                onClick={onOpenCart}
                id="cart-trigger-btn"
              >
                <i className="bi bi-bag-check-fill fs-6"></i>
                <span>Cart</span>
                <span className="badge bg-white text-dark rounded-pill fw-bold">
                  {cartCount}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
