export const WHATSAPP_RECIPIENT_NUMBER = "+918252630335";

export function getTwilioWhatsAppConfig() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_FROM,
    recipientNumber: WHATSAPP_RECIPIENT_NUMBER,
  };
}
