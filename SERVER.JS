require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes'); // सुनिश्चित करें कि यह इम्पोर्ट किया गया है
const expenseRoutes = require('./routes/expenseRoutes'); // सुनिश्चित करें कि यह इम्पोर्ट किया गया है
const budgetRoutes = require('./routes/budgetRoutes'); // सुनिश्चित करें कि यह इम्पोर्ट किया गया है
const goalRoutes = require('./routes/goalRoutes');     // सुनिश्चित करें कि यह इम्पोर्ट किया गया है
const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // JSON बॉडी पार्स करने के लिए
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // अपने फ्रंटएंड के URL से बदलें
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// सभी API रूट्स को '/api' उपसर्ग के तहत माउंट करें
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incomes', incomeRoutes); // इनकम रूट्स को माउंट करें
app.use('/api/expenses', expenseRoutes); // एक्सपेंस रूट्स को माउंट करें
app.use('/api/budgets', budgetRoutes);   // बजट रूट्स को माउंट करें
app.use('/api/goals', goalRoutes);       // गोल रूट्स को माउंट करें

// Basic root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});