const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Audit = sequelize.define('Audit', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  auditData: { type: DataTypes.TEXT },
  totalMonthlySavings: { type: DataTypes.FLOAT },
  totalAnnualSavings: { type: DataTypes.FLOAT },
});

module.exports = Audit;