import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

/**
 * script launch before app
 * verify if the folder that will contain the db exist
 * if not, create it to prevent app crash
 */

const pathToFolder = join(fileURLToPath(import.meta.url), "../src/db/database");
if (!existsSync(pathToFolder)) {
  mkdirSync(pathToFolder);
}
