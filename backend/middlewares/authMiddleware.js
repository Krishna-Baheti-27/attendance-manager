// middleware/authMiddleware.js

// This is the middleware for protecting routes that require a logged-in user (via session)
export const protect = (req, res, next) => {
  // Passport.js attaches the req.isAuthenticated() function to the request object.
  // It returns true if the user has a valid, active session (i.e., they are logged in).
  if (req.isAuthenticated()) {
    // If they are authenticated, just proceed to the next function (the controller)
    return next();
  } else {
    // If they are not authenticated, send a 401 Unauthorized error
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};
