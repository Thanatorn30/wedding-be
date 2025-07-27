const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Guest = sequelize.define(
  "Guest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // เปลี่ยนเป็น true ชั่วคราว
    },
    typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "GuestType",
        key: "id",
      },
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Table",
        key: "id",
      },
    },
    sumFollower: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "guests",
    timestamps: true,
  }
);

module.exports = Guest;
