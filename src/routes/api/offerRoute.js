import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";

export const router = Router();

router.get("/all", ensureIsAuthenticated, ensureUserHaveRights, (req, res) =>
  res.send("find all offer in app, including plant and user")
);
router.get("/", ensureIsAuthenticated, (req, res) =>
  res.send(
    "find all plant not fulfilled yet (include plant and user, where guardianId is null"
  )
);
router.get("/my-offers", ensureIsAuthenticated, (req, res) =>
  res.send("find all offer by req.user.id")
);
router.get("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("find specific offer by id")
);

router.post("/", ensureIsAuthenticated, (req, res) =>
  res.send("create an offer. Need to have a plant")
);

router.put(
  "/:id",
  ensureIsAuthenticated,
  (req, res) =>
    res.send("update an offer by id (description, address, zip, city, from, to")
  //if address, zip and city updated but without coordinates, clear previous coordinates
);
router.put("/:id/advice", ensureIsAuthenticated, (req, res) =>
  res.send(
    "if user want advices, botanist can send advice here. update from previous advice"
  )
);
router.put("/:id/guard/:userId", ensureIsAuthenticated, (req, res) =>
  res.send("update guardian if null")
);

router.delete("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("delete offer by id")
);
