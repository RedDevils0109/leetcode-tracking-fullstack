const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
      };

      try {
        const user = await User.findOne({ googleId: profile.id }).exec();
        if (user) {
          done(null, user); // Pass user directly
        } else {
          const emailExisted = await User.findOne({
            email: newUser.email,
          }).exec();
          if (emailExisted) {
            emailExisted.googleId = newUser.googleId;
            await emailExisted.save();
            done(null, emailExisted); // Pass updated user
          } else {
            const newGoogleUser = await User.create(newUser);
            done(null, newGoogleUser); // Pass new user
          }
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);
