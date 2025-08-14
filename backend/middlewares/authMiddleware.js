import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      const foundUser = await User.findById(decodedData.id).select("-password");
      if (foundUser) {
        req.user = foundUser;
        next();
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: "false",
        message: "Not authorized, token failed",
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      success: "false",
      message: "Not authorized, no token found",
    });
  }
}
