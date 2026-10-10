import React from 'react';

export default function HeroBanner({ onExploreDeals, onScrollToCatalog }) {
  return (
    <div className="container mt-4 mb-5">
      <div className="hero-banner p-4 p-md-5">
        <div className="hero-glow-blob"></div>

        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.85rem'
              }}
            >
              <span className="badge bg-danger rounded-pill px-2 py-1 badge-deal-pulse">
                LIMITED SALE
              </span>
              <span>Use promo code <strong>SAVE20</strong> at checkout</span>
            </div>

            <h1 className="display-4 fw-extrabold lh-tight text-white mb-3">
              Next-Gen Tech & <br className="d-none d-md-block" />
              <span style={{
                background: 'linear-gradient(90deg, #38bdf8, #818cf8, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Timeless Design
              </span>
            </h1>

            <p className="lead text-light opacity-75 mb-4" style={{ maxWidth: '540px' }}>
              Explore studio-grade acoustics, intelligent wearables, high-performance creator optics, and artisan apparel crafted for modern living.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <button 
                className="btn btn-gradient px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2"
                onClick={onExploreDeals}
              >
                <i className="bi bi-fire"></i>
                <span>Explore Top Deals</span>
              </button>
              <button 
                className="btn btn-outline-light px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2"
                onClick={onScrollToCatalog}
              >
                <i className="bi bi-grid-3x3-gap-fill"></i>
                <span>Browse Products</span>
              </button>
            </div>
          </div>

          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
                alt="Aura Pro Headphones"
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  maxHeight: '340px',
                  objectFit: 'cover',
                  transform: 'perspective(1000px) rotateY(-10deg) rotateX(4deg)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                }}
              />
              <div 
                className="position-absolute bottom-0 start-0 translate-middle-y bg-dark bg-opacity-75 text-white p-3 rounded-4 shadow-lg text-start backdrop-blur"
                style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <small className="text-warning d-block fw-bold">★ 4.9 Top Choice</small>
                <strong className="d-block">Aura Pro Series</strong>
                <span className="text-info fw-bold">$279.99</span>
                <span className="text-decoration-line-through text-muted ms-2 small">$349.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Bar */}
      <div className="row g-3 mt-2 text-center text-md-start">
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-4 h-100 d-flex align-items-center gap-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <i className="bi bi-truck fs-3 text-primary"></i>
            <div>
              <div className="fw-bold small">Free Fast Delivery</div>
              <small style={{ color: 'var(--text-muted)' }}>Orders above $50</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded-4 h-100 d-flex align-items-center gap-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <i className="bi bi-shield-check fs-3 text-success"></i>
            <div>
              <div className="fw-bold small">2-Year Warranty</div>
              <small style={{ color: 'var(--text-muted)' }}>100% Genuine items</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded-4 h-100 d-flex align-items-center gap-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <i className="bi bi-arrow-repeat fs-3 text-warning"></i>
            <div>
              <div className="fw-bold small">30-Day Returns</div>
              <small style={{ color: 'var(--text-muted)' }}>Hassle-free exchange</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded-4 h-100 d-flex align-items-center gap-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <i className="bi bi-headset fs-3 text-info"></i>
            <div>
              <div className="fw-bold small">24/7 VIP Support</div>
              <small style={{ color: 'var(--text-muted)' }}>Dedicated assistance</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
