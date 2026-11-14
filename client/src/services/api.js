import defaultProducts from '../data/products.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initial demo coupons
const COUPONS = {
  SAVE20: { code: 'SAVE20', discountPercent: 20, description: '20% Off Storewide' },
  WELCOME10: { code: 'WELCOME10', discountPercent: 10, description: '10% Welcome Discount' },
  FLASH15: { code: 'FLASH15', discountPercent: 15, description: '15% Flash Sale' }
};

// Initial demo order
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ORD-9281-2026',
    customer: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-1',
        title: 'Aura Pro Wireless Noise-Cancelling Headphones',
        price: 279.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      }
    ],
    pricing: {
      subtotal: 279.99,
      discount: 28.00,
      tax: 20.16,
      shipping: 0,
      total: 272.15
    },
    status: 'Shipped',
    paymentMethod: 'Credit Card (ending 4242)',
    trackingSteps: [
      { title: 'Order Placed', date: '2026-10-08 09:30', completed: true },
      { title: 'Packed & Verified', date: '2026-10-08 14:15', completed: true },
      { title: 'In Transit with Carrier', date: '2026-10-09 11:00', completed: true },
      { title: 'Out for Delivery', date: 'Estimated tomorrow', completed: false }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper: Get local product catalog including custom admin added items
const getLocalProducts = () => {
  try {
    const saved = localStorage.getItem('aura_local_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read aura_local_products from localStorage', e);
  }
  return [...defaultProducts];
};

const saveLocalProducts = (products) => {
  try {
    localStorage.setItem('aura_local_products', JSON.stringify(products));
  } catch (e) {
    console.warn('Could not save aura_local_products to localStorage', e);
  }
};

// Helper: Get local orders
const getLocalOrders = () => {
  try {
    const saved = localStorage.getItem('aura_local_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read aura_local_orders from localStorage', e);
  }
  return INITIAL_DEMO_ORDERS;
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem('aura_local_orders', JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save aura_local_orders to localStorage', e);
  }
};

// ================= API FUNCTIONS WITH FALLBACK ================= //

export const fetchProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.inStock) query.append('inStock', 'true');
    if (params.featured) query.append('featured', 'true');
    if (params.deals) query.append('deals', 'true');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // API not reachable or timeout -> use local fallback
  }

  // Fallback filtering & sorting logic
  let filtered = getLocalProducts();

  if (params.category && params.category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  if (params.minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
  }

  if (params.maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
  }

  if (params.inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (params.featured) {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (params.deals) {
    filtered = filtered.filter(p => p.isDeal);
  }

  if (params.sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (params.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (params.sort === 'newest') {
    filtered.reverse();
  }

  return {
    total: filtered.length,
    products: filtered
  };
};

export const fetchProductById = async (id) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const all = getLocalProducts();
  const product = all.find(p => p.id === id);
  if (!product) throw new Error('Product not found');

  const related = all
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return { ...product, related };
};

export const fetchCategories = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/categories`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const products = getLocalProducts();
  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });

  return Object.keys(categoryMap).map(name => ({
    name,
    count: categoryMap[name]
  }));
};

export const validateCoupon = async (code) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok) return data;
    throw new Error(data.message || 'Invalid coupon');
  } catch (err) {
    if (err.message && err.message.includes('Invalid coupon')) throw err;
  }

  const upper = code?.trim().toUpperCase();
  const coupon = COUPONS[upper];
  if (coupon) {
    return { valid: true, coupon };
  }
  throw new Error('Invalid or expired promo code. Try SAVE20 or WELCOME10');
};

export const createOrder = async (orderPayload) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const { customer, items, pricing, paymentMethod } = orderPayload;
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

  // Decrement stock in local storage
  const products = getLocalProducts();
  if (Array.isArray(items)) {
    items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod && prod.stock >= item.quantity) {
        prod.stock -= item.quantity;
      }
    });
    saveLocalProducts(products);
  }

  const newOrder = {
    id: orderId,
    customer,
    items,
    pricing: {
      subtotal: pricing?.subtotal || 0,
      discount: pricing?.discount || 0,
      tax: pricing?.tax || 0,
      shipping: pricing?.shipping || 0,
      total: pricing?.total || 0
    },
    paymentMethod: paymentMethod || 'Credit Card (Simulated)',
    status: 'Processing',
    trackingSteps: [
      { title: 'Order Confirmed', date: 'Just now', completed: true },
      { title: 'Packaging & Quality Check', date: 'In progress', completed: true },
      { title: 'Dispatched to Carrier', date: 'Pending', completed: false },
      { title: 'Delivered', date: 'Estimated 2-3 business days', completed: false }
    ],
    createdAt: new Date().toISOString()
  };

  const existingOrders = getLocalOrders();
  saveLocalOrders([newOrder, ...existingOrders]);
  return newOrder;
};

export const fetchOrders = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/orders`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return getLocalOrders();
};

export const addNewProduct = async (productData) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const { title, brand, category, price, originalPrice, description, stock, image, features } = productData;
  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    brand: brand || 'Nexus Brand',
    category,
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.2,
    rating: 5.0,
    ratingCount: 1,
    stock: parseInt(stock, 10) || 10,
    isFeatured: true,
    isDeal: false,
    badge: 'NEW',
    image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    description: description || 'High-quality premium product.',
    features: Array.isArray(features) ? features : (features ? [features] : ['Premium build', '1 Year Warranty']),
    tags: [category.toLowerCase(), 'new-arrival']
  };

  const products = getLocalProducts();
  const updated = [newProduct, ...products];
  saveLocalProducts(updated);
  return newProduct;
};
