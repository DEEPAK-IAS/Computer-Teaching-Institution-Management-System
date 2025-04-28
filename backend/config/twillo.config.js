const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(to, messageBody) {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log(`Message sent with SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    throw error;
  }
}

export default sendSMS;