import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data initialized from JSON
const productsPath = path.join(__dirname, 'data', 'products.json');
let products = [];
try {
  const rawData = fs.readFileSync(productsPath, 'utf-8');
  products = JSON.parse(rawData);
} catch (err) {
  console.error('Failed to load products.json:', err);
}

// In-memory orders collection with initial demo orders
let orders = [
  {
    id: "ORD-9281-2026",
    customer: {
      fullName: "Alex Rivera",
      email: "alex.rivera@example.com",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
      country: "United States"
    },
    items: [
      {
        id: "prod-1",
        title: "Aura Pro Wireless Noise-Cancelling Headphones",
        price: 279.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
      }
    ],
    pricing: {
      subtotal: 279.99,
      discount: 28.00,
      tax: 20.16,
      shipping: 0,
      total: 272.15
    },
    status: "Shipped",
    paymentMethod: "Credit Card (ending 4242)",
    trackingSteps: [
      { title: "Order Placed", date: "2026-10-08 09:30", completed: true },
      { title: "Packed & Verified", date: "2026-10-08 14:15", completed: true },
      { title: "In Transit with Carrier", date: "2026-10-09 11:00", completed: true },
      { title: "Out for Delivery", date: "Estimated tomorrow", completed: false }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Valid coupons
const COUPONS = {
  SAVE20: { code: 'SAVE20', discountPercent: 20, description: '20% Off Storewide' },
  WELCOME10: { code: 'WELCOME10', discountPercent: 10, description: '10% Welcome Discount' },
  FLASH15: { code: 'FLASH15', discountPercent: 15, description: '15% Flash Sale' }
};

// ================= ROUTES ================= //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categories = Object.keys(categoryMap).map(name => ({
    name,
    count: categoryMap[name]
  }));
  res.json(categories);
});

// GET /api/products with filtering, search, sorting
app.get('/api/products', (req, res) => {
  const { category, search, sort, minPrice, maxPrice, inStock, featured, deals } = req.query;

  let filtered = [...products];

  if (category && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (inStock === 'true') {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (featured === 'true') {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (deals === 'true') {
    filtered = filtered.filter(p => p.isDeal);
  }

  // Sorting
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    filtered.reverse();
  }

  res.json({
    total: filtered.length,
    products: filtered
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Also include 3 related products from the same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  res.json({ ...product, related });
});

// POST /api/products (Admin addition)
app.post('/api/products', (req, res) => {
  const { title, brand, category, price, originalPrice, description, stock, image, features } = req.body;
  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Title, category, and price are required' });
  }

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

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// POST /api/coupons/validate
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  const upper = code.trim().toUpperCase();
  const coupon = COUPONS[upper];
  if (coupon) {
    res.json({ valid: true, coupon });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid or expired promo code. Try SAVE20 or WELCOME10' });
  }
});

// POST /api/orders (Create order)
app.post('/api/orders', (req, res) => {
  const { customer, items, pricing, paymentMethod } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ error: 'Invalid order data. Customer and items are required' });
  }

  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

  // Decrement stock in memory
  items.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
    }
  });

  const order = {
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

  orders.unshift(order);
  res.status(201).json(order);
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// GET /api/stats (Admin stats)
app.get('/api/stats', (req, res) => {
  const totalSales = orders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0);
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalSales: totalSales.toFixed(2),
    lowStockCount: products.filter(p => p.stock < 12).length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 E-Commerce Server running on http://localhost:${PORT}`);
});
