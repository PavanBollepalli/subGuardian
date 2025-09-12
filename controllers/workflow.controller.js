import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import transporter from "../config/nodemailer.js"; // Import the transporter

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 3, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
      await triggerReminder(context, `Reminder ${daysBefore} days before`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    // Use .lean() to get a plain JavaScript object without circular references
    const subscription = await Subscription.findById(subscriptionId).populate('user', "email name").lean();
    // Serialize to remove any remaining circular references
    return JSON.parse(JSON.stringify(subscription));
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} on ${date.format('YYYY-MM-DD')}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    // Use the passed subscription instead of refetching
    if (!subscription || !subscription.user || !subscription.user.email) {
      console.error('Subscription or user email not found');
      return;
    }

    // Email options
    const mailOptions = {
      from: 'pavanvenkatanagamanoj@gmail.com', // Use the accountEmail from nodemailer.js
      to: subscription.user.email,
      subject: `Subscription Reminder: ${label}`,
      text: `Hi ${subscription.user.name},\n\nYour subscription "${subscription.name}" is renewing on ${dayjs(subscription.renewalDate).format('YYYY-MM-DD')}.\n\n${label}.\n\nBest regards,\nSubscription Tracker`,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${subscription.user.email} for ${label}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
};