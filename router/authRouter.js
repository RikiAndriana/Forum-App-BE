import express from "express";
import {
  RegisterUser,
  LoginUser,
  LogoutUser,
  GetUser,
} from "../controller/authController.js";
import { authMiddleware, permisionUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// post /api/v1/auth/register
router.post("/register", RegisterUser);

// post /api/v1/auth/login
router.post("/login", LoginUser);

// get /api/v1/auth/logout
router.get("/logout", authMiddleware, LogoutUser);

// get /api/v1/auth/getuser
router.get("/getuser", authMiddleware, permisionUser("user", "admin"), GetUser);

export default router;
