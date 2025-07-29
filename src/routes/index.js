const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const userController = require("../controllers/userController");
const tableController = require("../controllers/tableController");
const uploadController = require("../controllers/uploadController");
const imageController = require("../controllers/imageController");
const socketRoutes = require("./socket");
const { auth, adminAuth, optionalAuth } = require("../middleware/auth");
const { sequelize } = require("../config/database");
const cloudinary = require("cloudinary").v2;

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection test
router.get("/health/db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: "OK", 
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({ 
      status: "ERROR", 
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Cloudinary configuration test
router.get("/health/cloudinary", (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  const config = {
    cloudName: cloudName ? '✅ Set' : '❌ Missing',
    apiKey: apiKey ? '✅ Set' : '❌ Missing',
    apiSecret: apiSecret ? '✅ Set' : '❌ Missing'
  };
  
  const allSet = cloudName && apiKey && apiSecret;
  
  res.status(allSet ? 200 : 500).json({ 
    status: allSet ? "OK" : "ERROR",
    message: allSet ? "Cloudinary configuration complete" : "Cloudinary configuration incomplete",
    config,
    timestamp: new Date().toISOString()
  });
});

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
