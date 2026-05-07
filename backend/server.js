const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const sequelize = require('./config/db');
const auditRoutes = require('./routes/audit');

app.use('/api/audit', auditRoutes);

sequelize.sync()
  .then(() => {
    console.log('MySQL Connected & Tables Created');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log(err));