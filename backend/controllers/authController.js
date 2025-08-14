import { z } from "zod";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { signupSchema, loginSchema } from "../utils/zodValidation.js";

export async function signup(req, res) {
  try {
    const validateData = signupSchema.parse(req.body);
    const { name, email, password } = validateData;
    const userExists = await User.findOne({
      email,
    });
    if (userExists) {
      return res.status(400).json({
        success: "false",
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = generateToken(user._id);
    return res.status(201).json({
      success: "true",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    // other errors
    return res.status(400).json({
      success: "false",
      message: "An unexpected error occurred",
    });
  }
}

export async function login(req, res) {
  try {
    const validateData = loginSchema.parse(req.body);
    const { email, password } = validateData;
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: "false",
        message: "Invalid credentials",
      });
    }
    const isMatched = await user.matchPassword(password);
    if (isMatched) {
      const token = generateToken(user._id);
      return res.status(200).json({
        success: "true",
        token,
      });
    }
    return res.status(401).json({
      success: "false",
      message: "Invalid credentials",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    // other errors
    return res.status(400).json({
      success: "false",
      message: "An unexpected error occurred",
    });
  }
}
