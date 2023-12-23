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
];

/**
 * get destination of the received file depending of the param
 * @param {string} fileFolder folder depending of what is the file (example: users, plants, etc.)
 * @returns the destination of the file
 */
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

/**
 * create the base config for file upload (authorized mimetypes, filesize limits, etc.)
 * @param {string} fileFolder param to pass to function getDestination
 * @returns Multer config
 */
export const fileUploadConfig = (fileFolder) => {
  return multer({
    storage: multer.diskStorage({
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
      destination: getDestination(fileFolder),
    }),
    limits: {
      fileSize: 1048576,
    },
    fileFilter: (req, file, cb) => {
      if (!authorizedMimeTypes.includes(file.mimetype.split("/")[1])) {
        return cb(new Error("type not allowed"));
      }
      cb(null, true);
    },
  });
};
