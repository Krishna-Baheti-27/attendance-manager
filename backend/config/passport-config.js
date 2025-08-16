// config/passport-config.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

export function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const name = profile.displayName;

          // --- This is the new logic ---
          // 1. Find user by their unique Google ID first
          let user = await User.findOne({ googleId: googleId });

          if (!user) {
            // 2. If no user is found with that Google ID, try to find one by email to link the accounts
            user = await User.findOne({ email: email });

            if (user) {
              // 2a. If a user exists with that email, add the Google ID to their account
              user.googleId = googleId;
            } else {
              // 2b. If no user is found by email either, create a brand new user
              user = new User({
                googleId: googleId,
                name: name,
                email: email,
              });
            }
          }

          // 3. Update the tokens and save the user (whether they were found, linked, or newly created)
          user.googleAccessToken = accessToken;
          user.googleRefreshToken = refreshToken;
          await user.save();

          return done(null, user);
          // --- End of new logic ---
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // These functions remain the same
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select(
        "+googleAccessToken +googleRefreshToken"
      );
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
