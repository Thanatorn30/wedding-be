const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log Cloudinary configuration (without exposing secrets)
console.log('☁️ Cloudinary config check:');
console.log('   Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wedding-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Upload single image
const uploadSingleImage = async (req, res, next) => {
  try {
    console.log('📤 Upload single image started');
    console.log('📁 File info:', req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log('✅ File uploaded successfully to Cloudinary');
    console.log('🔗 Cloudinary URL:', req.file.path);
    
    req.cloudinaryResult = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: req.file.format,
    };

    console.log('📋 Cloudinary result prepared:', req.cloudinaryResult);
    next();

    // res.status(200).json({
    //   success: true,
    //   message: 'Image uploaded successfully',
    //   data: {
    //     url: req.file.path,
    //     public_id: req.file.filename,
    //     original_name: req.file.originalname,
    //     size: req.file.size,
    //     format: req.file.format
    //   }
    // });
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Upload error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
      original_name: file.originalname,
      size: file.size,
      format: file.format,
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading images",
      error: error.message,
    });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete image",
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
};

// Get image info from Cloudinary
const getImageInfo = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await cloudinary.api.resource(public_id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get image info error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting image info",
      error: error.message,
    });
  }
};

// Transform image (resize, crop, etc.)
const transformImage = async (req, res) => {
  try {
    const { public_id } = req.params;
    const { width, height, crop, quality, format } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const transformation = [];

    if (width || height) {
      transformation.push({
        width: width || "auto",
        height: height || "auto",
        crop: crop || "limit",
      });
    }

    if (quality) {
      transformation.push({ quality });
    }

    if (format) {
      transformation.push({ format });
    }

    const url = cloudinary.url(public_id, {
      transformation: transformation,
    });

    res.status(200).json({
      success: true,
      data: {
        transformed_url: url,
        public_id,
        transformation,
      },
    });
  } catch (error) {
    console.error("Transform error:", error);
    res.status(500).json({
      success: false,
      message: "Error transforming image",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo,
  transformImage,
};
