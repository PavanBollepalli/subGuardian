import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1, 0]

export const sendReminders = serve(async (context) => {
  console.log(`Workflow sendReminders triggered for subscriptionId: ${context.requestPayload.subscriptionId}`);
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') {
    console.log(`Subscription not found or not active: ${subscriptionId}`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  console.log(`Processing reminders for renewalDate: ${renewalDate.format('YYYY-MM-DD')}`);

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}