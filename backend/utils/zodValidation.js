import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
