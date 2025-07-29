const Image = require('../models/Image');
const { emitImageUploaded } = require('../utils/socket');

exports.createImage = async (req, res) => {
  try {
    console.log('🖼️ Image upload started');
    console.log('📋 Request body:', req.body);
    console.log('☁️ Cloudinary result:', req.cloudinaryResult);
    
    // res.json({message:req.cloudinaryResult})
    const { url, public_id, original_name, size, eventType } = req.cloudinaryResult;
    const { title, titleIg, titleFb, description, eventType: bodyEventType } = req.body;
    
    console.log('💾 Creating image record in database...');
    const image = await Image.create({
      url,
      public_id,
      original_name,
      size,
      eventType: req.query.type || bodyEventType || eventType,
      title,
      title_ig: titleIg,
      title_fb: titleFb,
      description
    });
    
    console.log('✅ Image record created:', image.id);
    
    // Emit WebSocket event for new image
    try {
      emitImageUploaded(1, image); // Assuming wedding ID is 1 for now
      console.log('🔌 WebSocket event emitted');
    } catch (socketError) {
      console.error('⚠️ WebSocket error (non-critical):', socketError.message);
    }
    
    res.status(201).json({ success: true, image });
  } catch (error) {
    console.error('❌ Image creation error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 

exports.imageList = async (req, res) => {
  try {
    const image = await Image.findAll();
    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 