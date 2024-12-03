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
exports.configureSession = configureSession;
exports.configurePassport = configurePassport;
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const user_model_1 = __importDefault(require("../model/user.model"));
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
}
function configureSession(app) {
    app.use((0, express_session_1.default)({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: connect_mongo_1.default.create({
            mongoUrl: process.env.MONGO_URL,
            collectionName: 'sessions',
            ttl: 14 * 24 * 60 * 60,
        }),
    }));
}
function configurePassport(app) {
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.serializeUser((user, done) => {
        if (user && user._id) {
            console.log('Serializing user:', user);
            done(null, user._id);
        }
        else {
            done(new Error('User object is invalid or missing id'));
        }
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(id);
            if (!user) {
                console.error('User not found');
                return done(new Error('User not found'));
            }
            done(null, user);
        }
        catch (err) {
            console.error('Error during deserialization:', err);
            done(err);
        }
    }));
}
