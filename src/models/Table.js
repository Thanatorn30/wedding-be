const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxSeat: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  used: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'Table',
  timestamps: true
});

module.exports = Table;