import { z } from "zod";
import User from "../models/userModel.js";
import { signupSchema, loginSchema } from "../utils/zodValidation.js";

export async function signup(req, res, next) {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { name, email, password } = validatedData; // zod validated data

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    // Use req.login() from Passport to establish a session
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        success: true,
        user: user,
      });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // zod error
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
}

export async function login(req, res, next) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select("+password");
    // do this because by default we have set select as false for password
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatched = await user.matchPassword(password);
    if (isMatched) {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({
          success: true,
          user: user,
        });
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
}

export const getMe = (req, res) => {
  // req.user is populated by passport if a valid session exists
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

export const logout = (req, res, next) => {
  // req.logout() is a Passport function to terminate the session
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Clear the session cookie from the browser
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};
