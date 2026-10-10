import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { createOrder } from '../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  pricing,
  onOrderSuccess,
  onClearCart
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form State
  const [customer, setCustomer] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '452 Broadway Ave, Suite 3',
    city: 'New York',
    postalCode: '10013',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
    nameOnCard: 'Jane Doe'
  });

  if (!isOpen) return null;

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customer,
        items: cartItems,
        pricing,
        paymentMethod: paymentMethod === 'card' 
          ? `Credit Card (${cardDetails.number.slice(-4)})` 
          : paymentMethod === 'upi' ? 'Instant UPI / Digital Wallet' : 'Cash on Delivery'
      };

      const newOrder = await createOrder(payload);
      setPlacedOrder(newOrder);
      setStep(3);
      onClearCart();
      onOrderSuccess(newOrder);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // ignore confetti errors
      }
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', borderRadius: '24px' }}>
          
          {/* Header */}
          <div className="modal-header border-bottom p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h5 className="modal-title fw-bold">
                {step === 1 && 'Step 1 of 2: Shipping Information'}
                {step === 2 && 'Step 2 of 2: Secure Payment'}
                {step === 3 && '🎉 Order Confirmed!'}
              </h5>
              <small className="text-muted">
                {step === 1 && 'Enter your delivery address'}
                {step === 2 && 'Choose your preferred simulated payment method'}
                {step === 3 && `Order Reference: ${placedOrder?.id}`}
              </small>
            </div>
            {step !== 3 && (
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            )}
          </div>

          <div className="modal-body p-4">
            
            {/* STEP 1: Shipping Form */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      name="fullName"
                      value={customer.fullName}
                      onChange={handleCustomerChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      name="address"
                      value={customer.address}
                      onChange={handleCustomerChange}
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">City</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      name="city"
                      value={customer.city}
                      onChange={handleCustomerChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Postal / ZIP Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      name="postalCode"
                      value={customer.postalCode}
                      onChange={handleCustomerChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Country</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      name="country"
                      value={customer.country}
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gradient px-4">
                    Continue to Payment <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <form onSubmit={handlePlaceOrder}>
                {/* Method selector */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary-subtle' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <i className="bi bi-credit-card fs-4 d-block mb-1 text-primary"></i>
                      <span className="small fw-semibold">Credit Card</span>
                    </div>
                  </div>

                  <div className="col-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-primary-subtle' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <i className="bi bi-wallet2 fs-4 d-block mb-1 text-success"></i>
                      <span className="small fw-semibold">Digital Wallet</span>
                    </div>
                  </div>

                  <div className="col-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary-subtle' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <i className="bi bi-cash-stack fs-4 d-block mb-1 text-warning"></i>
                      <span className="small fw-semibold">Pay on Delivery</span>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-3 rounded-3 border mb-4" style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Card Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Expiration</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">CVV</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount to pay */}
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-4 bg-primary bg-opacity-10">
                  <span className="fw-semibold">Total to Pay (includes tax):</span>
                  <span className="fs-4 fw-extrabold text-primary">${pricing.total.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)} disabled={loading}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                  </button>
                  <button type="submit" className="btn btn-gradient px-4 py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-1"></i> Authorize & Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && placedOrder && (
              <div className="text-center py-3">
                <div className="mb-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center bg-success text-white"
                    style={{ width: 72, height: 72, fontSize: '2rem' }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </div>
                </div>

                <h3 className="fw-bold mb-1">Thank you for your order!</h3>
                <p className="text-muted mb-4">
                  We've emailed your invoice and confirmation receipt to <strong>{placedOrder.customer.email}</strong>
                </p>

                {/* Order Summary Box */}
                <div className="p-3 rounded-4 border text-start mb-4" style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Order ID:</span>
                    <strong className="small text-primary">{placedOrder.id}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Payment:</span>
                    <span className="small">{placedOrder.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Deliver to:</span>
                    <span className="small">{placedOrder.customer.address}, {placedOrder.customer.city}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top fw-bold" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span>Total Paid:</span>
                    <span className="text-success">${placedOrder.pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-gradient px-4 py-2 rounded-pill"
                    onClick={() => {
                      setStep(1);
                      onClose();
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
