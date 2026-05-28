import multer from 'multer';
import AppError from '../errors/AppError.js';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Format non supporté. Utilisez JPEG, PNG, WEBP, GIF ou SVG.', 400));
    }
  },
});

export default upload;
