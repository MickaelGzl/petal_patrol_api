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
app.set("view engine", "pug");
app.set("views", join(fileURLToPath(import.meta.url), "../src/views/"));

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
    "/images/images",
    express.static(
      join(fileURLToPath(import.meta.url), "../public/assets/images")
    )
  )
  .use(
    "/images/users",
    express.static(
      join(fileURLToPath(import.meta.url), "../public/assets/users")
    )
  )
  .use(
    "/images/plants",
    express.static(
      join(fileURLToPath(import.meta.url), "../public/assets/plants")
    )
  )
  .use(
    "/images/rapports",
    express.static(
      join(fileURLToPath(import.meta.url), "../public/assets/rapports")
    )
  )
  .use(router);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`app listen on port http://localhost:${port}`)
);

//update plant create with multer store files, just send object with name, type and image

//si un fichier est invalide je ne peux plus accéder a aucune route

//validate_account = n'empeche pas de se connecter mais d'enregistrer des offres ou de répondres à celles ci
