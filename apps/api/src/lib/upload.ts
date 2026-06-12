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

const templateMaxBytes = 25 * 1024 * 1024;

export const momTemplateUpload = multer({
  storage,
  limits: { fileSize: templateMaxBytes },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only DOCX and PDF files are supported"));
  },
}).single("file");
