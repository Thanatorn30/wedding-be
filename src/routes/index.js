const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const userController = require("../controllers/userController");
const tableController = require("../controllers/tableController")
const { auth, adminAuth, optionalAuth } = require("../middleware/auth");

// Test endpoint
router.get("/testsend", (req, res) => {
  res.send("test send from api");
});

// get guest
router.get("/guest/list", guestController.getGuest);



// POST Admin
router.post("/admin", userController.postUser);
router.post("/login", userController.login);
router.post("/guest/create",optionalAuth ,guestController.postGuest);

router.post("/guest/type/create",optionalAuth, guestController.postGuestType);
router.get("/guest/type", guestController.getGuestType);


router.post("/table/create", tableController.postTable);
router.get("/table", tableController.getAllTable);






module.exports = router;
