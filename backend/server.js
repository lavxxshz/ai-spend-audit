const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate limiter — max 10 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/audit', limiter);

const sequelize = require('./config/db');
const auditRoutes = require('./routes/audit');

app.use('/api/audit', auditRoutes);
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { msg: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

sequelize.sync()
  .then(() => {
    console.log('MySQL Connected & Tables Created');
    const PORT = process.env.PORT || 8080;
 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));