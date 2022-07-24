import "dotenv/config";
import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = Twilio(accountSid!, authToken!);

export const twilio = client.verify.v2.services(
  "VA1e6a0845d9b33af3c24a7029af8a0cd2"
);
