import cloudinary from '../config/storage.js';

const folder = process.env.CLOUDINARY_FOLDER ?? 'portfolio';

export const uploadImage = async (file: Express.Multer.File): Promise<{ url: string; key: string }> => {
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, { folder });

  return { url: result.secure_url, key: result.public_id };
};

export const deleteImage = async (key: string): Promise<void> => {
  await cloudinary.uploader.destroy(key);
};
