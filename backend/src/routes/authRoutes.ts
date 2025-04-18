import express from "express";
import { googleAuth, signup, login,checkAuth } from "../controllers/authController"
const router = express.Router();

router.post("/google", googleAuth);
router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth",checkAuth)

export default router;