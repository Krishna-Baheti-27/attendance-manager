import jwt from "jsonwebtoken";

export default function generateToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}
