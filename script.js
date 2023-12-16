import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const pathToFolder = join(fileURLToPath(import.meta.url), "../src/db/database");
if (!existsSync(pathToFolder)) {
  mkdirSync(pathToFolder);
}
