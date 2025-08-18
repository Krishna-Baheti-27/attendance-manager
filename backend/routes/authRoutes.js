import express from "express";
import passport from "passport";
import { signup, login, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Standard Email/Password Routes
router.post("/signup", signup);
router.post("/login", login);

// This route is for logging out and destroying the session.
router.post("/logout", logout);
// This protected route allows the frontend to check if a session is active.
router.get("/me", protect, getMe);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`); // upon success
  }
);

export default router;
