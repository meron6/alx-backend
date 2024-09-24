#!/usr/bin/node
/**
 * Job processor
 */
import { createQueue } from 'kue';

const queue = createQueue();

function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

queue.process('push_notification_code', (job, done) => {
  try {
    sendNotification(job.data.phoneNumber, job.data.message);
    console.log(`Notification job ${job.id} processed successfully`);
    done(); // Mark the job as complete
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    done(new Error('Notification job failed')); // Mark the job as failed
  }
});

// Optional: Handle process termination signals to shut down the queue gracefully
process.on('SIGINT', () => {
  console.log('Shutting down the job processor...');
  queue.shutdown(5000, (err) => {
    console.log('Job processor shutdown complete');
    process.exit(err ? 1 : 0);
  });
});
