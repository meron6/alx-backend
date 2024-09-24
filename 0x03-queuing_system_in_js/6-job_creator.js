#!/usr/bin/node
/**
 * Create a job
 */
import { createQueue } from 'kue';

const queue = createQueue();
const jobData = { phoneNumber: '+2347065345423', message: 'Kindly verify your identification' };

const job = queue
  .create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error('Error creating job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

job.on('complete', (result) => {
  console.log('Notification job completed');
});

job.on('failed', (err) => {
  console.error('Notification job failed:', err);
});

// Optionally, you can handle process termination signals to gracefully shut down the queue
process.on('SIGINT', () => {
  console.log('Shutting down the queue...');
  queue.shutdown(5000, (err) => {
    console.log('Queue shutdown complete');
    process.exit(err ? 1 : 0);
  });
});
