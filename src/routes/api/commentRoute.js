import { Router } from "express";
import {
  ensureIsAuthenticated,
  // ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  commentCreate,
  commentDelete,
  commentGetMy,
  commentUpdate,
} from "../../controllers/commentController.js";

export const router = Router();

// router.get("/", ensureIsAuthenticated, ensureUserHaveRights, (req, res) =>
//   res.send("get all rapport in app")
// ); TODO: think is useless
router.get("/my", ensureIsAuthenticated, commentGetMy);
// router.get("/:id", ensureIsAuthenticated, (req, res) =>
//   res.send(
//     "find all rapport write on a rapport. User is offer owner, guardian, admin or botanist"
//   )
// ); No cause all comment are wrote on the rapport selected. TODO update rapport by id

router.post("/:id", ensureIsAuthenticated, commentCreate);

router.put("/:id", ensureIsAuthenticated, commentUpdate);

router.delete("/:id", ensureIsAuthenticated, commentDelete);
