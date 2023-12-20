import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connection } from "./src/db/server.js";
import { createCsrfSecret } from "./src/config/csrfConfig.js";
import {
  extractUserFromToken,
  addJwtFeatures,
} from "./src/config/jwtConfig.js";
import { router } from "./src/routes/index.js";

dotenv.config();

const app = express();

//to have a view on template emails

// import { join } from "path";
// import { fileURLToPath } from "url";

// app.set("view engine", "pug");
// app.set(
//   "views",
//   join(fileURLToPath(import.meta.url), "../src/mailer/templates")
// );
// app.use(
//   express.static(join(fileURLToPath(import.meta.url), "../src/assets/images"))
// );

process.env.CSRF_SECRET = createCsrfSecret();

connection();

app
  .use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    })
  )
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(extractUserFromToken)
  .use(addJwtFeatures)
  .use(router);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);

//route to update avatar
//route to set deleted to true, and set deleted to false if user return
//time to thrully delete user account
//pass validate_account to true when an user validate his email
