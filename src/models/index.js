const Guest = require('./Guest');
const GuestType = require('./GuestType');
const Table = require('./Table');
const User = require('./User');
const Image = require('./Image');

// Define relationships

// Guest 1:1 GuestType
Guest.belongsTo(GuestType, { 
  foreignKey: 'typeId',
  as: 'guestType'
});
GuestType.hasOne(Guest, { 
  foreignKey: 'typeId',
  as: 'guest'
});

// Guest 1:1 Table
Guest.belongsTo(Table, { 
  foreignKey: 'tableId',
  as: 'table'
});
Table.hasOne(Guest, { 
  foreignKey: 'tableId',
  as: 'guest'
});

module.exports = {
  Guest,
  GuestType,
  Table,
  User,
  Image
};
