# Upload Controller Setup Guide

## Overview
This project includes a comprehensive upload controller that uses Cloudinary for image storage and management. The controller supports single and multiple image uploads, image transformation, and deletion.

## Features
- ✅ Single image upload
- ✅ Multiple image upload (up to 10 images)
- ✅ Image transformation (resize, crop, quality adjustment)
- ✅ Image deletion
- ✅ Image information retrieval
- ✅ File type validation (jpg, jpeg, png, gif, webp)
- ✅ File size limit (10MB)
- ✅ Automatic image optimization

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Other existing variables...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

## Getting Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Replace the placeholder values in your `.env` file

## API Endpoints

### Upload Single Image
```
POST /api/upload/single
Content-Type: multipart/form-data

Form data:
- image: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wedding-images/filename",
    "public_id": "wedding-images/filename",
    "original_name": "original-filename.jpg",
    "size": 123456,
    "format": "jpg"
  }
}
```

### Upload Multiple Images
```
POST /api/upload/multiple
Content-Type: multipart/form-data

Form data:
- images: [files] (up to 10 files)
```

**Response:**
```json
{
  "success": true,
  "message": "3 images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wedding-images/filename1",
      "public_id": "wedding-images/filename1",
      "original_name": "original-filename1.jpg",
      "size": 123456,
      "format": "jpg"
    }
  ]
}
```

### Get Image Information
```
GET /api/upload/info/:public_id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "public_id": "wedding-images/filename",
    "format": "jpg",
    "version": 1234567890,
    "width": 1920,
    "height": 1080,
    "bytes": 123456,
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wedding-images/filename",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wedding-images/filename"
  }
}
```

### Transform Image
```
PUT /api/upload/transform/:public_id
Content-Type: application/json

Body:
{
  "width": 800,
  "height": 600,
  "crop": "fill",
  "quality": "auto",
  "format": "webp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transformed_url": "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_600,c_fill,q_auto,f_webp/wedding-images/filename",
    "public_id": "wedding-images/filename",
    "transformation": [
      {
        "width": 800,
        "height": 600,
        "crop": "fill"
      },
      {
        "quality": "auto"
      },
      {
        "format": "webp"
      }
    ]
  }
}
```

### Delete Image
```
DELETE /api/upload/delete/:public_id
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Usage Examples

### Frontend JavaScript (using FormData)
```javascript
// Upload single image
const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload/single', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};

// Upload multiple images
const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }

  const response = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

### Frontend React Example
```jsx
import React, { useState } from 'react';

const ImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    setLoading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadedImages(prev => [...prev, ...result.data]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
      
      <div>
        {uploadedImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.original_name}
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
```

## Error Handling

The controller includes comprehensive error handling for:
- Invalid file types
- File size limits
- Network errors
- Cloudinary API errors
- Missing files

All errors return appropriate HTTP status codes and error messages.

## Security Features

- File type validation
- File size limits
- Automatic image optimization
- Secure URL generation
- Input sanitization

## Dependencies

The upload functionality requires these packages:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage for multer

All dependencies are already installed in the project. 