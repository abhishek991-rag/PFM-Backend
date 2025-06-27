// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Middleware
const errorHandler = require('./middleware/errorHandler'); // <-- Import errorHandler

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route for testing (optional)
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware (sabhi routes ke baad aata hai)
app.use(errorHandler); // <-- Yahan use karein

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));