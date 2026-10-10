import React from 'react';

export default function ProductCard({
  product,
  onAddToCart,
  onOpenQuickView,
  onToggleWishlist,
  isWishlisted
}) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-card h-100">
      {/* Product Image Area */}
      <div className="product-img-wrapper">
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-img" 
          loading="lazy" 
        />

        {/* Badges */}
        <div className="product-badges">
          {discountPercent > 0 && (
            <span className="badge-pill-sale">
              -{discountPercent}%
            </span>
          )}
          {product.badge && product.badge !== '20% OFF' && (
            <span className="badge-pill-featured">
              {product.badge}
            </span>
          )}
        </div>

        {/* Floating Actions */}
        <div className="product-action-floating">
          <button 
            className={`floating-circle-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>

          <button 
            className="floating-circle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            title="Quick view"
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="badge px-2 py-1" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', fontSize: '0.75rem' }}>
            {product.category}
          </span>
          <small className="text-muted fw-semibold">{product.brand}</small>
        </div>

        <h6 
          className="fw-bold mb-2 text-truncate-2 cursor-pointer" 
          style={{ 
            minHeight: '2.4rem',
            cursor: 'pointer',
            lineHeight: '1.3'
          }}
          onClick={() => onOpenQuickView(product)}
          title={product.title}
        >
          {product.title}
        </h6>

        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-2">
          <div className="star-rating">
            <i className="bi bi-star-fill text-warning"></i>
            <span className="fw-bold ms-1" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{product.rating}</span>
          </div>
          <small className="text-muted">({product.ratingCount})</small>
          {product.stock <= 10 && (
            <small className="ms-auto text-danger fw-semibold" style={{ fontSize: '0.75rem' }}>
              Only {product.stock} left!
            </small>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="d-flex align-items-baseline gap-2 mb-2">
            <span className="fs-5 fw-extrabold text-primary" style={{ color: 'var(--primary-accent) !important' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through small">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-gradient w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
            >
              <i className="bi bi-cart-plus-fill"></i>
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
