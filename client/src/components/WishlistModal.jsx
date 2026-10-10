import React from 'react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onClearWishlist
}) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', borderRadius: '24px' }}>
          
          <div className="modal-header border-bottom p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-heart-fill text-danger fs-5"></i>
              <h5 className="modal-title fw-bold mb-0">My Wishlist</h5>
              <span className="badge bg-danger rounded-pill">{wishlist.length}</span>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-heartbreak fs-1 text-muted d-block mb-3"></i>
                <h5 className="fw-bold">Your wishlist is empty</h5>
                <p className="text-muted small mb-4">Click the heart icon on any product to save it for later.</p>
                <button className="btn btn-gradient px-4 rounded-pill" onClick={onClose}>
                  Explore Products
                </button>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">Saved items</span>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={onClearWishlist}>
                    Clear all
                  </button>
                </div>

                <div className="row g-3">
                  {wishlist.map(item => (
                    <div key={item.id} className="col-12 col-md-6">
                      <div 
                        className="p-3 rounded-3 border d-flex gap-3 align-items-center h-100"
                        style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="rounded-2" 
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-semibold text-truncate small mb-1" title={item.title}>
                            {item.title}
                          </h6>
                          <div className="fw-bold text-primary small mb-2">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-gradient py-1 px-2 d-flex align-items-center gap-1 small"
                              onClick={() => {
                                onAddToCart(item);
                                onRemoveFromWishlist(item.id);
                              }}
                            >
                              <i className="bi bi-cart-plus"></i> Move to Cart
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger py-1 px-2 small"
                              onClick={() => onRemoveFromWishlist(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-top p-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
