export interface ImageType {
  id: string;
  url: string;
  title: string;
  tags?: string[];
  createdAt: string;
  publicId: string; // Cloudinary public ID for deletion
  width: number;
  height: number;
}

export interface UploadResponse {
  success: boolean;
  image?: ImageType;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  error?: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  original_filename: string;
  created_at: string;
  resource_type: string;
} 