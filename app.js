import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./src/db/server.js";

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
  .use(cookieParser());

app.listen(3000, () => console.log("app listen on port 3000"));
