import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../model/user.model'; // Đường dẫn đến model User của bạn

export const setupGoogleStrategy = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: '/user/oauth2/redirect/google',
        scope: ['profile', 'email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, cb: Function) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // Tạo người dùng mới nếu không tìm thấy
            user = await User.create({
              googleId: profile.id,
              fullName: profile.displayName,
              email: profile.emails ? profile.emails[0].value : '',
              avatar: profile.photos ? profile.photos[0].value : '',
            });
          }

          if (!user.id) {
            return cb(new Error('User ID is missing'));
          }

          return cb(null, user); // Trả về người dùng
        } catch (err) {
          return cb(err); // Xử lý lỗi
        }
      }
    )
  );
};

export const setupFacebookStrategy = (): void => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        callbackURL: '/user/oauth2/redirect/facebook',
        profileFields: ['id', 'displayName'], // Chọn các trường bạn muốn lấy
      },
      async (accessToken: string, refreshToken: string, profile: any, cb: Function) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
            // Nếu người dùng không tồn tại, tạo người dùng mới
            user = await new User({
              fullName: profile.displayName,
              facebookId: profile.id,
            }).save();
          }
          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
};
