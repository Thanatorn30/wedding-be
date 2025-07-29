const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const userController = require("../controllers/userController");
const tableController = require("../controllers/tableController");
const uploadController = require("../controllers/uploadController");
const imageController = require("../controllers/imageController");
const socketRoutes = require("./socket");
const { auth, adminAuth, optionalAuth } = require("../middleware/auth");

// Test endpoint
// router.get("/testsend", (req, res) => {
//   res.send("test send from api");
// });


// ------ Guest ------
// GET Guest
router.get("/guest/list", guestController.getGuest);
router.get("/guest/id/:id", guestController.getGuestId,);
router.get("/guest/type", guestController.getGuestType);

// POST Guest
router.post("/guest/create",optionalAuth ,guestController.postGuest);
router.post("/guest/type/create",optionalAuth, guestController.postGuestType);

// PUT Guest
router.put("/guest/edit/:id",optionalAuth, guestController.patchGuest);

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

// ------ Upload ------
// POST Upload
router.post("/image/create", uploadController.upload.single('image'), uploadController.uploadSingleImage,imageController.createImage);
// router.post("/upload/multiple", uploadController.upload.array('images', 10), uploadController.uploadMultipleImages);

// GET Upload
router.get("/image/list", imageController.imageList);

// PUT Upload
router.put("/upload/transform/:public_id", uploadController.transformImage);

// DELETE Upload
router.delete("/image/delete/:public_id", uploadController.deleteImage);

// ------ Socket ------
router.use("/socket", socketRoutes);

module.exports = router;
