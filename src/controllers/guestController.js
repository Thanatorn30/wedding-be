const GuestType = require("../models/GuestType");
const Guest = require("../models/Guest");
const Table  = require("../models/Table");

const getGuest = async (req, res) => {
  try {
    const users = await Guest.findAll({
      include: [
        {
          model: GuestType,
          as: 'guestType',
          attributes: ["type"],
        },
        {
          model: Table,
          as: 'table',
          attributes: ["tableNumber","maxSeat","used"],
        },
      ],
    });
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

const getGuestId = async (req, res) => {
  try {
    const users = await Guest.findOne({ where: (id = req.id) });
    res.status(200).json({user:users});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

const postGuest = async (req, res) => {
  const { firstName, lastName, nickName, typeId, tableId, sumFollower } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !nickName ||
    !typeId ||
    !tableId ||
    !sumFollower
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // check dup
  const checkGuest = await Guest.findOne({
    where: {
      firstName,
      lastName,
      nickName,
      typeId,
      tableId,
      sumFollower,
    },
  });

  if (checkGuest) {
    return res.status(409).json({ message: "Guest already exists." });
  }

  try {
    const guest = await Guest.create({
      firstName,
      lastName,
      nickName,
      typeId,
      tableId,
      sumFollower,
    });
    return res
      .status(201)
      .json({ message: "Guest created successfully.", guest });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create guest", error: err.message });
  }
};

const patchGuest = async (req, res) => {
  const { firstName, lastName, nickName, typeId, tableId, sumFollower } =
    req.body;
  const { id } = req.params;
  const updateData = {
    firstName: firstName ? firstName : "",
    lastName: lastName ? lastName : "",
    nickName: nickName ? nickName : "",
    typeId: typeId ? nickName : "",
    tableId: tableId ? tableId : "",
    sumFollower: sumFollower ? sumFollower : "",
  };
  try {
    const checkGuest = await Guest.findByPk(id);
    if (!checkGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const [updatedRows] = await Guest.update(updateData, { where: { id } });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No changes made to the guest" });
    }

    const updatedGuest = await Guest.findByPk(id);

    res.status(200).json({
      message: "Guest updated successfully",
      data: updatedGuest,
    });
  } catch (error) {
    console.error("Error updating guest:", error);
    res.status(500).json({ message: "Error updating guest" });
  }
};

const deleteGuest = async (req, res) => {
  const { id } = req.params;
  try {
    const checkGuest = await Guest.findByPk(id);
    if (!checkGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    const deletedRows = await Guest.destroy({ where: { id: id } });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error delete guest" });
  }
};

const getGuestType = async (req, res) => {
  try {
    const guestType = await GuestType.findAll();
    return res.status(200).send(guestType);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch guest type", error: err.message });
  }
};
const postGuestType = async (req, res) => {
  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ message: "Guest Type is require" });
  }

  const checkDup = await GuestType.findOne({
    where: { type },
  });

  if (checkDup) {
    return res.status(409).json({ message: "Guest Type already exists." });
  }

  try {
    const GuestTypeResult = await GuestType.create({ type: type });
    return res
      .status(201)
      .json({ message: "Guest Type created successfully.", GuestTypeResult });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create guest Type", error: err.message });
  }
};

module.exports = {
  getGuest,
  postGuest,
  getGuestId,
  patchGuest,
  deleteGuest,
  postGuestType,
  getGuestType,
};
