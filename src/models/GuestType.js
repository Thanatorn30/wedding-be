const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GuestType = sequelize.define('GuestType', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'GuestType',
  timestamps: true
});

module.exports = GuestType;