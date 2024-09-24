#!/usr/bin/node
/**
 * Track progress and errors with Kue: Create the Job creator
 */
import { createQueue } from 'kue';

const queue = createQueue();

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account',
  },
];

for (const job of jobs) {
  const jobInstance = queue.create('push_notification_code_2', job);

  jobInstance
    .on('complete', (result) => {
      console.log(`Notification job ${jobInstance.id} completed successfully.`);
    })
    .on('failed', (err) => {
      console.error(`Notification job ${jobInstance.id} failed: ${err.message || err.toString()}`);
    })
    .on('progress', (progress) => {
      console.log(`Notification job ${jobInstance.id} is ${progress}% complete.`);
    })
    .save((err) => {
      if (err) {
        console.error(`Error creating job: ${err.message}`);
      } else {
        console.log(`Notification job created: ${jobInstance.id}`);
      }
    });
}
