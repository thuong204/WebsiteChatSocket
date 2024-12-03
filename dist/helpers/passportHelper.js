"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupFacebookStrategy = exports.setupGoogleStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = __importDefault(require("../model/user.model"));
const setupGoogleStrategy = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: '/user/oauth2/redirect/google',
        scope: ['profile', 'email'],
    }, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.default.findOne({ googleId: profile.id });
            if (!user) {
                user = yield user_model_1.default.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails ? profile.emails[0].value : '',
                    avatar: profile.photos ? profile.photos[0].value : '',
                });
            }
            if (!user.id) {
                return cb(new Error('User ID is missing'));
            }
            return cb(null, user);
        }
        catch (err) {
            return cb(err);
        }
    })));
};
exports.setupGoogleStrategy = setupGoogleStrategy;
const setupFacebookStrategy = () => {
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        callbackURL: '/user/oauth2/redirect/facebook',
        profileFields: ['id', 'displayName'],
    }, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.default.findOne({ facebookId: profile.id });
            if (!user) {
                user = yield new user_model_1.default({
                    fullName: profile.displayName,
                    facebookId: profile.id,
                }).save();
            }
            return cb(null, user);
        }
        catch (err) {
            return cb(err);
        }
    })));
};
exports.setupFacebookStrategy = setupFacebookStrategy;
