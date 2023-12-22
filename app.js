import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
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

//create a window of 10min. each ip have the right to make 100 request during this window
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app
  .use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    })
  )
  .use(limiter)
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(extractUserFromToken)
  .use(addJwtFeatures)
  .use(
    "/image",
    express.static(
      join(fileURLToPath(import.meta.url), "../public/assets/images")
    )
  )
  .use(router);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);

//route to update avatar
//route to set deleted to true, and set deleted to false if user return
//time to thrully delete user account
//pass validate_account to true when an user validate his email
