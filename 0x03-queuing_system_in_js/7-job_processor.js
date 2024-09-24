#!/usr/bin/node
/**
 * Track progress and errors with Kue: Create the Job processor
 */
import { createQueue } from 'kue';

const blacklist = ['4153518780', '4153518781'];
const queue = createQueue();

function sendNotification(phoneNumber, message, job, done) {
  const total = 100;
  const increment = 50; // Adjust increment for efficiency
  let currentProgress = 0;

  function next(p) {
    // Update progress at the beginning, halfway, and upon completion
    if (p === 0 || p === (total / 2)) {
      job.progress(p, total);
      if (p === (total / 2)) {
        console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
      }
    }

    // Check if phone number is blacklisted
    if (blacklist.includes(phoneNumber)) {
      return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    // Complete the job when progress reaches 100%
    if (p >= total) {
      console.log(`Notification sent successfully to ${phoneNumber}`);
      return done();
    }

    // Continue with the next progress step
    setTimeout(() => next(p + increment), 100); // Simulate time delay for each step
  }

  next(currentProgress);
}

// Process jobs in parallel, with 2 concurrency
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
