import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import { chatOfUser } from "../../controllers/chatController.js";

export const router = Router();

/*
this route will find if user have an active chat with another
Chat is active if an offer is pending, and have a guardianId
user have to be offer owner or guardian

if finded, user will receive the chat, and if click on it front side, socket will connect to this room
*/

router.get("/:id", ensureIsAuthenticated, ensureUserHaveRights, chatOfUser);
