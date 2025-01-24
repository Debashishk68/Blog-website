const passport = require('passport');
const userModel = require('../models/user-model');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
    done(null , user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/callback",
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    
    try {
      
      let user = await userModel.findOne({ email: profile.email });

      if (!user) {
        
        user = await userModel.create({
          googleId: profile.id,
          name: profile._json.name,
          profileImg: profile.picture,
          email: profile.email,
          role: 'author',
        });

        
      } 
     
      return done(null, user);

    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      return done(error, null); 
    }
  }
));
