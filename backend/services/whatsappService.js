import https from "https";
import { URLSearchParams } from "url";
import { getTwilioWhatsAppConfig } from "../config/whatsappConfig.js";
import { formatExpiryDate } from "../utils/expiryUtils.js";

function normalizeWhatsAppNumber(number) {
  if (!number) {
    return "";
  }

  return number.startsWith("whatsapp:") ? number : `whatsapp:${number}`;
}

function isConfiguredValue(value) {
  return Boolean(value && !value.toLowerCase().startsWith("your_"));
}

function hasTwilioConfig() {
  const twilioWhatsAppConfig = getTwilioWhatsAppConfig();

  return (
    isConfiguredValue(twilioWhatsAppConfig.accountSid) &&
    isConfiguredValue(twilioWhatsAppConfig.authToken) &&
    isConfiguredValue(twilioWhatsAppConfig.fromNumber) &&
    isConfiguredValue(twilioWhatsAppConfig.recipientNumber)
  );
}

function buildExpiryReminderWhatsAppMessage(product, daysLeft) {
  return [
    "⚠️ Expira Alert",
    "",
    `Product: ${product.name}`,
    "",
    `Category: ${product.category || "Other"}`,
    "",
    `Expiry Date: ${formatExpiryDate(product.expiryDate)}`,
    "",
    `Days Remaining: ${daysLeft < 0 ? "Expired" : daysLeft}`,
    "",
    "Please consume or replace this item before expiry.",
  ].join("\n");
}

function postTwilioMessage({ body }) {
  const { accountSid, authToken, fromNumber, recipientNumber } = getTwilioWhatsAppConfig();
  const postData = new URLSearchParams({
    From: normalizeWhatsAppNumber(fromNumber),
    To: normalizeWhatsAppNumber(recipientNumber),
    Body: body,
  }).toString();

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const options = {
    hostname: "api.twilio.com",
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let responseBody = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseBody += chunk;
      });
      response.on("end", () => {
        let parsedBody = responseBody;

        try {
          parsedBody = JSON.parse(responseBody);
        } catch {
          // Twilio normally returns JSON, but keep the raw body if parsing fails.
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(parsedBody);
          return;
        }

        const error = new Error(`Twilio WhatsApp request failed with status ${response.statusCode}`);
        error.response = parsedBody;
        reject(error);
      });
    });

    request.on("error", reject);
    request.write(postData);
    request.end();
  });
}

export async function sendExpiryAlertWhatsApp({ product, daysLeft, level }) {
  if (!hasTwilioConfig()) {
    console.warn(
      "Expiry WhatsApp skipped: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_WHATSAPP_NUMBER is missing."
    );
    return false;
  }

  try {
    const response = await postTwilioMessage({
      body: buildExpiryReminderWhatsAppMessage(product, daysLeft),
    });

    console.log(
      `Expiry WhatsApp sent: ${level} reminder for product ${product._id}. Message SID: ${response.sid || "unknown"}`
    );
    return true;
  } catch (error) {
    console.error(`Expiry WhatsApp failed for product ${product._id}:`, error.response || error);
    return false;
  }
}
