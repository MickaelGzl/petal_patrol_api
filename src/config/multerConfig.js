import multer from "multer";
import { join } from "path";
import { fileURLToPath } from "url";

const authorizedMimeTypes = [
  "jpg",
  "jpeg",
  "jfif",
  "png",
  "svg",
  "webp",
  "bmp",
]; //define the authorides file mymetypes

function getDestination(fileFolder) {
  return (req, file, cb) => {
    cb(
      null,
      join(
        fileURLToPath(import.meta.url),
        `../../../public/assets/${fileFolder}`
      )
    );
  };
}

export const fileUploadConfig = (fileFolder) => {
  return multer({
    storage: multer.diskStorage({
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
      destination: getDestination(fileFolder),
    }),
    limits: {
      fileSize: 512001,
    },
    fileFilter: (req, file, cb) => {
      if (!authorizedMimeTypes.includes(file.mimetype.split("/")[1])) {
        return cb(new Error("type not allowed"));
      }
      cb(null, true);
    },
  });
};
