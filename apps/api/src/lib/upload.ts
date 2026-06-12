import multer from "multer";

const maxBytes = 100 * 1024 * 1024;

const storage = multer.memoryStorage();

export const audioUpload = multer({
  storage,
  limits: { fileSize: maxBytes },
}).single("file");

export const completeMeetingUpload = multer({
  storage,
  limits: { fileSize: maxBytes },
}).fields([
  { name: "recording", maxCount: 1 },
  { name: "notes", maxCount: 1 },
]);
