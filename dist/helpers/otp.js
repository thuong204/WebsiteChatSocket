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
exports.verifyOTP = exports.sendOTP = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
console.log(accountSid);
const client = (0, twilio_1.default)(accountSid, authToken);
const sendOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(phoneNumber);
    console.log("Using Service SID:", serviceSid);
    try {
        yield client.verify.v2.services(serviceSid).verifications.create({
            to: phoneNumber,
            channel: 'sms',
        });
        return true;
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (phoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationCheck = yield client.verify.v2
            .services(serviceSid)
            .verificationChecks.create({ to: phoneNumber, code: code });
        return verificationCheck.status === 'approved';
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        return false;
    }
});
exports.verifyOTP = verifyOTP;
