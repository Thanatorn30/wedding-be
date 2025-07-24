const Table = require("../models/Table")

const getAllTable = async (req, res) => {
  try {
    const allTable = await Table.findAll();
    res.status(200).send(allTable);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch allTable", error: err.message });
  }
};

const postTable = async (req, res) => {
  const {tableNumber,maxSeat,used} = req.body
  if(!tableNumber || !maxSeat){
    return res.status(403).json({message:'fill table data'})
  }

  const checkDup = await Table.findOne({
    where: { tableNumber },
  });

  if (checkDup) {
    return res.status(409).json({ message: "Table Number already exists." });
  }

  try {
    const TableResult = await Table.create({ tableNumber,maxSeat,used });
    return res
      .status(201)
      .json({ message: "Table created successfully.", TableResult });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create Table", error: err.message });
  }
}

const patchTable = async (req, res) => {
  const { used } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }
  if (used == null) {
    return res.status(400).json({ message: 'used is required' });
  }

  const checkTable = await Table.findOne({ where: { id } });
  if (!checkTable) {
    return res.status(404).json({ message: 'table not found' });
  }

  if (used > 10) {
    return res.status(400).json({ message: 'max seat must be greater than used' });
  }

  try {
    await Table.update({ used }, { where: { id } });
    const updatedTable = await Table.findOne({ where: { id } });
    return res.status(200).json({ message: 'success', table: updatedTable });
  } catch (err) {
    return res.status(500).json({ message: 'failed to update table', error: err.message });
  }
};


module.exports = {
  getAllTable,
  postTable,
  patchTable
};
