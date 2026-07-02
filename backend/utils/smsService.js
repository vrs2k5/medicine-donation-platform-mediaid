const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromPhone) {
  console.warn('Twilio credentials are not set in environment variables.');
}

const client = twilio(accountSid, authToken);

async function sendSMS(to, body) {
  if (!accountSid || !authToken || !fromPhone) {
    throw new Error('Twilio credentials are missing');
  }
  try {
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to
    });
    return message;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

module.exports = { sendSMS };
