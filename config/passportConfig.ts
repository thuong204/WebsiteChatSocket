
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import User from '../model/user.model';
import { Express } from 'express';

interface IUser {
    _id: string;
    googleId: string;
    email: string;
    name: string;
}

// Đảm bảo môi trường có biến `MONGO_URL`
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
}

// Cấu hình session
export function configureSession(app: Express): void {
    app.use(
        session({
            secret: 'keyboard cat', // Nên đặt secret từ biến môi trường
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URL,
                collectionName: 'sessions',
                ttl: 14 * 24 * 60 * 60, // Thời gian sống của session (14 ngày)
            }),
        })
    );
}

// Cấu hình Passport
export function configurePassport(app: Express): void {
    app.use(passport.initialize());
    app.use(passport.session());


    // Serialize user (store user ID in session)
    passport.serializeUser((user: IUser, done) => {
        if (user && user._id) {
            console.log('Serializing user:', user);  // Log the user object
            done(null, user._id);  // Store only the user ID in the session
        } else {
            done(new Error('User object is invalid or missing id'));
        }
    });

    // Deserialize user (retrieve user info from the ID stored in session)
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id);  // Fetch user by ID from the DB
            if (!user) {
                console.error('User not found');  // Log if the user is not found
                return done(new Error('User not found'));
            }
            done(null, user);  // Pass the user object to the request
        } catch (err) {
            console.error('Error during deserialization:', err);  // Log any errors
            done(err);
        }
    })
}
