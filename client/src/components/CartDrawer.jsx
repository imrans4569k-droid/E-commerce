import React, { useState } from 'react';
import { validateCoupon } from '../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  setAppliedCoupon
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const tax = ((subtotal - discountAmount) * 0.08); // 8% tax
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const data = await validateCoupon(couponInput.trim());
      setAppliedCoupon(data.coupon);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Invalid promo code');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Drawer */}
      <div 
        className="offcanvas offcanvas-end show custom-offcanvas" 
        tabIndex="-1" 
        style={{ 
          visibility: 'visible', 
          width: '420px', 
          maxWidth: '100vw',
          zIndex: 1045,
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          borderLeft: '1px solid var(--border-subtle)'
        }}
      >
        {/* Drawer Header */}
        <div className="offcanvas-header border-bottom p-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bag-check-fill text-primary fs-5"></i>
            <h5 className="offcanvas-title fw-bold mb-0">Your Shopping Bag</h5>
            <span className="badge bg-primary rounded-pill ms-1">
              {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose} 
            aria-label="Close"
          ></button>
        </div>

        {/* Drawer Body */}
        <div className="offcanvas-body d-flex flex-column p-3 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center my-auto py-5">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3"
                style={{ background: 'var(--bg-body)' }}
              >
                <i className="bi bi-cart-x fs-1 text-muted"></i>
              </div>
              <h5 className="fw-bold">Your cart is empty</h5>
              <p className="text-muted small mb-4">Discover our top tech and lifestyle deals to fill your bag!</p>
              <button className="btn btn-gradient px-4 rounded-pill" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-grow-1 overflow-auto mb-3 pe-1">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 mb-2 rounded-3 border d-flex gap-3 align-items-center"
                    style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="rounded-2" 
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />

                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold text-truncate small mb-1" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-primary fw-bold small mb-2">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity & Delete */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="quantity-control">
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                            <i className="bi bi-dash"></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        <button 
                          className="btn btn-link text-danger p-0 ms-2" 
                          onClick={() => onRemoveItem(item.id)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="mb-3 pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                {appliedCoupon ? (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-success-subtle text-success border border-success-subtle">
                    <div className="small">
                      <i className="bi bi-tag-fill me-1"></i>
                      <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountPercent}% OFF)
                    </div>
                    <button 
                      className="btn btn-sm btn-link text-danger p-0 fw-bold"
                      onClick={() => setAppliedCoupon(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                    <input 
                      type="text" 
                      className="form-control form-control-sm"
                      placeholder="Promo code (SAVE20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-sm btn-outline-primary px-3"
                      disabled={couponLoading || !couponInput.trim()}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <small className="text-danger d-block mt-1">{couponError}</small>}
              </div>

              {/* Order Summary Calculations */}
              <div className="p-3 rounded-3 border mb-3" style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between small text-success mb-1">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-6 pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button 
                className="btn btn-gradient w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  onClose();
                  onProceedToCheckout({ subtotal, discount: discountAmount, tax, shipping, total });
                }}
              >
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
