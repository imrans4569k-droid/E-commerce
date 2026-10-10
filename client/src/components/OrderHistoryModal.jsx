import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', borderRadius: '24px' }}>
          
          <div className="modal-header border-bottom p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-box-seam text-info fs-5"></i>
              <h5 className="modal-title fw-bold mb-0">Track Orders & History</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted small">Loading order history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                <h5>No orders placed yet</h5>
                <p className="text-muted small">Complete your first purchase to track delivery updates here.</p>
              </div>
            ) : (
              <div className="row g-4">
                
                {/* Orders Left List */}
                <div className="col-lg-5 border-end pe-lg-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <h6 className="fw-bold mb-3 text-muted text-uppercase small">Recent Purchases ({orders.length})</h6>
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '420px' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className={`p-3 rounded-3 border cursor-pointer transition-all ${selectedOrder?.id === ord.id ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                        style={{ background: selectedOrder?.id === ord.id ? undefined : 'var(--bg-body)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setSelectedOrder(ord)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong className="small">{ord.id}</strong>
                          <span className={`badge ${ord.status === 'Shipped' ? 'bg-primary' : ord.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-muted small mb-1">
                          {new Date(ord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">{ord.items.length} item(s)</span>
                          <span className="fw-bold text-primary">${ord.pricing?.total?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Order Detail & Live Tracking */}
                <div className="col-lg-7 ps-lg-4">
                  {selectedOrder ? (
                    <div>
                      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div>
                          <h6 className="fw-bold mb-0">{selectedOrder.id}</h6>
                          <small className="text-muted">Payment via {selectedOrder.paymentMethod}</small>
                        </div>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                          Status: {selectedOrder.status}
                        </span>
                      </div>

                      {/* Shipment Tracking Timeline */}
                      <h6 className="fw-bold mb-3 small text-uppercase text-muted">Tracking Timeline</h6>
                      <div className="mb-4 ps-2">
                        {selectedOrder.trackingSteps?.map((step, idx) => (
                          <div key={idx} className={`order-step ${step.completed ? 'completed' : ''}`}>
                            <div className="order-step-icon">
                              {step.completed ? <i className="bi bi-check"></i> : idx + 1}
                            </div>
                            <div className="fw-bold small">{step.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{step.date}</div>
                          </div>
                        ))}
                      </div>

                      {/* Items */}
                      <h6 className="fw-bold mb-2 small text-uppercase text-muted">Ordered Items</h6>
                      <div className="d-flex flex-column gap-2">
                        {selectedOrder.items?.map((it, i) => (
                          <div key={i} className="d-flex align-items-center gap-3 p-2 rounded-2 border" style={{ background: 'var(--bg-body)', borderColor: 'var(--border-subtle)' }}>
                            <img src={it.image} alt={it.title} className="rounded" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                            <div className="flex-grow-1 min-w-0">
                              <div className="small fw-semibold text-truncate">{it.title}</div>
                              <small className="text-muted">Qty: {it.quantity}</small>
                            </div>
                            <span className="small fw-bold">${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">Select an order on the left to view details</div>
                  )}
                </div>

              </div>
            )}
          </div>

          <div className="modal-footer border-top p-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
