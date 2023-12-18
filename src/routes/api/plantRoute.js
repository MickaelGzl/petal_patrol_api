import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";

export const router = Router();

router.get("/", (req, res) => res.send("allPlants, only admin"));
router.get("/my-plants", (req, res) =>
  res.send("all plant corresponding to req.user.id")
);
router.get("/:id", (req, res) => res.send("plant by id"));

router.post("/", (req, res) => res.send("create plant"));

router.put("/:id", (req, res) =>
  res.send("update plant by id. verify userId === req.user.id")
);

router.delete("/id", (req, res) => res.send("delete plant"));
