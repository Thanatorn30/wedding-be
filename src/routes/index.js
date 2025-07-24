const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const userController = require("../controllers/userController");
const tableController = require("../controllers/tableController")
const { auth, adminAuth, optionalAuth } = require("../middleware/auth");

// Test endpoint
// router.get("/testsend", (req, res) => {
//   res.send("test send from api");
// });


// ------ Guest ------
// GET Guest
router.get("/guest/list", guestController.getGuest);
router.get("/guest/id", guestController.getGuestId,);
router.get("/guest/type", guestController.getGuestType);

// POST Guest
router.post("/guest/create",optionalAuth ,guestController.postGuest);
router.post("/guest/type/create",optionalAuth, guestController.postGuestType);

// PUT Guest
router.get("/guest/edit/:id",optionalAuth, guestController.patchGuest);

// DELETE Guest
router.delete("/guest/delete/:id", guestController.deleteGuest);



// ------ Table ------
// GET Table
router.get("/table/list", tableController.getAllTable);

// POST Table
router.post("/table/create", tableController.postTable);

// PATCH Table
router.patch("/table/update/:id", tableController.patchTable);

// ------ Admin ------
// POST Admin
router.post("/admin", userController.postUser);
router.post("/login", userController.login);
























module.exports = router;
