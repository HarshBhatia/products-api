const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
