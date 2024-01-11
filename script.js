import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

/**
 * script launch before app
 * verify if the folder that will contain the db exist
 * if not, create it to prevent app crash
 */
const pathToSrc = join(fileURLToPath(import.meta.url), "../src");
const folderPaths = [
  join(pathToSrc, "/db/database"),
  join(pathToSrc, "../public/assets/users"),
  join(pathToSrc, "../public/assets/plants"),
  join(pathToSrc, "../public/assets/rapports"),
];

// const pathToFolder = join(fileURLToPath(import.meta.url), "../src/db/database");

folderPaths.forEach((path) => {
  if (!existsSync(path)) {
    console.log(`create path ${path}`);
    mkdirSync(path);
  }
});
