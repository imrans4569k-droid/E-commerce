import React, { useState } from 'react';
import { addNewProduct } from '../services/api';

export default function AdminAddModal({ isOpen, onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '15',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    description: '',
    features: 'Premium Aluminum finish, 1-Year Global Warranty, Quick delivery'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price) * 1.25,
        stock: parseInt(formData.stock, 10),
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
      };

      const created = await addNewProduct(payload);
      onProductAdded(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', borderRadius: '24px' }}>
          
          <div className="modal-header border-bottom p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle-fill text-success fs-5"></i>
              <h5 className="modal-title fw-bold mb-0">Add New Product to Store</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold">Product Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="title" 
                    required 
                    placeholder="e.g. Stealth Wireless Earbuds Pro" 
                    value={formData.title} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Brand</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="brand" 
                    required 
                    placeholder="e.g. Aura Tech" 
                    value={formData.brand} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Category</label>
                  <select 
                    className="form-select" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    name="price" 
                    required 
                    placeholder="99.99" 
                    value={formData.price} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock" 
                    required 
                    value={formData.stock} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Image URL (Unsplash or direct image)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    name="image" 
                    required 
                    value={formData.image} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    name="description" 
                    placeholder="Detailed overview of the product specifications and materials..."
                    value={formData.description} 
                    onChange={handleChange} 
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Key Highlights (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="features" 
                    value={formData.features} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer border-top p-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gradient px-4" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
