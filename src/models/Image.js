const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  title_ig:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  title_fb:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  description:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  eventType:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Image; 