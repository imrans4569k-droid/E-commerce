import React, { useState, useEffect } from 'react';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct
}) {
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 overflow-hidden" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', borderRadius: '24px' }}>
          
          {/* Modal Header */}
          <div className="modal-header border-0 pb-0 pe-4 pt-4">
            <span className="badge rounded-pill px-3 py-2" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
              {product.category}
            </span>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose} 
              aria-label="Close"
              style={{ filter: 'var(--text-main) === "#f8fafc" ? "invert(1)" : "none"' }}
            ></button>
          </div>

          <div className="modal-body p-4 p-md-5">
            <div className="row g-4 align-items-center">
              
              {/* Image Gallery Column */}
              <div className="col-md-6">
                <div 
                  className="rounded-4 overflow-hidden mb-3 bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '340px', background: 'var(--bg-body)' }}
                >
                  <img 
                    src={selectedImage || product.image} 
                    alt={product.title} 
                    className="img-fluid h-100 w-100" 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>

                {/* Thumbnails */}
                {imagesList.length > 1 && (
                  <div className="d-flex gap-2">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        className={`btn p-0 rounded-3 overflow-hidden border ${selectedImage === img ? 'border-primary border-2' : 'border-subtle'}`}
                        style={{ width: 64, height: 64 }}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img src={img} alt="thumbnail" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Column */}
              <div className="col-md-6">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted fw-bold text-uppercase small">{product.brand}</span>
                  <button 
                    className={`btn btn-sm btn-glass rounded-circle p-2 ${isWishlisted ? 'text-danger' : ''}`}
                    onClick={() => onToggleWishlist(product)}
                    title="Add to Wishlist"
                  >
                    <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'} fs-5`}></i>
                  </button>
                </div>

                <h4 className="fw-bold mb-2">{product.title}</h4>

                {/* Star rating */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="star-rating">
                    <i className="bi bi-star-fill"></i>
                    <span className="ms-1 fw-bold">{product.rating}</span>
                  </div>
                  <span className="text-muted small">({product.ratingCount} verified customer reviews)</span>
                </div>

                {/* Pricing */}
                <div className="d-flex align-items-baseline gap-3 mb-3">
                  <span className="display-6 fw-bold text-primary" style={{ color: 'var(--primary-accent) !important' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-muted text-decoration-line-through fs-5">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="badge bg-danger rounded-pill px-2 py-1">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                  {product.stock > 0 ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      <i className="bi bi-check2-circle me-1"></i> In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                      <i className="bi bi-x-circle me-1"></i> Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                  {product.description}
                </p>

                {/* Features Checklist */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold small text-uppercase text-muted mb-2">Key Highlights</h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-1 small">
                      {product.features.map((feat, i) => (
                        <li key={i} className="d-flex align-items-center gap-2">
                          <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '0.85rem' }}></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity and Action Buttons */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="quantity-control">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  <button 
                    className="btn btn-gradient flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock <= 0}
                  >
                    <i className="bi bi-cart-plus-fill"></i>
                    <span>Add {quantity} to Cart</span>
                  </button>
                </div>

                <button 
                  className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                    onBuyNow();
                  }}
                  disabled={product.stock <= 0}
                >
                  <i className="bi bi-lightning-charge-fill"></i>
                  <span>Instant Checkout</span>
                </button>
              </div>
            </div>

            {/* Related Products */}
            {product.related && product.related.length > 0 && (
              <div className="mt-5 pt-4 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <h6 className="fw-bold mb-3">You May Also Like</h6>
                <div className="row g-3">
                  {product.related.map(rel => (
                    <div key={rel.id} className="col-4">
                      <div 
                        className="p-2 rounded-3 text-center cursor-pointer border"
                        style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => onSelectProduct(rel)}
                      >
                        <img src={rel.image} alt={rel.title} className="rounded-2 mb-2 w-100" style={{ height: '70px', objectFit: 'cover' }} />
                        <div className="text-truncate fw-semibold small">{rel.title}</div>
                        <div className="text-primary fw-bold small">${rel.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
