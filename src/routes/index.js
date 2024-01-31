import { Router } from "express";
import { router as apiRoute } from "./api/apiRoute.js";
import { validateTokenWithSecret } from "../config/csrfConfig.js";

export const router = Router();

//use Express.Router
//router.use = each routes corresponding will use the logical of the called router
// * match with any routes

router.use("/api", apiRoute);

//view for reset password form
router.get(
  "/views/reset-password/:userId/:userToken/:serverToken",
  (req, res) => {
    let message;
    try {
      if (
        !req.params.serverToken ||
        !validateTokenWithSecret(
          process.env.CSRF_SECRET,
          req.params.serverToken
        )
      ) {
        message = "Token invalide";
        return res.status(401).json({ message });
      }
      res.render("resetPasswordForm");
    } catch (error) {
      console.error("error");
      message = "erreur lors de la redirection utilisateur.";
      return res.status(500).json({ message });
    }
  }
);

router.get("/test", (req, res) => {
  res.json({ message: "coucou" });
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "no route corresponding" });
});
