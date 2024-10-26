// otpService.ts
import twilio from 'twilio';
import dotenv from "dotenv"

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
console.log(accountSid)

const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    console.log(phoneNumber)
    console.log("Using Service SID:", serviceSid);
  try {
    await client.verify.v2.services(serviceSid).verifications.create({
      to: phoneNumber,
      channel: 'sms',
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

export const verifyOTP = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: code });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};
