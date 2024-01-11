import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  rapportGetAll,
  rapportGetMy,
} from "../../controllers/rapportController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, rapportGetAll);
router.get("/my", (req, res) => rapportGetMy);
router.get("/offer/:id", (req, res) =>
  res.send("send all rapport concerned by an offer Id")
);
router.get("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("see a rapport. Only Admin, Botanist, offer o<ner or offer guardian")
);

router.post("/:id", ensureIsAuthenticated, (req, res) =>
  res.send(
    "create rapport with offerId. Need to have guardian and not finished yet (date_to)"
  )
);

router.put("/:id", ensureIsAuthenticated, (req, res) => {
  res.send("update rapport with id. Need to be owner");
});

router.delete("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("delete rapport with id. Need to be owner")
);
