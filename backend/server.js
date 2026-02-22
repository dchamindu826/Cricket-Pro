const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route files import kirima
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const packageRoutes = require('./routes/packageRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes setup kirima
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/packages', packageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});