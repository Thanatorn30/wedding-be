const Image = require('../models/Image');
const { emitImageUploaded } = require('../utils/socket');

exports.createImage = async (req, res) => {
  try {
    // res.json({message:req.cloudinaryResult})
    const { url, public_id, original_name, size, eventType } = req.cloudinaryResult;
    const { title, titleIg, titleFb, description, eventType: bodyEventType } = req.body;
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
    
    // Emit WebSocket event for new image
    emitImageUploaded(1, image); // Assuming wedding ID is 1 for now
    
    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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