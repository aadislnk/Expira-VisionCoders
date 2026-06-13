import Product from "../models/Product.js";
import ReminderHistory from "../models/ReminderHistory.js";
import { sendExpiryAlertEmail } from "./emailService.js";
import { sendExpiryAlertWhatsApp } from "./whatsappService.js";
import { calculateDaysLeft, getReminderLevel } from "../utils/expiryUtils.js";

export async function runExpiryReminderCheck(now = new Date()) {
  const products = await Product.find({}).populate("addedBy", "email");
  const summary = {
    checked: products.length,
    sent: 0,
    skipped: 0,
    whatsappSent: 0,
    whatsappSkipped: 0,
  };

  for (const product of products) {
    const daysLeft = calculateDaysLeft(product.expiryDate, now);
    const level = getReminderLevel(daysLeft);

    if (!level || !product.addedBy?._id) {
      summary.skipped += 1;
      continue;
    }

    const alreadySent = await ReminderHistory.exists({
      product: product._id,
      user: product.addedBy._id,
      level,
    });

    if (alreadySent) {
      summary.skipped += 1;
      continue;
    }

    const wasSent = await sendExpiryAlertEmail({ product, daysLeft, level });

    if (!wasSent) {
      summary.skipped += 1;
      continue;
    }

    const wasWhatsAppSent = await sendExpiryAlertWhatsApp({ product, daysLeft, level });

    if (wasWhatsAppSent) {
      summary.whatsappSent += 1;
    } else {
      summary.whatsappSkipped += 1;
    }

    await ReminderHistory.create({
      product: product._id,
      user: product.addedBy._id,
      level,
    });
    summary.sent += 1;
  }

  return summary;
}
