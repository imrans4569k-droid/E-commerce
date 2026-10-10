import React from 'react';

const categoryIcons = {
  All: 'bi-grid-fill',
  Audio: 'bi-headphones',
  Wearables: 'bi-smartwatch',
  Electronics: 'bi-laptop',
  Gaming: 'bi-controller',
  Fashion: 'bi-handbag',
  'Home & Living': 'bi-lamp'
};

export default function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  const allList = [{ name: 'All', count: categories.reduce((sum, c) => sum + c.count, 0) }, ...categories];

  return (
    <div className="container mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-collection text-primary"></i>
          <span>Shop by Category</span>
        </h4>
        <span className="small text-muted">Showing all departments</span>
      </div>

      <div className="d-flex gap-2 overflow-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {allList.map((cat) => {
          const isActive = selectedCategory === cat.name;
          const icon = categoryIcons[cat.name] || 'bi-tag';

          return (
            <button
              key={cat.name}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <i className={`bi ${icon}`}></i>
              <span>{cat.name}</span>
              <span 
                className="badge rounded-pill ms-1"
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--badge-bg)',
                  color: isActive ? '#ffffff' : 'var(--badge-text)'
                }}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
