const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'catalog.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// API endpoints
app.get('/api/products', (req, res) => {
  // This will be connected to Firebase
  res.json({ message: 'Products endpoint' });
});

app.post('/api/orders', (req, res) => {
  // This will be connected to Firebase
  res.json({ message: 'Order created' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
