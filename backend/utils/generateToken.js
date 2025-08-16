import jwt from "jsonwebtoken";
import { email } from "zod";

export default function generateToken(user) {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    googleId: user.googleId,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}
