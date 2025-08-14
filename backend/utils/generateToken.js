import jwt from "jsonwebtoken";

export default function generateToken(user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}
