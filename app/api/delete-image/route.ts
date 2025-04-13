import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      console.log('DELETE API: No publicId provided');
      return NextResponse.json({ success: false, error: 'Public ID is required' }, { status: 400 });
    }
    
    console.log('DELETE API: Attempting to delete image with publicId:', publicId);
    
    // Check if the publicId is one of our demo images
    if (publicId.startsWith('demo/') || publicId === 'sample' || publicId.includes('cld-sample')) {
      console.log('DELETE API: Demo image detected, simulating successful deletion');
      return NextResponse.json({ success: true });
    }
    
    // Delete the image from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('DELETE API: Cloudinary response:', result);
      
      // Consider both 'ok' result and 'not found' as success cases
      // If the image is already gone, that's still a success for our purposes
      if (result.result === 'ok' || result.result === 'not found') {
        return NextResponse.json({ success: true });
      } else {
        console.error('DELETE API: Cloudinary returned error:', result);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to delete image',
          cloudinaryResponse: result
        }, { status: 500 });
      }
    } catch (cloudinaryError) {
      console.error('DELETE API: Cloudinary API error:', cloudinaryError);
      return NextResponse.json({ 
        success: false, 
        error: 'Error from Cloudinary API',
        details: JSON.stringify(cloudinaryError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('DELETE API: Server error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: JSON.stringify(error)
    }, { status: 500 });
  }
} 