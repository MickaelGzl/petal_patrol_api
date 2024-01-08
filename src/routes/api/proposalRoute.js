import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";

export const router = Router();

router.get("/my-proposals", ensureIsAuthenticated, (req, res) =>
  res.send("send all proposal corresponding to req.user.id")
);
router.get("/plant/:id", ensureIsAuthenticated, (req, res) =>
  res.send("send all proposal corresponding to plant if user is plant owner")
);
router.get("/:id", ensureIsAuthenticated, (req, res) =>
  res.send(
    "send the proposal corresponding to id if req.user.id === proposal.offer.ownerId "
  )
);

router.post("/:id", ensureIsAuthenticated, (req, res) =>
  res.send(
    "create a proposal associate to an offer by id and req.user.id. Offer need to have not guardian and date_to > data.now()"
  )
);

router.put("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("update message of proposal if always exist and user is req.user")
);

router.delete("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("delete proposal if always exist and user is req.user")
);
