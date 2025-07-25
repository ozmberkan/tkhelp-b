import express from "express";
import {
  loginController,
  logoutController,
  meController,
  refreshTokenController,
  registerController,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/me", authenticate, meController);
router.get("/logout", logoutController);
router.get("/refresh", authenticate, refreshTokenController);

export default router;
