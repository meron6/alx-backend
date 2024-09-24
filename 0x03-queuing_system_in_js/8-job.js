#!/usr/bin/node
/**
 * Writing the job creation function
 */
function createPushNotificationsJobs(jobs, queue) {
  // Validate that jobs is an array
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }

  // Iterate over the jobs array
  for (let job of jobs) {
    // Ensure the job contains the required fields
    if (!job.phoneNumber || !job.message) {
      console.error('Job is missing phoneNumber or message:', job);
      continue;
    }

    // Create the job in the queue
    const newJob = queue.create('push_notification_code_3', job);

    // Attach event handlers to the job
    newJob
      .on('complete', () => {
        console.log(`Notification job ${newJob.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Notification job ${newJob.id} failed: ${err.message || err.toString()}`);
      })
      .on('progress', (progress) => {
        console.log(`Notification job ${newJob.id} ${progress}% complete`);
      })
      .save((err) => {
        if (err) {
          console.log(`Failed to create job ${newJob.id}: ${err.message || err.toString()}`);
        } else {
          console.log(`Notification job created: ${newJob.id}`);
        }
      });
  }
}

module.exports = createPushNotificationsJobs;
