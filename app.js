import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./src/db/server.js";
import {
  extractUserFromToken,
  addJwtFeatures,
} from "./src/config/jwtConfig.js";
import { router } from "./src/routes/index.js";

const app = express();

connection();

app
  .use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  )
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(extractUserFromToken)
  .use(addJwtFeatures)
  .use(router);

app.listen(3000, () => console.log("app listen on port 3000"));
